import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const removed = await sql`
        DELETE FROM move_ins
        WHERE moved_in = true
          AND moved_in_at IS NOT NULL
          AND moved_in_at < now() - interval '14 days'
        RETURNING id, first_name, last_name, moved_in_at
    `;

    return NextResponse.json({ removedCount: removed.length, removed });
}
