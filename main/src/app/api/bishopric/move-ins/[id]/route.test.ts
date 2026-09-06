import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const { sql } = vi.hoisted(() => ({ sql: vi.fn() }));

vi.mock('@/lib/db', () => ({ sql }));

import { DELETE } from './route';

const paramsFor = (id: string) => ({ params: Promise.resolve({ id }) });
const request = {} as NextRequest;

beforeEach(() => {
    sql.mockReset();
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
