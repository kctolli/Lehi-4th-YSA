import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
    const rows = await sql`
        SELECT id, first_name, last_name, class, visiting, attendance_date, created_at
        FROM second_hour_attendance
        ORDER BY attendance_date DESC, class, last_name, first_name
    `;

    return NextResponse.json(rows);
}
