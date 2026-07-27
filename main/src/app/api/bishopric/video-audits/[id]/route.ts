import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const { name, calling, date_watched } = await request.json();

    if (!name) {
        return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const [row] = await sql`
        UPDATE video_audit_tracker
        SET name = ${name},
            calling = ${calling ?? null},
            date_watched = ${date_watched ?? null},
            updated_at = now()
        WHERE id = ${id}
        RETURNING id, name, calling, date_watched
    `;

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const [row] = await sql`DELETE FROM video_audit_tracker WHERE id = ${id} RETURNING id`;

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
}
