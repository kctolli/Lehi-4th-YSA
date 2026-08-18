import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const removed = await sql`
        DELETE FROM callings
        WHERE in_lcr = true AND in_lcr_at IS NOT NULL AND in_lcr_at < now() - interval '14 days'
        RETURNING id, person_name, calling_name, in_lcr_at
    `;

    return NextResponse.json({ removedCount: removed.length, removed });
}
