import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const { sql } = vi.hoisted(() => ({ sql: vi.fn() }));

vi.mock('@/lib/db', () => ({ sql }));

import { DELETE, PUT } from './route';

const paramsFor = (id: string) => ({ params: Promise.resolve({ id }) });
const request = {} as NextRequest;
const requestWith = (body: unknown): NextRequest => ({ json: async () => body }) as unknown as NextRequest;

beforeEach(() => {
    sql.mockReset();
});

describe('PUT /api/bishopric/move-ins/[id]', () => {
    const insertedRow = {
        id: 7,
        first_name: 'Jane',
        last_name: 'Doe',
        member_record_number: null,
        gender: 'Female',
        birthday: '1995-06-15',
        address: '123 Main St',
        moved_in: true,
        moved_in_at: '2026-09-13T00:00:00.000Z',
        created_at: '2026-09-06T00:00:00.000Z'
    };

    it('marks the row as moved in and stamps moved_in_at', async () => {
        sql.mockResolvedValue([insertedRow]);

        const response = await PUT(requestWith({ moved_in: true }), paramsFor('7'));

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual(insertedRow);
        expect(sql.mock.calls[0].slice(1)).toEqual([true, true, '7']);
    });

    it('clears moved_in when toggled off', async () => {
        sql.mockResolvedValue([{ ...insertedRow, moved_in: false, moved_in_at: null }]);

        const response = await PUT(requestWith({ moved_in: false }), paramsFor('7'));

        expect(response.status).toBe(200);
        expect(sql.mock.calls[0].slice(1)).toEqual([false, false, '7']);
    });

    it('returns 404 when no row matched the id', async () => {
        sql.mockResolvedValue([]);

        const response = await PUT(requestWith({ moved_in: true }), paramsFor('999'));

        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ error: 'Not found' });
    });
});

describe('DELETE /api/bishopric/move-ins/[id]', () => {
    it('deletes the row and returns { ok: true } when it exists', async () => {
        sql.mockResolvedValue([{ id: 7 }]);

        const response = await DELETE(request, paramsFor('7'));

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ ok: true });

        // The awaited id is forwarded as the tagged-template value.
        expect(sql.mock.calls[0].slice(1)).toEqual(['7']);
    });

    it('returns 404 when no row matched the id', async () => {
        sql.mockResolvedValue([]);

        const response = await DELETE(request, paramsFor('999'));

        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ error: 'Not found' });
    });
});
