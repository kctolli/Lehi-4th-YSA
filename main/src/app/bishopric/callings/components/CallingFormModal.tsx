'use client';

import { useEffect } from 'react';
import { AutoComplete, Form, Input, Modal, Switch } from 'antd';
import { ORGANIZATIONS } from '@/utils/organizations';
import { Calling, CallingFormValues, DATE_FIELDS } from '../types';

interface CallingFormModalProps {
    open: boolean;
    editingCalling: Calling | null;
    confirmLoading: boolean;
    onCancel: () => void;
    onSubmit: (values: CallingFormValues) => void;
}

const CallingFormModal = ({ open, editingCalling, confirmLoading, onCancel, onSubmit }: CallingFormModalProps) => {
    const [form] = Form.useForm<CallingFormValues>();

    useEffect(() => {
        if (!open) return;
        if (editingCalling) {
            form.setFieldsValue({
                person_name: editingCalling.person_name,
                calling_name: editingCalling.calling_name,
                organization: editingCalling.organization ?? undefined,
                approved: editingCalling.approved,
                in_lcr: editingCalling.in_lcr,
                date_extended: !!editingCalling.date_extended,
                date_sustained: !!editingCalling.date_sustained,
                date_set_apart: !!editingCalling.date_set_apart,
                date_released: !!editingCalling.date_released,
                date_rejected: !!editingCalling.date_rejected,
                notes: editingCalling.notes ?? undefined
            });
        } else {
            form.resetFields();
        }
    }, [open, editingCalling, form]);

    const handleOk = async () => {
        const values = await form.validateFields();
        onSubmit(values);
    };

    return (
        <Modal title={editingCalling ? 'Edit Calling' : 'New Calling'} open={open} onCancel={onCancel} onOk={handleOk} confirmLoading={confirmLoading} destroyOnClose width={640}>
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
                        <Form.Item key={key} name={key} label={label} valuePropName="checked" initialValue={false}>
                            <Switch />
                        </Form.Item>
                    ))}
                </div>
                <Form.Item name="notes" label="Notes">
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CallingFormModal;
