'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'antd';

const WardCouncilLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === '/ward-council/login') return <>{children}</>;

    const handleLogout = async () => {
        await fetch('/api/ward-council/logout', { method: 'POST' });
        router.push('/ward-council/login');
        router.refresh();
    };

    return (
        <section className="flex flex-col gap-6">
            <nav className="flex items-center justify-end border-b pb-4">
                <Button onClick={handleLogout}>Log out</Button>
            </nav>
            {children}
        </section>
    );
};

export default WardCouncilLayout;
