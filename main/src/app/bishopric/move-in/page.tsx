'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInYears, format, parseISO } from 'date-fns';
import { App, Switch, Table } from 'antd';
import axios from 'axios';

interface MoveIn {
    id: number;
    first_name: string;
    last_name: string;
    member_record_number: string | null;
    gender: string;
    birthday: string;
    address: string;
    moved_in: boolean;
    moved_in_at: string | null;
    created_at: string;
}

const formatDate = (value: string | null): string => 
    (value ? format(parseISO(value), 'MMM d, yyyy') : '—');

const calculateAge = (birthday: string | null): number | null => 
    (!birthday ? null : differenceInYears(new Date(), parseISO(birthday)));

const MoveInPage = () => {
    const { message, modal } = App.useApp();
    const queryClient = useQueryClient();

    const { data: moveIns, isLoading } = useQuery({
        queryKey: ['bishopric', 'move-ins'],
        queryFn: async (): Promise<MoveIn[]> => {
            const { data } = await axios.get<MoveIn[]>('/api/bishopric/move-ins');
            return Array.isArray(data) ? data : [];
        }
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bishopric', 'move-ins'] });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => axios.delete(`/api/bishopric/move-ins/${id}`),
        onSuccess: () => {
            message.success('Deleted');
            invalidate();
        },
        onError: () => message.error('Failed to delete entry')
    });

    const toggleMovedInMutation = useMutation({
        mutationFn: ({ id, moved_in }: { id: number; moved_in: boolean }) => axios.put(`/api/bishopric/move-ins/${id}`, { moved_in }),
        onSuccess: invalidate,
        onError: () => message.error('Failed to update')
    });

    const handleDelete = (record: MoveIn) => {
        modal.confirm({
            title: `Delete move-in for ${record.first_name} ${record.last_name}?`,
            okType: 'danger',
            okText: 'Delete',
            onOk: () => deleteMutation.mutate(record.id)
        });
    };

    return (
        <section className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">Move-Ins</h1>

            <Table
                rowKey="id"
                loading={isLoading}
                dataSource={moveIns}
                pagination={{ pageSize: 20, hideOnSinglePage: true }}
                scroll={{ x: 'max-content' }}
                columns={[
                    {
                        title: 'Name',
                        key: 'name',
                        render: (_, record: MoveIn) => `${record.first_name} ${record.last_name}`
                    },
                    { title: 'Member Record Number', dataIndex: 'member_record_number', render: (value: string | null) => value || '—' },
                    { title: 'Gender', dataIndex: 'gender' },
                    { title: 'Birthday', dataIndex: 'birthday', render: formatDate },
                    {
                        title: 'Age',
                        key: 'age',
                        render: (_, record: MoveIn) => calculateAge(record.birthday) ?? '—'
                    },
                    { title: 'Address', dataIndex: 'address', render: (value: string) => <span className="block max-w-[16rem] whitespace-pre-wrap">{value}</span> },
                    { title: 'Submitted', dataIndex: 'created_at', render: formatDate },
                    {
                        title: 'Moved In',
                        key: 'moved_in',
                        render: (_, record: MoveIn) => <Switch checked={record.moved_in} onChange={(checked) => toggleMovedInMutation.mutate({ id: record.id, moved_in: checked })} />
                    },
                    {
                        title: '',
                        key: 'actions',
                        render: (_, record: MoveIn) => (
                            <button type="button" aria-label="Delete entry" className="leading-none text-red-500 hover:text-red-700" onClick={() => handleDelete(record)}>
                                ×
                            </button>
                        )
                    }
                ]}
            />
        </section>
    );
};

export default MoveInPage;
