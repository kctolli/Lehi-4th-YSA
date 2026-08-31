'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, AutoComplete, Button, Form, Input, Table, Tag } from 'antd';
import axios from 'axios';
import { ORGANIZATIONS } from '@/utils/organizations';

interface WardCouncilEntry {
    id: number;
    person_name: string;
    calling_name: string;
    organization: string | null;
    approved: boolean;
}

interface WardCouncilFormValues {
    person_name: string;
    calling_name: string;
    organization?: string;
}

const fetchEntries = async (): Promise<WardCouncilEntry[]> => {
    const { data } = await axios.get<WardCouncilEntry[]>('/api/ward-council');
    return Array.isArray(data) ? data : [];
};

const WardCouncilPage = () => {
    /*const { message } = App.useApp();
    const queryClient = useQueryClient();
    const [form] = Form.useForm<WardCouncilFormValues>();

    const { data: entries, isLoading } = useQuery({
        queryKey: ['ward-council'],
        queryFn: fetchEntries
    });

    const submitMutation = useMutation({
        mutationFn: (values: WardCouncilFormValues) => axios.post('/api/ward-council', { ...values, submitted_at: new Date().toISOString() }),
        onSuccess: () => {
            message.success('Submitted for approval');
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ['ward-council'] });
        },
        onError: () => message.error('Failed to submit')
    });

    const handleSubmit = async () => {
        const values = await form.validateFields();
        submitMutation.mutate(values);
    };*/

    return (
        <section className="flex flex-col gap-8">
            <p>
                Page is currently turned off based on Bishop Mondragon's recommendation. 
                Please contact the Bishopric for questions.
            </p>
            {/*<div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Ward Council</h2>
                <Form form={form} layout="vertical" className="max-w-md">
                    <Form.Item name="person_name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="calling_name" label="Calling" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="organization" label="Organization">
                        <AutoComplete allowClear options={ORGANIZATIONS.map((organization) => ({ value: organization }))} filterOption={(inputValue, option) => !!option?.value.toLowerCase().includes(inputValue.toLowerCase())} />
                    </Form.Item>
                    <Button type="primary" onClick={handleSubmit} loading={submitMutation.isPending}>
                        Submit
                    </Button>
                </Form>
            </div>*/}
        </section>
    );
};

export default WardCouncilPage;
