// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const { get, del } = vi.hoisted(() => ({ get: vi.fn(), del: vi.fn() }));

vi.mock('axios', () => ({ default: { get, delete: del } }));

import { renderWithProviders, screen, waitFor, within } from '@/test/render';
import MoveInPage from './page';

const rows = [
    {
        id: 2,
        first_name: 'Amy',
        last_name: 'Ng',
        member_record_number: null,
        birthday: '1990-01-01',
        address: '1 A St',
        created_at: '2026-09-06T00:00:00.000Z'
    },
    {
        id: 1,
        first_name: 'Bob',
        last_name: 'Lee',
        member_record_number: '111-2222-3333',
        birthday: '1988-05-05',
        address: '2 B St',
        created_at: '2026-09-05T00:00:00.000Z'
    }
];

beforeEach(() => {
    get.mockReset();
    del.mockReset();
    get.mockResolvedValue({ data: rows });
    del.mockResolvedValue({ data: { ok: true } });
});

afterEach(() => {
    vi.useRealTimers();
});

describe('<MoveInPage /> (bishopric table)', () => {
    it('loads move-ins from the API and renders a row per entry', async () => {
        renderWithProviders(<MoveInPage />);

        expect(await screen.findByText('Amy Ng')).toBeInTheDocument();
        expect(screen.getByText('Bob Lee')).toBeInTheDocument();
        expect(get).toHaveBeenCalledWith('/api/bishopric/move-ins');

        // Formatted birthday and the "no member record number" placeholder.
        expect(screen.getByText('Jan 1, 1990')).toBeInTheDocument();
        expect(screen.getByText('111-2222-3333')).toBeInTheDocument();
        const amyRow = screen.getByText('Amy Ng').closest('tr')!;
        expect(within(amyRow).getByText('—')).toBeInTheDocument();
    });

    it('computes the age column from the birthday', async () => {
        vi.setSystemTime(new Date('2026-09-06T12:00:00Z'));
        renderWithProviders(<MoveInPage />);

        const amyRow = (await screen.findByText('Amy Ng')).closest('tr')!;
        expect(within(amyRow).getByText('36')).toBeInTheDocument();
    });

    it('falls back to an empty table when the API returns a non-array', async () => {
        get.mockResolvedValue({ data: { error: 'boom' } });
        renderWithProviders(<MoveInPage />);

        await waitFor(() => expect(get).toHaveBeenCalled());
        expect(screen.queryByText('Amy Ng')).not.toBeInTheDocument();
        expect(screen.getByText('No data', { selector: '.ant-empty-description' })).toBeInTheDocument();
    });

    it('deletes an entry after the confirmation dialog is accepted', async () => {
        const user = userEvent.setup();
        renderWithProviders(<MoveInPage />);

        const amyRow = (await screen.findByText('Amy Ng')).closest('tr')!;
        await user.click(within(amyRow).getByRole('button', { name: 'Delete entry' }));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Delete move-in for Amy Ng?')).toBeInTheDocument();
        await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

        await waitFor(() => expect(del).toHaveBeenCalledWith('/api/bishopric/move-ins/2'));
    });

    it('does not delete when the confirmation dialog is cancelled', async () => {
        const user = userEvent.setup();
        renderWithProviders(<MoveInPage />);

        const bobRow = (await screen.findByText('Bob Lee')).closest('tr')!;
        await user.click(within(bobRow).getByRole('button', { name: 'Delete entry' }));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Delete move-in for Bob Lee?')).toBeInTheDocument();
        await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

        // Give any (unwanted) delete mutation time to fire before asserting it didn't.
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(del).not.toHaveBeenCalled();
    });
});
