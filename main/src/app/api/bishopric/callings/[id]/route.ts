import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const { person_name, calling_name, organization, approved, in_lcr, date_extended, date_sustained, date_set_apart, date_released, date_rejected, notes } = await request.json();

    if (!person_name || !calling_name) {
        return NextResponse.json({ error: 'person_name and calling_name are required' }, { status: 400 });
    }

    const [row] = await sql`
        UPDATE callings
        SET person_name = ${person_name},
            calling_name = ${calling_name},
            organization = ${organization ?? null},
            approved = ${approved ?? false},
            in_lcr = ${in_lcr ?? false},
            date_extended = ${date_extended ?? null},
            date_sustained = ${date_sustained ?? null},
            date_set_apart = ${date_set_apart ?? null},
            date_released = ${date_released ?? null},
            date_rejected = ${date_rejected ?? null},
            notes = ${notes ?? null},
            updated_at = now()
        WHERE id = ${id}
        RETURNING id, person_name, calling_name, organization, approved, in_lcr, date_extended, date_sustained, date_set_apart, date_released, date_rejected, notes
    `;

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const [row] = await sql`DELETE FROM callings WHERE id = ${id} RETURNING id`;

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
}
