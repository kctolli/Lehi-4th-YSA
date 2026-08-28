'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Input } from 'antd';
import axios from 'axios';
import { getTodayInAppTimeZone } from '@/utils/timezone';
import CallingFormModal from './components/CallingFormModal';
import CallingsTable from './components/CallingsTable';
import { Calling, CallingFormValues } from './types';

const CallingsPage = () => {
    const { message, modal } = App.useApp();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: callings, isLoading } = useQuery({
        queryKey: ['bishopric', 'callings'],
        queryFn: async (): Promise<Calling[]> => {
            const { data } = await axios.get<Calling[]>('/api/bishopric/callings');
            return Array.isArray(data) ? data : [];
        }
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bishopric', 'callings'] });

    const editingCalling = useMemo(() => (editingId ? (callings ?? []).find((calling) => calling.id === editingId) ?? null : null), [callings, editingId]);

    const filteredCallings = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return callings ?? [];
        return (callings ?? []).filter((calling) => calling.person_name.toLowerCase().includes(term) || calling.calling_name.toLowerCase().includes(term));
    }, [callings, searchTerm]);

    const saveMutation = useMutation({
        mutationFn: async (values: CallingFormValues) => {
            const resolveDate = (turnedOn: boolean | undefined, originalValue: string | null | undefined): string | null => {
                if (!turnedOn) return null;
                return originalValue ?? getTodayInAppTimeZone();
            };
            const resolveTimestamp = (turnedOn: boolean | undefined, originalValue: string | null | undefined): string | null => {
                if (!turnedOn) return null;
                return originalValue ?? new Date().toISOString();
            };

            const payload = {
                ...values,
                date_scheduled: resolveDate(values.date_scheduled, editingCalling?.date_scheduled),
                date_extended: resolveDate(values.date_extended, editingCalling?.date_extended),
                date_sustained: resolveDate(values.date_sustained, editingCalling?.date_sustained),
                date_set_apart: resolveDate(values.date_set_apart, editingCalling?.date_set_apart),
                date_released: resolveDate(values.date_released, editingCalling?.date_released),
                date_rejected: resolveDate(values.date_rejected, editingCalling?.date_rejected),
                in_lcr_at: resolveTimestamp(values.in_lcr, editingCalling?.in_lcr_at),
                ...(editingId ? {} : { submitted_at: new Date().toISOString() })
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
        mutationFn: ({ calling, in_lcr }: { calling: Calling; in_lcr: boolean }) => axios.put(`/api/bishopric/callings/${calling.id}`, { ...calling, in_lcr, in_lcr_at: in_lcr ? new Date().toISOString() : null }),
        onSuccess: invalidate,
        onError: () => message.error('Failed to update')
    });

    const toggleDateMutation = useMutation({
        mutationFn: ({ calling, field, checked }: { calling: Calling; field: 'date_scheduled' | 'date_extended' | 'date_sustained' | 'date_set_apart'; checked: boolean }) => axios.put(`/api/bishopric/callings/${calling.id}`, { ...calling, [field]: checked ? getTodayInAppTimeZone() : null }),
        onSuccess: invalidate,
        onError: () => message.error('Failed to update')
    });

    const openCreateModal = () => {
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (calling: Calling) => {
        setEditingId(calling.id);
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

    return (
        <section className="relative left-1/2 right-1/2 -mx-[50vw] flex w-screen flex-col gap-4 px-4 lg:px-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Callings</h1>
                <Button type="primary" onClick={openCreateModal}>
                    New Calling
                </Button>
            </div>

            <Input.Search allowClear placeholder="Search by name or calling" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="max-w-sm" />

            <CallingsTable
                data={filteredCallings}
                loading={isLoading}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onToggleApproved={(calling, approved) => toggleApprovedMutation.mutate({ calling, approved })}
                onToggleInLcr={(calling, in_lcr) => toggleInLcrMutation.mutate({ calling, in_lcr })}
                onToggleDate={(calling, field, checked) => toggleDateMutation.mutate({ calling, field, checked })}
            />

            <CallingFormModal open={isModalOpen} editingCalling={editingCalling} confirmLoading={saveMutation.isPending} onCancel={() => setIsModalOpen(false)} onSubmit={(values) => saveMutation.mutate(values)} />
        </section>
    );
};

export default CallingsPage;
