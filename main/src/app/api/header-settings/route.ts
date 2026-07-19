import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
    const rows = await sql`
        SELECT key, value
        FROM header_settings
    `;

    return NextResponse.json(rows);
}
