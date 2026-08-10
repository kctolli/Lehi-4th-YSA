'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, DatePicker, Form, Input, Modal, Switch, Table } from 'antd';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import axios from 'axios';
import { getTodayInAppTimeZone } from '@/utils/timezone';

interface VideoAudit {
    id: number;
    name: string;
    calling: string | null;
    date_watched: string | null;
}

interface VideoAuditFormValues {
    name: string;
    calling?: string;
    date_watched?: dayjs.Dayjs;
}

const formatDate = (value: string | null): string => (value ? format(parseISO(value), 'MMM d, yyyy') : '—');

const VideoAuditPage = () => {
    const { message, modal } = App.useApp();
    const queryClient = useQueryClient();
    const [form] = Form.useForm<VideoAuditFormValues>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data: audits, isLoading } = useQuery({
        queryKey: ['bishopric', 'video-audits'],
        queryFn: async (): Promise<VideoAudit[]> => {
            const { data } = await axios.get<VideoAudit[]>('/api/bishopric/video-audits');
            return Array.isArray(data) ? data : [];
        }
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bishopric', 'video-audits'] });

    const saveMutation = useMutation({
        mutationFn: async (values: VideoAuditFormValues) => {
            const payload = {
                ...values,
                date_watched: values.date_watched ? values.date_watched.format('YYYY-MM-DD') : null
            };
            if (editingId) {
                await axios.put(`/api/bishopric/video-audits/${editingId}`, payload);
            } else {
                await axios.post('/api/bishopric/video-audits', payload);
            }
        },
        onSuccess: () => {
            message.success('Saved');
            setIsModalOpen(false);
            invalidate();
        },
        onError: () => message.error('Failed to save entry')
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => axios.delete(`/api/bishopric/video-audits/${id}`),
        onSuccess: () => {
            message.success('Deleted');
            invalidate();
        },
        onError: () => message.error('Failed to delete entry')
    });

    const toggleWatchedMutation = useMutation({
        mutationFn: ({ audit, watched }: { audit: VideoAudit; watched: boolean }) =>
            axios.put(`/api/bishopric/video-audits/${audit.id}`, {
                name: audit.name,
                calling: audit.calling,
                date_watched: watched ? getTodayInAppTimeZone() : null
            }),
        onSuccess: invalidate,
        onError: () => message.error('Failed to update')
    });

    const openCreateModal = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (audit: VideoAudit) => {
        setEditingId(audit.id);
        form.setFieldsValue({
            name: audit.name,
            calling: audit.calling ?? undefined,
            date_watched: audit.date_watched ? dayjs(audit.date_watched) : undefined
        });
        setIsModalOpen(true);
    };

    const handleDelete = (audit: VideoAudit) => {
        modal.confirm({
            title: `Delete tracker entry for "${audit.name}"?`,
            okType: 'danger',
            okText: 'Delete',
            onOk: () => deleteMutation.mutate(audit.id)
        });
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();
        saveMutation.mutate(values);
    };

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Video Audit Tracker</h1>
                <Button type="primary" onClick={openCreateModal}>
                    New Entry
                </Button>
            </div>

            <Table
                rowKey="id"
                loading={isLoading}
                dataSource={audits}
                columns={[
                    { title: 'Name', dataIndex: 'name' },
                    { title: 'Calling', dataIndex: 'calling', render: (value: string | null) => value ?? '—' },
                    {
                        title: 'Watched',
                        render: (_, record: VideoAudit) => <Switch checked={!!record.date_watched} onChange={(checked) => toggleWatchedMutation.mutate({ audit: record, watched: checked })} />
                    },
                    { title: 'Date Watched', dataIndex: 'date_watched', render: formatDate },
                    {
                        title: 'Actions',
                        render: (_, record: VideoAudit) => (
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

            <Modal title={editingId ? 'Edit Entry' : 'New Entry'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleSubmit} confirmLoading={saveMutation.isPending} destroyOnClose>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="calling" label="Calling">
                        <Input />
                    </Form.Item>
                    <Form.Item name="date_watched" label="Date Watched">
                        <DatePicker className="w-full" />
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
};

export default VideoAuditPage;
