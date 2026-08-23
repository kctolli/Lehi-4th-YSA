'use client';

import { useMemo } from 'react';
import { Switch, Table, Tag } from 'antd';
import { formatTimestampInAppTimeZone } from '@/utils/timezone';
import { Calling, STATUSES, getStatus, getStatusValue } from '../types';

interface CallingsTableProps {
    data: Calling[];
    loading: boolean;
    onEdit: (calling: Calling) => void;
    onDelete: (calling: Calling) => void;
    onToggleApproved: (calling: Calling, approved: boolean) => void;
    onToggleInLcr: (calling: Calling, in_lcr: boolean) => void;
    onToggleDate: (calling: Calling, field: 'date_extended' | 'date_sustained' | 'date_set_apart', checked: boolean) => void;
}

const CallingsTable = ({ data, loading, onEdit, onDelete, onToggleApproved, onToggleInLcr, onToggleDate }: CallingsTableProps) => {
    const organizationFilters = useMemo(
        () =>
            Array.from(new Set(data.map((calling) => calling.organization).filter((value): value is string => !!value)))
                .sort()
                .map((value) => ({ text: value, value })),
        [data]
    );

    const callingFilters = useMemo(
        () =>
            Array.from(new Set(data.map((calling) => calling.calling_name)))
                .sort()
                .map((value) => ({ text: value, value })),
        [data]
    );

    return (
        <Table
            rowKey="id"
            loading={loading}
            dataSource={data}
            pagination={{ pageSize: 100 }}
            sticky={{ offsetHeader: 0 }}
            scroll={{ x: 'max-content' }}
            columns={[
                {
                    title: 'Name',
                    dataIndex: 'person_name',
                    fixed: 'left',
                    render: (value: string, record: Calling) => (
                        <div className="flex items-center gap-2">
                            <button type="button" className="text-blue-600 hover:underline text-left" onClick={() => onEdit(record)}>
                                {value}
                            </button>
                            <button type="button" aria-label={`Delete calling for ${value}`} className="text-red-500 hover:text-red-700 leading-none" onClick={() => onDelete(record)}>
                                ×
                            </button>
                        </div>
                    )
                },
                {
                    title: 'Calling',
                    dataIndex: 'calling_name',
                    sorter: (a: Calling, b: Calling) => a.calling_name.localeCompare(b.calling_name),
                    filters: callingFilters,
                    filterSearch: true,
                    onFilter: (value, record: Calling) => record.calling_name === value
                },
                {
                    title: 'Organization',
                    dataIndex: 'organization',
                    render: (value: string | null) => value ?? '—',
                    sorter: (a: Calling, b: Calling) => (a.organization ?? '').localeCompare(b.organization ?? ''),
                    filters: organizationFilters,
                    filterSearch: true,
                    onFilter: (value, record: Calling) => record.organization === value
                },
                {
                    title: 'Status',
                    sorter: (a: Calling, b: Calling) => getStatus(a).rank - getStatus(b).rank,
                    filters: STATUSES.map((status) => ({ text: status.label, value: status.value })),
                    onFilter: (value, record: Calling) => getStatusValue(record) === value,
                    render: (_, record: Calling) => {
                        const status = getStatus(record);
                        const label =
                            status.value === 'pending' && record.submitted_at ? (
                                <>
                                    <span>Proposed</span>
                                    <br />
                                    {formatTimestampInAppTimeZone(record.submitted_at)}
                                </>
                            ) : (
                                status.label
                            );
                        return <Tag color={status.color}>{label}</Tag>;
                    }
                },
                {
                    title: 'Approved',
                    render: (_, record: Calling) => <Switch checked={record.approved} onChange={(checked) => onToggleApproved(record, checked)} />
                },
                {
                    title: 'Extended',
                    render: (_, record: Calling) => <Switch checked={!!record.date_extended} onChange={(checked) => onToggleDate(record, 'date_extended', checked)} />
                },
                {
                    title: 'Sustained',
                    render: (_, record: Calling) => <Switch checked={!!record.date_sustained} onChange={(checked) => onToggleDate(record, 'date_sustained', checked)} />
                },
                {
                    title: 'Set Apart',
                    render: (_, record: Calling) => <Switch checked={!!record.date_set_apart} onChange={(checked) => onToggleDate(record, 'date_set_apart', checked)} />
                },
                {
                    title: 'In LCR',
                    render: (_, record: Calling) => <Switch checked={record.in_lcr} onChange={(checked) => onToggleInLcr(record, checked)} />
                }
            ]}
        />
    );
};

export default CallingsTable;
