import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const rows = await sql`
        SELECT id, title, body, posted_at
        FROM announcements
        WHERE posted_at > ${yesterday.toISOString()}
        ORDER BY posted_at DESC
    `;

    return NextResponse.json(rows);
}
