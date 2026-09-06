import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getTodayInAppTimeZone } from '@/utils/timezone';

const CLASSES = ['Elders Quorum', 'Relief Society', 'Sunday School'];

export async function POST(request: NextRequest) {
    const { first_name, last_name, class: className, visiting } = await request.json();

    const firstName = typeof first_name === 'string' ? first_name.trim() : '';
    const lastName = typeof last_name === 'string' ? last_name.trim() : '';

    if (!firstName || !lastName) {
        return NextResponse.json({ error: 'first_name and last_name are required' }, { status: 400 });
    }

    if (!CLASSES.includes(className)) {
        return NextResponse.json({ error: 'class must be one of ' + CLASSES.join(', ') }, { status: 400 });
    }

    const date = getTodayInAppTimeZone();

    const [row] = await sql`
        INSERT INTO second_hour_attendance (first_name, last_name, class, visiting, attendance_date)
        VALUES (${firstName}, ${lastName}, ${className}, ${Boolean(visiting)}, ${date})
        RETURNING id, first_name, last_name, class, visiting, attendance_date, created_at
    `;

    return NextResponse.json(row, { status: 201 });
}
