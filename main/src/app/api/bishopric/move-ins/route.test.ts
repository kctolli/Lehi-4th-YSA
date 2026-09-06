import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sql } = vi.hoisted(() => ({ sql: vi.fn() }));

vi.mock('@/lib/db', () => ({ sql }));

import { GET } from './route';

const rows = [
    { id: 2, first_name: 'Amy', last_name: 'Ng', member_record_number: null, birthday: '1990-01-01', address: '1 A St', created_at: '2026-09-06T00:00:00.000Z' },
    { id: 1, first_name: 'Bob', last_name: 'Lee', member_record_number: '111-2222-3333', birthday: '1988-05-05', address: '2 B St', created_at: '2026-09-05T00:00:00.000Z' }
];

beforeEach(() => {
    sql.mockReset();
    sql.mockResolvedValue(rows);
});

describe('GET /api/bishopric/move-ins', () => {
    it('returns all move-in rows as JSON with a 200 status', async () => {
        const response = await GET();

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual(rows);
        expect(sql).toHaveBeenCalledTimes(1);
    });

    it('passes the rows through untouched when the table is empty', async () => {
        sql.mockResolvedValue([]);

        const response = await GET();

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual([]);
    });
});
