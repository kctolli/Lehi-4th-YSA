import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS, constantTimeStringEqual, createSessionToken } from '@/lib/adminSession';

export async function POST(request: NextRequest) {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || typeof password !== 'string' || !constantTimeStringEqual(password, adminPassword)) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
    });

    return response;
}
