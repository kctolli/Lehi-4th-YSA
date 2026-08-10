import { NextRequest, NextResponse } from 'next/server';
import { WARD_COUNCIL_SESSION_COOKIE, WARD_COUNCIL_SESSION_MAX_AGE_SECONDS, constantTimeStringEqual, createSessionToken } from '@/lib/wardCouncilSession';

export async function POST(request: NextRequest) {
    const { password } = await request.json();
    const wardCouncilPassword = process.env.WARD_COUNCIL_PASSWORD;

    if (!wardCouncilPassword || typeof password !== 'string' || !constantTimeStringEqual(password, wardCouncilPassword)) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(WARD_COUNCIL_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: WARD_COUNCIL_SESSION_MAX_AGE_SECONDS
    });

    return response;
}
