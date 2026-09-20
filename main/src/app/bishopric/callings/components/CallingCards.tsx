'use client';

import { Empty, Spin, Switch, Tag } from 'antd';
import { formatTimestampInAppTimeZone } from '@/utils/timezone';
import { Calling, getStatus } from '../types';

interface CallingCardsProps {
    data: Calling[];
    loading: boolean;
    onEdit: (calling: Calling) => void;
    onDelete: (calling: Calling) => void;
    onToggleApproved: (calling: Calling, approved: boolean) => void;
    onToggleInLcr: (calling: Calling, in_lcr: boolean) => void;
    onToggleDate: (calling: Calling, field: 'date_scheduled' | 'date_extended' | 'date_sustained' | 'date_set_apart', checked: boolean) => void;
}

const CallingCards = ({ data, loading, onEdit, onDelete, onToggleApproved, onToggleInLcr, onToggleDate }: CallingCardsProps) => {
    if (loading) return <Spin className="py-8" />;
    if (data.length === 0) return <Empty />;

    return (
        <ul className="flex flex-col gap-3">
            {data.map((calling) => {
                const status = getStatus(calling);
                const statusLabel = status.value === 'pending' && calling.submitted_at ? `Proposed ${formatTimestampInAppTimeZone(calling.submitted_at)}` : status.label;
                const toggles = [
                    { label: 'Approved', checked: calling.approved, onChange: (checked: boolean) => onToggleApproved(calling, checked) },
                    { label: 'Scheduled', checked: !!calling.date_scheduled, onChange: (checked: boolean) => onToggleDate(calling, 'date_scheduled', checked) },
                    { label: 'Extended', checked: !!calling.date_extended, onChange: (checked: boolean) => onToggleDate(calling, 'date_extended', checked) },
                    { label: 'Sustained', checked: !!calling.date_sustained, onChange: (checked: boolean) => onToggleDate(calling, 'date_sustained', checked) },
                    { label: 'Set Apart', checked: !!calling.date_set_apart, onChange: (checked: boolean) => onToggleDate(calling, 'date_set_apart', checked) },
                    { label: 'In LCR', checked: calling.in_lcr, onChange: (checked: boolean) => onToggleInLcr(calling, checked) }
                ];

                return (
                    <li key={calling.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-col">
                                <button type="button" className="text-left text-lg font-semibold text-blue-600" onClick={() => onEdit(calling)}>
                                    {calling.person_name}
                                </button>
                                <span>{calling.calling_name}</span>
                                {calling.organization && <span className="text-sm text-gray-500">{calling.organization}</span>}
                            </div>
                            <button type="button" aria-label={`Delete calling for ${calling.person_name}`} className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center text-2xl leading-none text-red-500" onClick={() => onDelete(calling)}>
                                ×
                            </button>
                        </div>

                        <Tag color={status.color} className="w-fit whitespace-normal">
                            {statusLabel}
                        </Tag>

                        <div className="grid grid-cols-2 gap-x-4">
                            {toggles.map(({ label, checked, onChange }) => (
                                <label key={label} className="flex min-h-11 items-center justify-between gap-2">
                                    <span className="text-sm">{label}</span>
                                    <Switch checked={checked} onChange={onChange} />
                                </label>
                            ))}
                        </div>

                        {calling.notes && <p className="whitespace-pre-wrap border-t pt-3 text-sm text-gray-600">{calling.notes}</p>}
                    </li>
                );
            })}
        </ul>
    );
};

export default CallingCards;
