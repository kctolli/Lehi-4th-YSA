'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from 'antd';

const NAV_ITEMS = [
    { href: '/bishopric/callings', label: 'Callings' },
    { href: '/bishopric/video-audit', label: 'Video Audit Tracker' },
    { href: '/bishopric/sacrament-attendance', label: 'Sacrament Attendance' },
    { href: '/bishopric/second-hour-attendance', label: '2nd Hour Attendance' },
    { href: '/bishopric/move-in', label: 'Move-Ins' },
    { href: '/bishopric/shared-files', label: 'Shared Files' }
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
        <section className="flex flex-col gap-6">
            <nav className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="-mx-4 flex gap-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href} className={`whitespace-nowrap ${pathname === item.href ? 'font-semibold' : 'text-gray-500'}`}>
                            {item.label}
                        </Link>
                    ))}
                </div>
                <Button onClick={handleLogout} className="self-end sm:self-auto">
                    Log out
                </Button>
            </nav>
            {children}
        </section>
    );
};

export default BishopricLayout;
