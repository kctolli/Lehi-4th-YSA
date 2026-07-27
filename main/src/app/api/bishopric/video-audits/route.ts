import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
    const rows = await sql`
        SELECT id, name, calling, date_watched
        FROM video_audit_tracker
        ORDER BY (date_watched IS NULL) DESC, name
    `;

    return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
    const { name, calling, date_watched } = await request.json();

    if (!name) {
        return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const [row] = await sql`
        INSERT INTO video_audit_tracker (name, calling, date_watched)
        VALUES (${name}, ${calling ?? null}, ${date_watched ?? null})
        RETURNING id, name, calling, date_watched
    `;

    return NextResponse.json(row, { status: 201 });
}
