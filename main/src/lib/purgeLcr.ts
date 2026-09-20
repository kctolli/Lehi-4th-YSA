import { sql } from '@/lib/db';

export async function purgeLcrCallings() {
    return sql`
        DELETE FROM callings
        WHERE in_lcr = true
          AND in_lcr_at IS NOT NULL
          AND in_lcr_at < now() - interval '7 days'
          AND date_set_apart IS NOT NULL
        RETURNING id, person_name, calling_name, in_lcr_at, date_set_apart
    `;
}
