import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const { sql } = vi.hoisted(() => ({ sql: vi.fn() }));

vi.mock('@/lib/db', () => ({ sql }));

import { POST } from './route';

// A minimal stand-in for NextRequest — the handler only calls `request.json()`.
const requestWith = (body: unknown): NextRequest => ({ json: async () => body }) as unknown as NextRequest;

const validBody = {
    first_name: 'Jane',
    last_name: 'Doe',
    member_record_number: '123-4567-8901',
    birthday: '1995-06-15',
    address: '123 Main St'
};

const insertedRow = {
    id: 1,
    first_name: 'Jane',
    last_name: 'Doe',
    member_record_number: '123-4567-8901',
    birthday: '1995-06-15',
    address: '123 Main St',
    created_at: '2026-09-06T00:00:00.000Z'
};

beforeEach(() => {
    // Freeze "now" (local noon) so age calculations are deterministic.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 6, 12, 0, 0));
    sql.mockReset();
    sql.mockResolvedValue([insertedRow]);
});

afterEach(() => {
    vi.useRealTimers();
});

describe('POST /api/move-in', () => {
    it('inserts a valid submission and returns 201 with the new row', async () => {
        const response = await POST(requestWith(validBody));

        expect(response.status).toBe(201);
        await expect(response.json()).resolves.toEqual(insertedRow);
        expect(sql).toHaveBeenCalledTimes(1);
    });

    it('trims whitespace and stores an empty member record number as null', async () => {
        await POST(
            requestWith({
                first_name: '  Jane  ',
                last_name: '  Doe  ',
                member_record_number: '   ',
                birthday: ' 1995-06-15 ',
                address: '  123 Main St  '
            })
        );

        const values = sql.mock.calls[0].slice(1);
        expect(values).toEqual(['Jane', 'Doe', null, '1995-06-15', '123 Main St']);
    });

    it.each([
        ['first_name', { ...validBody, first_name: '   ' }],
        ['last_name', { ...validBody, last_name: '' }],
        ['birthday', { ...validBody, birthday: '' }],
        ['address', { ...validBody, address: '   ' }]
    ])('returns 400 when %s is missing', async (_field, body) => {
        const response = await POST(requestWith(body));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            error: 'first_name, last_name, birthday, and address are required'
        });
        expect(sql).not.toHaveBeenCalled();
    });

    it.each(['06/15/1995', '1995-6-15', '1995-06-15T00:00:00', 'not-a-date'])(
        'returns 400 when birthday "%s" is not YYYY-MM-DD',
        async (birthday) => {
            const response = await POST(requestWith({ ...validBody, birthday }));

            expect(response.status).toBe(400);
            await expect(response.json()).resolves.toEqual({ error: 'birthday must be in YYYY-MM-DD format' });
            expect(sql).not.toHaveBeenCalled();
        }
    );

    it('returns 400 when the member is younger than 25', async () => {
        // Turns 24 on the frozen date.
        const response = await POST(requestWith({ ...validBody, birthday: '2002-09-06' }));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: 'This form is only for members ages 25 to 36' });
        expect(sql).not.toHaveBeenCalled();
    });

    it('returns 400 when the member is older than 36', async () => {
        // Turned 37 the day before the frozen date.
        const response = await POST(requestWith({ ...validBody, birthday: '1989-09-05' }));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: 'This form is only for members ages 25 to 36' });
        expect(sql).not.toHaveBeenCalled();
    });

    it('accepts the boundary ages 25 and 36', async () => {
        const justTurned25 = await POST(requestWith({ ...validBody, birthday: '2001-09-06' }));
        expect(justTurned25.status).toBe(201);

        const stillJustUnder37 = await POST(requestWith({ ...validBody, birthday: '1989-09-07' }));
        expect(stillJustUnder37.status).toBe(201);

        expect(sql).toHaveBeenCalledTimes(2);
    });
});
