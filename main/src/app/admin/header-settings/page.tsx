'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Form, Input } from 'antd';
import axios from 'axios';

interface HeaderSettingRow {
    key: string;
    value: string;
}

const FIELDS: { key: string; label: string }[] = [
    { key: 'bishop_name', label: 'Bishop Name' },
    { key: 'bishop_phone', label: 'Bishop Phone' },
    { key: 'exec_sec_name', label: 'Exec Sec Name' },
    { key: 'exec_sec_phone', label: 'Exec Sec Phone' },
    { key: 'fhe_time', label: 'FHE Time' },
    { key: 'stake_time', label: 'Stake Time' },
    { key: 'church_time', label: 'Church Time' }
];

const fetchHeaderSettings = async (): Promise<HeaderSettingRow[]> => {
    const { data } = await axios.get<HeaderSettingRow[]>('/api/admin/header-settings');
    return Array.isArray(data) ? data : [];
};

const HeaderSettingsAdminPage = () => {
    const { message } = App.useApp();
    const queryClient = useQueryClient();
    const [form] = Form.useForm<Record<string, string>>();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'header-settings'],
        queryFn: fetchHeaderSettings
    });

    useEffect(() => {
        if (!data) return;
        const values = data.reduce<Record<string, string>>((settings, row) => {
            settings[row.key] = row.value;
            return settings;
        }, {});
        form.setFieldsValue(values);
    }, [data, form]);

    const saveMutation = useMutation({
        mutationFn: (values: Record<string, string>) => axios.put('/api/admin/header-settings', values),
        onSuccess: () => {
            message.success('Saved');
            queryClient.invalidateQueries({ queryKey: ['admin', 'header-settings'] });
        },
        onError: () => message.error('Failed to save settings')
    });

    return (
        <section className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Header Settings</h1>
            <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)} disabled={isLoading} className="max-w-md">
                {FIELDS.map(({ key, label }) => (
                    <Form.Item key={key} name={key} label={label}>
                        <Input />
                    </Form.Item>
                ))}
                <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
                    Save
                </Button>
            </Form>
        </section>
    );
};

export default HeaderSettingsAdminPage;
