import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
    const rows = await sql`
        SELECT id, person_name, calling_name, organization, approved, in_lcr,
               date_extended, date_sustained, date_set_apart, date_released, date_rejected, notes
        FROM callings
        ORDER BY organization NULLS LAST, person_name
    `;

    return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
    const { person_name, calling_name, organization, approved, in_lcr, date_extended, date_sustained, date_set_apart, date_released, date_rejected, notes } = await request.json();

    if (!person_name || !calling_name) {
        return NextResponse.json({ error: 'person_name and calling_name are required' }, { status: 400 });
    }

    const [row] = await sql`
        INSERT INTO callings (person_name, calling_name, organization, approved, in_lcr, date_extended, date_sustained, date_set_apart, date_released, date_rejected, notes)
        VALUES (${person_name}, ${calling_name}, ${organization ?? null}, ${approved ?? false}, ${in_lcr ?? false}, ${date_extended ?? null}, ${date_sustained ?? null}, ${date_set_apart ?? null}, ${date_released ?? null}, ${date_rejected ?? null}, ${notes ?? null})
        RETURNING id, person_name, calling_name, organization, approved, in_lcr, date_extended, date_sustained, date_set_apart, date_released, date_rejected, notes
    `;

    return NextResponse.json(row, { status: 201 });
}
