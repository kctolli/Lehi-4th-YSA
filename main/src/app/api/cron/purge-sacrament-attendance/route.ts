import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const removed = await sql`
        DELETE FROM sacrament_attendance
        WHERE attendance_date < now() - interval '3 months'
        RETURNING id, count, attendance_date
    `;

    return NextResponse.json({ removedCount: removed.length, removed });
}
