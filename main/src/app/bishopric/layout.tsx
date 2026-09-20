import type { Metadata, Viewport } from 'next';
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

// viewport-fit=cover lets the installed PWA draw under the translucent iOS status bar;
// the layout pads with env(safe-area-inset-*) so content isn't hidden by it.
export const viewport: Viewport = {
    themeColor: '#37281E',
    viewportFit: 'cover'
};

const BishopricLayout = 
    ({ children }: { children: ReactNode }) => 
    <BishopricLayoutClient>{children}</BishopricLayoutClient>;

export default BishopricLayout;
