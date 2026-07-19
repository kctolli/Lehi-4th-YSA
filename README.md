# Heritage Park YSA Website
Repository for the [Heritage Park YSA](https://hpysa.com) website

**Framework:** [Next.js](https://nextjs.org) (App Router)

**Hosting:** [Vercel](https://vercel.com/login)

**Domain:** [Cloudflare](https://dash.cloudflare.com/login) via Email Login (hpysaweb@gmail.com)

**Database:** [Neon](https://console.neon.tech) Postgres — announcements are stored in the `announcements` table

**Images:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — served via the `/api/photos` function

**Routes:**

* /admin - Where leadership tools are
* /attendance - For the attendance QR code
* /codebuild - Build tools 
* /main - The main site, backed by Neon (announcements) and Vercel Blob (photos)
* /qrcodes - All QR codes for the site

**Local development:** `npm run dev` — API routes under `/api` run locally out of the box

**PLEASE NOTE:** Domain expires on <u>2/8/2030</u> (auto-renew disabled)
