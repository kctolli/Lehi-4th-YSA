'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App, Button, Input } from 'antd';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { message } = App.useApp();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                message.error('Incorrect password');
                return;
            }

            router.push('/admin/announcements');
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mx-auto flex max-w-sm flex-col gap-4 pt-16">
            <h1 className="text-2xl font-semibold">Admin Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input.Password value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoFocus />
                <Button type="primary" htmlType="submit" loading={loading}>
                    Log in
                </Button>
            </form>
        </section>
    );
};

export default LoginPage;
