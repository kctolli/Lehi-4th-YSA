import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const rows = await sql`
        SELECT id, first_name, last_name, member_record_number, gender, birthday, address, phone_number, moved_in, moved_in_at, created_at
        FROM move_ins
        ORDER BY created_at DESC, id DESC
    `;

    return NextResponse.json(rows);
}

export async function DELETE() {
    const removed = await sql`DELETE FROM move_ins WHERE moved_in = true RETURNING id`;

    return NextResponse.json({ removedCount: removed.length });
}
