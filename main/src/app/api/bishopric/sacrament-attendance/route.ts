import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getTodayInAppTimeZone } from '@/utils/timezone';

export async function GET() {
    const rows = await sql`
        SELECT id, count, attendance_date, created_at
        FROM sacrament_attendance
        ORDER BY attendance_date DESC, id DESC
    `;

    return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
    const { count, attendance_date } = await request.json();
    const parsedCount = Number(count);

    if (!Number.isInteger(parsedCount) || parsedCount < 0) {
        return NextResponse.json({ error: 'count must be a non-negative integer' }, { status: 400 });
    }

    const date = attendance_date || getTodayInAppTimeZone();

    const [row] = await sql`
        INSERT INTO sacrament_attendance (count, attendance_date)
        VALUES (${parsedCount}, ${date})
        RETURNING id, count, attendance_date, created_at
    `;

    return NextResponse.json(row, { status: 201 });
}
