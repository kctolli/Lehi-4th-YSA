import { NextResponse } from 'next/server';

// Scoped to /bishopric so only the Bishopric area is installable as a PWA.
const manifest = {
    id: '/bishopric',
    name: 'Lehi YSA 4th Ward Bishopric',
    short_name: 'Bishopric',
    description: 'Bishopric tools for the Lehi YSA 4th Ward — callings, video audit tracker, ward council, and photos.',
    start_url: '/bishopric/callings',
    scope: '/bishopric',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#37281E',
    theme_color: '#37281E',
    categories: ['productivity', 'utilities'],
    icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
};

export const GET = () => 
    NextResponse.json(manifest, { headers: { 'Content-Type': 'application/manifest+json' } });
