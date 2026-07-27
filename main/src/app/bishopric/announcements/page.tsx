'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Form, Input, Modal, Table } from 'antd';
import axios from 'axios';
import { datetimeLocalToISO, formatZoned, isoToDatetimeLocal } from '@/utils/timezone';

interface Announcement {
    id: number;
    title: string;
    body: string;
    posted_at: string;
    expires_at: string | null;
}

interface AnnouncementFormValues {
    title: string;
    body: string;
    posted_at: string;
    expires_at?: string;
}

const fetchAnnouncements = async (): Promise<Announcement[]> => {
    const { data } = await axios.get<Announcement[]>('/api/bishopric/announcements');
    return Array.isArray(data) ? data : [];
};

const AnnouncementsPage = () => {
    const { message, modal } = App.useApp();
    const queryClient = useQueryClient();
    const [form] = Form.useForm<AnnouncementFormValues>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data: announcements, isLoading } = useQuery({
        queryKey: ['bishopric', 'announcements'],
        queryFn: fetchAnnouncements
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bishopric', 'announcements'] });

    const saveMutation = useMutation({
        mutationFn: async (values: AnnouncementFormValues) => {
            const payload = {
                ...values,
                posted_at: datetimeLocalToISO(values.posted_at),
                expires_at: values.expires_at ? datetimeLocalToISO(values.expires_at) : null
            };
            if (editingId) {
                await axios.put(`/api/bishopric/announcements/${editingId}`, payload);
            } else {
                await axios.post('/api/bishopric/announcements', payload);
            }
        },
        onSuccess: () => {
            message.success('Saved');
            setIsModalOpen(false);
            invalidate();
        },
        onError: () => message.error('Failed to save announcement')
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => axios.delete(`/api/bishopric/announcements/${id}`),
        onSuccess: () => {
            message.success('Deleted');
            invalidate();
        },
        onError: () => message.error('Failed to delete announcement')
    });

    const openCreateModal = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (announcement: Announcement) => {
        setEditingId(announcement.id);
        form.setFieldsValue({
            title: announcement.title,
            body: announcement.body,
            posted_at: isoToDatetimeLocal(announcement.posted_at),
            expires_at: announcement.expires_at ? isoToDatetimeLocal(announcement.expires_at) : undefined
        });
        setIsModalOpen(true);
    };

    const handleDelete = (announcement: Announcement) => {
        modal.confirm({
            title: `Delete "${announcement.title}"?`,
            okType: 'danger',
            okText: 'Delete',
            onOk: () => deleteMutation.mutate(announcement.id)
        });
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();
        saveMutation.mutate(values);
    };

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Announcements</h1>
                <Button type="primary" onClick={openCreateModal}>
                    New Announcement
                </Button>
            </div>

            <Table
                rowKey="id"
                loading={isLoading}
                dataSource={announcements}
                columns={[
                    { title: 'Title', dataIndex: 'title' },
                    {
                        title: 'Posted At',
                        dataIndex: 'posted_at',
                        render: (value: string) => formatZoned(value, 'MMM d, yyyy h:mm a')
                    },
                    {
                        title: 'Expires At',
                        dataIndex: 'expires_at',
                        render: (value: string | null) => (value ? formatZoned(value, 'MMM d, yyyy h:mm a') : '—')
                    },
                    {
                        title: 'Actions',
                        render: (_, record: Announcement) => (
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

            <Modal title={editingId ? 'Edit Announcement' : 'New Announcement'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleSubmit} confirmLoading={saveMutation.isPending} destroyOnClose>
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="body" label="Body" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="posted_at" label="Posted At (Mountain Time)" rules={[{ required: true }]}>
                        <Input type="datetime-local" />
                    </Form.Item>
                    <Form.Item name="expires_at" label="Expires At (Mountain Time)" extra="Optional. Announcement stops showing after this date.">
                        <Input type="datetime-local" />
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
};

export default AnnouncementsPage;
