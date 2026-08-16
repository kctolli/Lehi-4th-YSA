import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
    const rows = await sql`
        SELECT id, person_name, calling_name, organization, approved
        FROM callings
        ORDER BY approved, organization NULLS LAST, person_name
    `;

    return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
    const { person_name, calling_name, organization, submitted_at } = await request.json();

    if (!person_name || !calling_name) {
        return NextResponse.json({ error: 'person_name and calling_name are required' }, { status: 400 });
    }

    const submittedAt = typeof submitted_at === 'string' && !Number.isNaN(Date.parse(submitted_at)) ? submitted_at : new Date().toISOString();

    const [row] = await sql`
        INSERT INTO callings (person_name, calling_name, organization, approved, submitted_at)
        VALUES (${person_name}, ${calling_name}, ${organization ?? null}, false, ${submittedAt})
        RETURNING id, person_name, calling_name, organization, approved
    `;

    return NextResponse.json(row, { status: 201 });
}
