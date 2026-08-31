'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, DatePicker, Table } from 'antd';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import axios from 'axios';
import { getTodayInAppTimeZone } from '@/utils/timezone';

interface AttendanceRecord {
    id: number;
    count: number;
    attendance_date: string;
    created_at: string;
}

const formatDate = (value: string | null): string => (value ? format(parseISO(value), 'EEE, MMM d, yyyy') : '—');

const SacramentAttendancePage = () => {
    const { message, modal } = App.useApp();
    const queryClient = useQueryClient();
    const [count, setCount] = useState(0);
    const [date, setDate] = useState<dayjs.Dayjs>(dayjs(getTodayInAppTimeZone()));

    const { data: history, isLoading } = useQuery({
        queryKey: ['bishopric', 'sacrament-attendance'],
        queryFn: async (): Promise<AttendanceRecord[]> => {
            const { data } = await axios.get<AttendanceRecord[]>('/api/bishopric/sacrament-attendance');
            return Array.isArray(data) ? data : [];
        }
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bishopric', 'sacrament-attendance'] });

    const saveMutation = useMutation({
        mutationFn: () =>
            axios.post('/api/bishopric/sacrament-attendance', {
                count,
                attendance_date: date.format('YYYY-MM-DD')
            }),
        onSuccess: () => {
            message.success('Attendance saved');
            setCount(0);
            invalidate();
        },
        onError: () => message.error('Failed to save attendance')
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => axios.delete(`/api/bishopric/sacrament-attendance/${id}`),
        onSuccess: () => {
            message.success('Deleted');
            invalidate();
        },
        onError: () => message.error('Failed to delete entry')
    });

    const handleDelete = (record: AttendanceRecord) => {
        modal.confirm({
            title: `Delete attendance of ${record.count} for ${formatDate(record.attendance_date)}?`,
            okType: 'danger',
            okText: 'Delete',
            onOk: () => deleteMutation.mutate(record.id)
        });
    };

    const decrement = () => setCount((value) => Math.max(0, value - 1));
    const increment = () => setCount((value) => value + 1);

    return (
        <section className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">Sacrament Attendance</h1>

            <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-gray-200 p-6 shadow-sm">
                <DatePicker className="w-full" inputReadOnly allowClear={false} value={date} onChange={(value) => value && setDate(value)} />

                <div className="select-none text-6xl font-bold tabular-nums">{count}</div>

                <div className="flex w-full items-center justify-center gap-4">
                    <button
                        type="button"
                        aria-label="Subtract one"
                        onClick={decrement}
                        className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-300 text-4xl font-bold text-gray-700 transition active:scale-95 active:bg-gray-100 disabled:opacity-40"
                        disabled={count === 0}
                    >
                        −
                    </button>
                    <button type="button" aria-label="Add one" onClick={increment} className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500 text-4xl font-bold text-white transition active:scale-95 active:bg-blue-600">
                        +
                    </button>
                </div>

                <div className="flex w-full gap-2">
                    <Button size="large" className="flex-1" onClick={() => setCount(0)} disabled={count === 0}>
                        Reset
                    </Button>
                    <Button size="large" type="primary" className="flex-1" loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Attendance History</h2>
                <Table
                    rowKey="id"
                    loading={isLoading}
                    dataSource={history}
                    pagination={{ pageSize: 12, hideOnSinglePage: true }}
                    scroll={{ x: 'max-content' }}
                    columns={[
                        { title: 'Date', dataIndex: 'attendance_date', render: formatDate },
                        { title: 'Attendance', dataIndex: 'count' },
                        {
                            title: '',
                            key: 'actions',
                            render: (_, record: AttendanceRecord) => (
                                <button type="button" aria-label="Delete entry" className="leading-none text-red-500 hover:text-red-700" onClick={() => handleDelete(record)}>
                                    ×
                                </button>
                            )
                        }
                    ]}
                />
            </div>
        </section>
    );
};

export default SacramentAttendancePage;
