import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/adminSession';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
        return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isAuthenticated = await verifySessionToken(token);
    if (isAuthenticated) return NextResponse.next();
    if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/admin/login', request.url));
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*']
};
