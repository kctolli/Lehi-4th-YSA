import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import BishopricLayoutClient from './BishopricLayoutClient';

export const metadata: Metadata = {
    manifest: '/bishopric/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Lehi 4th'
    }
};

const BishopricLayout = ({ children }: { children: ReactNode }) => <BishopricLayoutClient>{children}</BishopricLayoutClient>;

export default BishopricLayout;
