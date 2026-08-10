'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, AutoComplete, Button, DatePicker, Form, Input, Modal, Switch, Table, Tag } from 'antd';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import axios from 'axios';
import { ORGANIZATIONS } from '@/utils/organizations';

interface Calling {
    id: number;
    person_name: string;
    calling_name: string;
    organization: string | null;
    approved: boolean;
    in_lcr: boolean;
    date_extended: string | null;
    date_sustained: string | null;
    date_set_apart: string | null;
    date_released: string | null;
    date_rejected: string | null;
    notes: string | null;
}

interface CallingFormValues {
    person_name: string;
    calling_name: string;
    organization?: string;
    approved?: boolean;
    in_lcr?: boolean;
    date_extended?: dayjs.Dayjs;
    date_sustained?: dayjs.Dayjs;
    date_set_apart?: dayjs.Dayjs;
    date_released?: dayjs.Dayjs;
    date_rejected?: dayjs.Dayjs;
    notes?: string;
}

const DATE_FIELDS: { key: keyof Pick<CallingFormValues, 'date_extended' | 'date_sustained' | 'date_set_apart' | 'date_released' | 'date_rejected'>; label: string }[] = [
    { key: 'date_extended', label: 'Date Extended' },
    { key: 'date_sustained', label: 'Date Sustained' },
    { key: 'date_set_apart', label: 'Date Set Apart' },
    { key: 'date_released', label: 'Date Released' },
    { key: 'date_rejected', label: 'Date Rejected' }
];

const formatDate = (value: string | null): string => (value ? format(parseISO(value), 'MMM d, yyyy') : '—');

const STATUSES: { value: string; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending Approval', color: 'default' },
    { value: 'approved', label: 'Approved', color: 'cyan' },
    { value: 'extended', label: 'Extended', color: 'orange' },
    { value: 'sustained', label: 'Sustained', color: 'blue' },
    { value: 'set_apart', label: 'Set Apart', color: 'green' },
    { value: 'released', label: 'Released', color: 'default' },
    { value: 'rejected', label: 'Rejected', color: 'red' }
];

const STATUS_BY_VALUE = new Map(STATUSES.map((status, index) => [status.value, { ...status, rank: index }]));

const getStatusValue = (calling: Calling): string => {
    if (calling.date_rejected) return 'rejected';
    if (calling.date_released) return 'released';
    if (calling.date_set_apart) return 'set_apart';
    if (calling.date_sustained) return 'sustained';
    if (calling.date_extended) return 'extended';
    if (calling.approved) return 'approved';
    return 'pending';
};

const getStatus = (calling: Calling) => STATUS_BY_VALUE.get(getStatusValue(calling)) ?? STATUS_BY_VALUE.get('pending')!;

const CallingsPage = () => {
    const { message, modal } = App.useApp();
    const queryClient = useQueryClient();
    const [form] = Form.useForm<CallingFormValues>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data: callings, isLoading } = useQuery({
        queryKey: ['bishopric', 'callings'],
        queryFn: async (): Promise<Calling[]> => {
            const { data } = await axios.get<Calling[]>('/api/bishopric/callings');
            return Array.isArray(data) ? data : [];
        }
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bishopric', 'callings'] });

    const organizationFilters = useMemo(
        () =>
            Array.from(new Set((callings ?? []).map((calling) => calling.organization).filter((value): value is string => !!value)))
                .sort()
                .map((value) => ({ text: value, value })),
        [callings]
    );

    const callingFilters = useMemo(
        () =>
            Array.from(new Set((callings ?? []).map((calling) => calling.calling_name)))
                .sort()
                .map((value) => ({ text: value, value })),
        [callings]
    );

    const saveMutation = useMutation({
        mutationFn: async (values: CallingFormValues) => {
            const payload = {
                ...values,
                date_extended: values.date_extended ? values.date_extended.format('YYYY-MM-DD') : null,
                date_sustained: values.date_sustained ? values.date_sustained.format('YYYY-MM-DD') : null,
                date_set_apart: values.date_set_apart ? values.date_set_apart.format('YYYY-MM-DD') : null,
                date_released: values.date_released ? values.date_released.format('YYYY-MM-DD') : null,
                date_rejected: values.date_rejected ? values.date_rejected.format('YYYY-MM-DD') : null
            };
            if (editingId) {
                await axios.put(`/api/bishopric/callings/${editingId}`, payload);
            } else {
                await axios.post('/api/bishopric/callings', payload);
            }
        },
        onSuccess: () => {
            message.success('Saved');
            setIsModalOpen(false);
            invalidate();
        },
        onError: () => message.error('Failed to save calling')
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => axios.delete(`/api/bishopric/callings/${id}`),
        onSuccess: () => {
            message.success('Deleted');
            invalidate();
        },
        onError: () => message.error('Failed to delete calling')
    });

    const toggleApprovedMutation = useMutation({
        mutationFn: ({ calling, approved }: { calling: Calling; approved: boolean }) => axios.put(`/api/bishopric/callings/${calling.id}`, { ...calling, approved }),
        onSuccess: invalidate,
        onError: () => message.error('Failed to update')
    });

    const toggleInLcrMutation = useMutation({
        mutationFn: ({ calling, in_lcr }: { calling: Calling; in_lcr: boolean }) => axios.put(`/api/bishopric/callings/${calling.id}`, { ...calling, in_lcr }),
        onSuccess: invalidate,
        onError: () => message.error('Failed to update')
    });

    const openCreateModal = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (calling: Calling) => {
        setEditingId(calling.id);
        form.setFieldsValue({
            person_name: calling.person_name,
            calling_name: calling.calling_name,
            organization: calling.organization ?? undefined,
            approved: calling.approved,
            in_lcr: calling.in_lcr,
            date_extended: calling.date_extended ? dayjs(calling.date_extended) : undefined,
            date_sustained: calling.date_sustained ? dayjs(calling.date_sustained) : undefined,
            date_set_apart: calling.date_set_apart ? dayjs(calling.date_set_apart) : undefined,
            date_released: calling.date_released ? dayjs(calling.date_released) : undefined,
            date_rejected: calling.date_rejected ? dayjs(calling.date_rejected) : undefined,
            notes: calling.notes ?? undefined
        });
        setIsModalOpen(true);
    };

    const handleDelete = (calling: Calling) => {
        modal.confirm({
            title: `Delete calling for "${calling.person_name}"?`,
            okType: 'danger',
            okText: 'Delete',
            onOk: () => deleteMutation.mutate(calling.id)
        });
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();
        saveMutation.mutate(values);
    };

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Callings</h1>
                <Button type="primary" onClick={openCreateModal}>
                    New Calling
                </Button>
            </div>

            <Table
                rowKey="id"
                loading={isLoading}
                dataSource={callings}
                columns={[
                    { title: 'Name', dataIndex: 'person_name' },
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
                            return <Tag color={status.color}>{status.label}</Tag>;
                        }
                    },
                    { title: 'Sustained', dataIndex: 'date_sustained', render: formatDate },
                    { title: 'Set Apart', dataIndex: 'date_set_apart', render: formatDate },
                    {
                        title: 'Approved',
                        render: (_, record: Calling) => <Switch checked={record.approved} onChange={(checked) => toggleApprovedMutation.mutate({ calling: record, approved: checked })} />
                    },
                    {
                        title: 'In LCR',
                        render: (_, record: Calling) => <Switch checked={record.in_lcr} onChange={(checked) => toggleInLcrMutation.mutate({ calling: record, in_lcr: checked })} />
                    },
                    {
                        title: 'Actions',
                        render: (_, record: Calling) => (
                            <div className="flex gap-2">
                                <Button size="small" onClick={() => openEditModal(record)}>
                                    Edit
                                </Button>
                                <Button size="small" danger onClick={() => handleDelete(record)}>
                                    Delete
                                </Button>
                            </div>
                        )
                    }
                ]}
            />

            <Modal title={editingId ? 'Edit Calling' : 'New Calling'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleSubmit} confirmLoading={saveMutation.isPending} destroyOnClose width={640}>
                <Form form={form} layout="vertical">
                    <Form.Item name="person_name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="calling_name" label="Calling" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="organization" label="Organization">
                        <AutoComplete allowClear options={ORGANIZATIONS.map((organization) => ({ value: organization }))} filterOption={(inputValue, option) => !!option?.value.toLowerCase().includes(inputValue.toLowerCase())} />
                    </Form.Item>
                    <Form.Item name="approved" label="Approved" valuePropName="checked" initialValue={false}>
                        <Switch />
                    </Form.Item>
                    <Form.Item name="in_lcr" label="In LCR" valuePropName="checked" initialValue={false}>
                        <Switch />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-x-4">
                        {DATE_FIELDS.map(({ key, label }) => (
                            <Form.Item key={key} name={key} label={label}>
                                <DatePicker className="w-full" />
                            </Form.Item>
                        ))}
                    </div>
                    <Form.Item name="notes" label="Notes">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
};

export default CallingsPage;
