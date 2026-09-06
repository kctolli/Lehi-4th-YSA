// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('axios', () => ({
    default: {
        post,
        isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError)
    }
}));

// antd's DatePicker is a portal-driven calendar that is impractical to drive in
// jsdom; swap it for a native date input that still feeds a dayjs value into the
// surrounding Form.Item, exactly like the real component does.
vi.mock('antd', async () => {
    const actual = await vi.importActual<typeof import('antd')>('antd');
    const MockDatePicker = ({
        onChange,
        value
    }: {
        onChange?: (value: dayjs.Dayjs | null, dateString: string) => void;
        value?: dayjs.Dayjs;
    }) => (
        <input
            type="date"
            data-testid="birthday-input"
            value={value ? value.format('YYYY-MM-DD') : ''}
            onChange={(event) => onChange?.(event.target.value ? dayjs(event.target.value) : null, event.target.value)}
        />
    );
    return { ...actual, DatePicker: MockDatePicker };
});

import { renderWithProviders, screen, waitFor } from '@/test/render';
import MoveInPage from './page';

const inRangeBirthday = dayjs().subtract(30, 'year').format('YYYY-MM-DD');

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>, birthday = inRangeBirthday) => {
    await user.type(screen.getByLabelText('First Name'), 'Jane');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText(/Member Record Number/), '123-4567-8901');
    await user.clear(screen.getByTestId('birthday-input'));
    await user.type(screen.getByTestId('birthday-input'), birthday);
    await user.type(screen.getByLabelText('Address'), '123 Main St');
};

beforeEach(() => {
    post.mockReset();
    post.mockResolvedValue({ data: {} });
});

describe('<MoveInPage /> (public form)', () => {
    it('renders every field and the submit button', () => {
        renderWithProviders(<MoveInPage />);

        expect(screen.getByRole('heading', { name: 'Move-In Form' })).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText(/Member Record Number/)).toBeInTheDocument();
        expect(screen.getByLabelText('Address')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('shows required-field errors and does not call the API on an empty submit', async () => {
        const user = userEvent.setup();
        renderWithProviders(<MoveInPage />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Birthday is required')).toBeInTheDocument();
        expect(screen.getByText('Address is required')).toBeInTheDocument();
        expect(post).not.toHaveBeenCalled();
    });

    it('rejects a birthday outside the 25–36 age range', async () => {
        const user = userEvent.setup();
        renderWithProviders(<MoveInPage />);

        await fillValidForm(user, dayjs().subtract(18, 'year').format('YYYY-MM-DD'));
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('This form is only for members ages 25 to 36')).toBeInTheDocument();
        expect(post).not.toHaveBeenCalled();
    });

    it('posts the trimmed payload and shows the thank-you screen on success', async () => {
        const user = userEvent.setup();
        renderWithProviders(<MoveInPage />);

        await fillValidForm(user);
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() =>
            expect(post).toHaveBeenCalledWith('/api/move-in', {
                first_name: 'Jane',
                last_name: 'Doe',
                member_record_number: '123-4567-8901',
                birthday: inRangeBirthday,
                address: '123 Main St'
            })
        );

        expect(await screen.findByRole('heading', { name: 'Thank you!' })).toBeInTheDocument();

        // "Add another" returns to a blank form.
        await user.click(screen.getByRole('button', { name: 'Add another' }));
        expect(screen.getByRole('heading', { name: 'Move-In Form' })).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toHaveValue('');
    });

    it('sends an empty string when the optional member record number is blank', async () => {
        const user = userEvent.setup();
        renderWithProviders(<MoveInPage />);

        await user.type(screen.getByLabelText('First Name'), 'Jane');
        await user.type(screen.getByLabelText('Last Name'), 'Doe');
        await user.type(screen.getByTestId('birthday-input'), inRangeBirthday);
        await user.type(screen.getByLabelText('Address'), '123 Main St');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() =>
            expect(post).toHaveBeenCalledWith('/api/move-in', expect.objectContaining({ member_record_number: '' }))
        );
    });

    it('surfaces the API error message when the submission fails', async () => {
        post.mockRejectedValue({
            isAxiosError: true,
            response: { data: { error: 'Member already exists' } }
        });
        const user = userEvent.setup();
        renderWithProviders(<MoveInPage />);

        await fillValidForm(user);
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('Member already exists')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Thank you!' })).not.toBeInTheDocument();
    });
});
