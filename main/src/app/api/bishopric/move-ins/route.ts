import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const rows = await sql`
        SELECT id, first_name, last_name, member_record_number, birthday, address, created_at
        FROM move_ins
        ORDER BY created_at DESC, id DESC
    `;

    return NextResponse.json(rows);
}
