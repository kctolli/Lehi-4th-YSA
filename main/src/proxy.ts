import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySessionToken as verifyAdminSessionToken } from '@/lib/adminSession';
import { BISHOPRIC_SESSION_COOKIE, verifySessionToken as verifyBishopricSessionToken } from '@/lib/bishopricSession';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/bishopric') || pathname.startsWith('/api/bishopric')) {
        if (pathname === '/bishopric/login' || pathname === '/api/bishopric/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get(BISHOPRIC_SESSION_COOKIE)?.value;
        const isAuthenticated = await verifyBishopricSessionToken(token);
        if (isAuthenticated) return NextResponse.next();
        if (pathname.startsWith('/api/bishopric')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.redirect(new URL('/bishopric/login', request.url));
    }

    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
        return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isAuthenticated = await verifyAdminSessionToken(token);
    if (isAuthenticated) return NextResponse.next();
    if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/admin/login', request.url));
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*', '/bishopric/:path*', '/api/bishopric/:path*']
};
