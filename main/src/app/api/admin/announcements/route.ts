import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
    const rows = await sql`
        SELECT id, title, body, posted_at
        FROM announcements
        ORDER BY posted_at DESC
    `;

    return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
    const { title, body, posted_at } = await request.json();

    if (!title || !body || !posted_at) {
        return NextResponse.json({ error: 'title, body, and posted_at are required' }, { status: 400 });
    }

    const [row] = await sql`
        INSERT INTO announcements (title, body, posted_at)
        VALUES (${title}, ${body}, ${posted_at})
        RETURNING id, title, body, posted_at
    `;

    return NextResponse.json(row, { status: 201 });
}
