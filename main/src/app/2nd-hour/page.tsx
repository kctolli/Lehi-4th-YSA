'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { App, Button, Form, Input, Select, Switch } from 'antd';
import axios from 'axios';

interface SecondHourFormValues {
    first_name: string;
    last_name: string;
    class: string;
    visiting: boolean;
}

const CLASS_OPTIONS = [
    { value: 'Elders Quorum', label: 'Elders Quorum' },
    { value: 'Relief Society', label: 'Relief Society' },
    { value: 'Sunday School', label: 'Sunday School' }
];

const SecondHourPage = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm<SecondHourFormValues>();
    const [submitted, setSubmitted] = useState(false);

    const submitMutation = useMutation({
        mutationFn: (values: SecondHourFormValues) => axios.post('/api/second-hour', values),
        onSuccess: () => {
            setSubmitted(true);
            form.resetFields();
        },
        onError: () => message.error('Something went wrong. Please try again.')
    });

    const handleSubmit = async () => {
        const values = await form.validateFields();
        submitMutation.mutate({ ...values, visiting: Boolean(values.visiting) });
    };

    if (submitted) {
        return (
            <section className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pt-16 text-center">
                <h1 className="text-2xl font-semibold">Thank you!</h1>
                <p>Your attendance has been recorded.</p>
                <Button type="primary" onClick={() => setSubmitted(false)}>
                    Add another
                </Button>
            </section>
        );
    }

    return (
        <section className="mx-auto flex w-full max-w-md flex-col gap-6">
            <h1 className="text-2xl font-semibold">2nd Hour Attendance</h1>

            <Form form={form} layout="vertical" initialValues={{ visiting: false }} onFinish={handleSubmit}>
                <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'First name is required' }]}>
                    <Input autoComplete="given-name" />
                </Form.Item>

                <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Last name is required' }]}>
                    <Input autoComplete="family-name" />
                </Form.Item>

                <Form.Item name="class" label="Class" rules={[{ required: true, message: 'Please choose a class' }]}>
                    <Select options={CLASS_OPTIONS} placeholder="Select a class" />
                </Form.Item>

                <Form.Item name="visiting" label="Visiting" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Button type="primary" htmlType="submit" block loading={submitMutation.isPending}>
                    Submit
                </Button>
            </Form>
        </section>
    );
};

export default SecondHourPage;
