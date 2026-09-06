'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { App, Button, DatePicker, Form, Input } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import axios from 'axios';

const MIN_AGE = 25;
const MAX_AGE = 36;
const AGE_RANGE_MESSAGE = `This form is only for members ages ${MIN_AGE} to ${MAX_AGE}`;

interface MoveInFormValues {
    first_name: string;
    last_name: string;
    member_record_number?: string | null;
    birthday: Dayjs;
    address: string;
}

interface MoveInPayload {
    first_name: string;
    last_name: string;
    member_record_number: string;
    birthday: string;
    address: string;
}

const MoveInPage = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm<MoveInFormValues>();
    const [submitted, setSubmitted] = useState(false);

    const submitMutation = useMutation({
        mutationFn: (payload: MoveInPayload) => axios.post('/api/move-in', payload),
        onSuccess: () => {
            setSubmitted(true);
            form.resetFields();
        },
        onError: (error) => {
            const detail = axios.isAxiosError(error) ? (error.response?.data as { error?: string } | undefined)?.error : undefined;
            message.error(detail ?? 'Something went wrong. Please try again.');
        }
    });

    const handleSubmit = async () => {
        const values = await form.validateFields();
        submitMutation.mutate({
            first_name: values.first_name,
            last_name: values.last_name,
            member_record_number: values.member_record_number ?? '',
            birthday: values.birthday.format('YYYY-MM-DD'),
            address: values.address
        });
    };

    if (submitted) {
        return (
            <section className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pt-16 text-center">
                <h1 className="text-2xl font-semibold">Thank you!</h1>
                <p>Your move-in information has been submitted.</p>
                <Button type="primary" onClick={() => setSubmitted(false)}>
                    Add another
                </Button>
            </section>
        );
    }

    return (
        <section className="mx-auto flex w-full max-w-md flex-col gap-6">
            <h1 className="text-2xl font-semibold">Move-In Form</h1>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'First name is required' }]}>
                    <Input autoComplete="given-name" />
                </Form.Item>

                <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Last name is required' }]}>
                    <Input autoComplete="family-name" />
                </Form.Item>

                <Form.Item name="member_record_number" label="Member Record Number (optional)">
                    <Input placeholder="XXX-XXXX-XXXX" inputMode="numeric" />
                </Form.Item>

                <Form.Item
                    name="birthday"
                    label="Birthday"
                    extra={`${AGE_RANGE_MESSAGE}.`}
                    rules={[
                        { required: true, message: 'Birthday is required' },
                        {
                            validator: (_, value: Dayjs | null | undefined) => {
                                if (!value) return Promise.resolve();
                                const age = dayjs().diff(value, 'year');
                                return age >= MIN_AGE && age <= MAX_AGE ? Promise.resolve() : Promise.reject(new Error(AGE_RANGE_MESSAGE));
                            }
                        }
                    ]}
                >
                    <DatePicker className="w-full" inputReadOnly format="YYYY-MM-DD" disabledDate={(current) => !!current && (current.isAfter(dayjs().subtract(MIN_AGE, 'year'), 'day') || current.isBefore(dayjs().subtract(MAX_AGE + 1, 'year'), 'day'))} />
                </Form.Item>

                <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Address is required' }]}>
                    <Input.TextArea rows={3} autoComplete="street-address" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block loading={submitMutation.isPending}>
                    Submit
                </Button>
            </Form>
        </section>
    );
};

export default MoveInPage;
