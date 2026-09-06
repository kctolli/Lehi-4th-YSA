'use client';

import { useQuery } from '@tanstack/react-query';
import { Table, Tag } from 'antd';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

interface SecondHourRecord {
    id: number;
    first_name: string;
    last_name: string;
    class: string;
    visiting: boolean;
    attendance_date: string;
    created_at: string;
}

const CLASSES = ['Elders Quorum', 'Relief Society', 'Sunday School'];

const formatDate = (value: string | null): string => (value ? format(parseISO(value), 'EEE, MMM d, yyyy') : '—');

const SecondHourAttendanceTable = ({ queryKey, endpoint }: { queryKey: string[]; endpoint: string }) => {
    const { data: records, isLoading } = useQuery({
        queryKey,
        queryFn: async (): Promise<SecondHourRecord[]> => {
            const { data } = await axios.get<SecondHourRecord[]>(endpoint);
            return Array.isArray(data) ? data : [];
        }
    });

    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between">
                <h1 className="text-2xl font-semibold">2nd Hour Attendance</h1>
                <span className="text-gray-500">{records?.length ?? 0} total</span>
            </div>

            <Table
                rowKey="id"
                loading={isLoading}
                dataSource={records}
                pagination={{ pageSize: 25, hideOnSinglePage: true }}
                scroll={{ x: 'max-content' }}
                columns={[
                    {
                        title: 'Date',
                        dataIndex: 'attendance_date',
                        render: formatDate,
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.attendance_date.localeCompare(b.attendance_date)
                    },
                    {
                        title: 'First Name',
                        dataIndex: 'first_name',
                        sorter: (a, b) => a.first_name.localeCompare(b.first_name)
                    },
                    {
                        title: 'Last Name',
                        dataIndex: 'last_name',
                        sorter: (a, b) => a.last_name.localeCompare(b.last_name)
                    },
                    {
                        title: 'Class',
                        dataIndex: 'class',
                        filters: CLASSES.map((value) => ({ text: value, value })),
                        onFilter: (value, record) => record.class === value
                    },
                    {
                        title: 'Visiting',
                        dataIndex: 'visiting',
                        filters: [
                            { text: 'Visiting', value: true },
                            { text: 'Member', value: false }
                        ],
                        onFilter: (value, record) => record.visiting === value,
                        render: (visiting: boolean) => (visiting ? <Tag color="blue">Visiting</Tag> : null)
                    }
                ]}
            />
        </section>
    );
};

export default SecondHourAttendanceTable;
