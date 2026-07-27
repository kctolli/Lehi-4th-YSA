import { NextRequest, NextResponse } from 'next/server';
import { BISHOPRIC_SESSION_COOKIE, BISHOPRIC_SESSION_MAX_AGE_SECONDS, constantTimeStringEqual, createSessionToken } from '@/lib/bishopricSession';

export async function POST(request: NextRequest) {
    const { password } = await request.json();
    const bishopricPassword = process.env.BISHOPRIC_PASSWORD;

    if (!bishopricPassword || typeof password !== 'string' || !constantTimeStringEqual(password, bishopricPassword)) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(BISHOPRIC_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: BISHOPRIC_SESSION_MAX_AGE_SECONDS
    });

    return response;
}
