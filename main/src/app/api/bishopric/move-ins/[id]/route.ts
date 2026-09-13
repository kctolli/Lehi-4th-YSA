import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const { moved_in } = await request.json();

    const [row] = await sql`
        UPDATE move_ins
        SET moved_in = ${!!moved_in},
            moved_in_at = CASE WHEN ${!!moved_in} THEN now() ELSE NULL END
        WHERE id = ${id}
        RETURNING id, first_name, last_name, member_record_number, gender, birthday, address, moved_in, moved_in_at, created_at
    `;

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const [row] = await sql`DELETE FROM move_ins WHERE id = ${id} RETURNING id`;

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
}
