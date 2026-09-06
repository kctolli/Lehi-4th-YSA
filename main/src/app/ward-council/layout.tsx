'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from 'antd';

const NAV_ITEMS = [{ href: '/ward-council/second-hour-attendance', label: '2nd Hour Attendance' }];

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
            <nav className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                <div className="flex flex-wrap gap-4">
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

export default WardCouncilLayout;
