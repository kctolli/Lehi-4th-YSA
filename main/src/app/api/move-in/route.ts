import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

const MIN_AGE = 25;
const MAX_AGE = 36;

const ageInYears = (isoDate: string): number => {
    const birthday = new Date(`${isoDate}T00:00:00`);
    const now = new Date();
    let age = now.getFullYear() - birthday.getFullYear();
    const monthDiff = now.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
};

export async function POST(request: NextRequest) {
    const { first_name, last_name, member_record_number, birthday, address } = await request.json();

    const firstName = typeof first_name === 'string' ? first_name.trim() : '';
    const lastName = typeof last_name === 'string' ? last_name.trim() : '';
    const memberRecordNumber = typeof member_record_number === 'string' ? member_record_number.trim() : '';
    const birthdayValue = typeof birthday === 'string' ? birthday.trim() : '';
    const addressValue = typeof address === 'string' ? address.trim() : '';

    if (!firstName || !lastName || !birthdayValue || !addressValue) {
        return NextResponse.json({ error: 'first_name, last_name, birthday, and address are required' }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdayValue)) {
        return NextResponse.json({ error: 'birthday must be in YYYY-MM-DD format' }, { status: 400 });
    }

    const age = ageInYears(birthdayValue);
    if (age < MIN_AGE || age > MAX_AGE) {
        return NextResponse.json({ error: `This form is only for members ages ${MIN_AGE} to ${MAX_AGE}` }, { status: 400 });
    }

    const [row] = await sql`
        INSERT INTO move_ins (first_name, last_name, member_record_number, birthday, address)
        VALUES (${firstName}, ${lastName}, ${memberRecordNumber || null}, ${birthdayValue}, ${addressValue})
        RETURNING id, first_name, last_name, member_record_number, birthday, address, created_at
    `;

    return NextResponse.json(row, { status: 201 });
}
