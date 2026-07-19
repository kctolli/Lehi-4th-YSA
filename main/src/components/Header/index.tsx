'use client';

import dynamic from 'next/dynamic';
import { Card } from 'antd';
import { useQuery } from '@tanstack/react-query';

import ChurchDetails from './ChurchDetails';
import { getHeaderSettings } from '@/utils/header-settings';

const Banner = dynamic(() => import('./Banner'), { ssr: false });

const Header = () => {
    const { data: settings } = useQuery({ queryKey: ['header-settings'], queryFn: getHeaderSettings });

    return (
        <>
            <Banner />
            <header className="flex w-full flex-col items-center justify-center gap-6 text-center sm:gap-8">
                <ChurchDetails churchTime={settings?.churchTime ?? ''} />

                <section className="mx-auto grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    {/* --- Leadership Section (2 per row -> 6/12 columns each) --- */}
                    <Card className="border-0 lg:col-span-6">
                        <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md sm:p-4">
                            <span className="font-medium sm:text-lg">{settings?.bishopName}</span>
                            <a className="text-tertiary transition-all hover:text-tertiary hover:underline" href={`tel: ${settings?.bishopPhone}`}>
                                {settings?.bishopPhone}
                            </a>
                        </div>
                    </Card>
                    <Card className="border-0 lg:col-span-6">
                        <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md sm:p-4">
                            <span className="font-medium sm:text-lg">{settings?.execSecName}</span>
                            <a className="text-tertiary transition-all hover:text-tertiary hover:underline" href={`tel: ${settings?.execSecPhone}`}>
                                {settings?.execSecPhone}
                            </a>
                        </div>
                    </Card>

                    {/* --- Operations Section (4 per row -> 3/12 columns each) --- */}
                    <Card className="border-0 lg:col-span-6">
                        <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md">
                            <span className="font-medium sm:text-lg">Activity Night</span>
                            <span>{settings?.fheTime}</span>
                        </div>
                    </Card>
                    <Card className="border-0 lg:col-span-6">
                        <div className="flex flex-col items-center justify-center gap-1 rounded border p-4 font-sans text-base uppercase text-primary shadow-md">
                            <span className="font-medium sm:text-lg">Stake Night</span>
                            <span>{settings?.stakeTime}</span>
                        </div>
                    </Card>
                </section>
            </header>
        </>
    );
};

export default Header;
