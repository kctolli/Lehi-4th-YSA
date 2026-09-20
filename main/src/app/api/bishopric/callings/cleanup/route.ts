import { NextResponse } from 'next/server';
import { purgeLcrCallings } from '@/lib/purgeLcr';

export async function POST() {
    const removed = await purgeLcrCallings();

    return NextResponse.json({ removedCount: removed.length, removed });
}
