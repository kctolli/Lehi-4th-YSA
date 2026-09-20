import { NextRequest, NextResponse } from 'next/server';
import { purgeLcrCallings } from '@/lib/purgeLcr';

export async function GET(request: NextRequest) {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const removed = await purgeLcrCallings();

    return NextResponse.json({ removedCount: removed.length, removed });
}
