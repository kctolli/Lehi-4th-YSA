import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
    applicationName: 'Lehi 4th',
    title: 'Lehi YSA 4th Ward, 26–35',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Lehi 4th'
    }
};

export const viewport: Viewport = {
    themeColor: '#37281E'
};

const RootLayout = ({ children }: { children: ReactNode }) => (
    <html lang="en">
        <body>
            <Providers>
                <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 lg:px-0">
                    <main className="mt-8 flex flex-col gap-8 sm:mt-0">{children}</main>
                    <Footer />
                </section>
            </Providers>
            <ServiceWorkerRegister />
        </body>
    </html>
);

export default RootLayout;
