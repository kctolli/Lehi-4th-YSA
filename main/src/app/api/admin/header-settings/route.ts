import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
    const rows = await sql`SELECT key, value FROM header_settings`;
    return NextResponse.json(rows);
}

export async function PUT(request: NextRequest) {
    const settings = await request.json();

    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
        return NextResponse.json({ error: 'Expected an object of key/value pairs' }, { status: 400 });
    }

    const entries = Object.entries(settings).filter((entry): entry is [string, string] => typeof entry[1] === 'string');

    for (const [key, value] of entries) {
        const [updated] = await sql`UPDATE header_settings SET value = ${value} WHERE key = ${key} RETURNING key`;
        if (!updated) await sql`INSERT INTO header_settings (key, value) VALUES (${key}, ${value})`;
    }

    const rows = await sql`SELECT key, value FROM header_settings`;
    return NextResponse.json(rows);
}
