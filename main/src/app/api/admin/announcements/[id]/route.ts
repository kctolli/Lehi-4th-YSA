import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const { title, body, posted_at } = await request.json();

    if (!title || !body || !posted_at) {
        return NextResponse.json({ error: 'title, body, and posted_at are required' }, { status: 400 });
    }

    const [row] = await sql`
        UPDATE announcements
        SET title = ${title}, body = ${body}, posted_at = ${posted_at}
        WHERE id = ${id}
        RETURNING id, title, body, posted_at
    `;

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const [row] = await sql`DELETE FROM announcements WHERE id = ${id} RETURNING id`;

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
}
