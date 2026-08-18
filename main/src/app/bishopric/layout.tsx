'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from 'antd';

const NAV_ITEMS = [
    { href: '/bishopric/callings', label: 'Callings' },
    { href: '/bishopric/video-audit', label: 'Video Audit Tracker' }
];

const BishopricLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === '/bishopric/login') return <>{children}</>;

    const handleLogout = async () => {
        await fetch('/api/bishopric/logout', { method: 'POST' });
        router.push('/bishopric/login');
        router.refresh();
    };

    return (
        <section className="-ml-4 flex flex-col gap-6 lg:ml-0">
            <nav className="flex items-center justify-between border-b pb-4">
                <div className="flex gap-4">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href} className={pathname === item.href ? 'font-semibold' : 'text-gray-500'}>
                            {item.label}
                        </Link>
                    ))}
                </div>
                <Button onClick={handleLogout}>Log out</Button>
            </nav>
            {children}
        </section>
    );
};

export default BishopricLayout;
