import { NextResponse } from 'next/server';
import { WARD_COUNCIL_SESSION_COOKIE } from '@/lib/wardCouncilSession';

export async function POST() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(WARD_COUNCIL_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
    return response;
}
