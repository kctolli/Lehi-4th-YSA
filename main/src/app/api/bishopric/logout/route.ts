import { NextResponse } from 'next/server';
import { BISHOPRIC_SESSION_COOKIE } from '@/lib/bishopricSession';

export async function POST() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(BISHOPRIC_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
    return response;
}
