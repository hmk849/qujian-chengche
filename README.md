# 取件码乘车码一体 (step 1)
1. `npm i`  2. Create a Postgres DB (Neon/Supabase/Vercel Postgres), run `db/schema.sql`
3. Copy `.env.example` to `.env.local`, fill DATABASE_URL and SESSION_SECRET (`openssl rand -base64 48`)
4. `npm run dev` (cookies are `secure`: use https or localhost) / `npm test` for the parser
5. Deploy: push to GitHub, import in Vercel, set the two env vars.
Not yet built: OAuth login, email-forward ingestion, tracking sync, WeChat ride code, privacy/terms, account deletion.

## Step 2
- Run `db/migrate-02.sql` on existing databases (new installs: run it after schema.sql too).
- Forwarding: use an inbound-email provider with Postmark-format JSON (Postmark Inbound; others need a small adapter). Point its webhook to `https://YOUR_DOMAIN/api/inbound?secret=$INBOUND_SECRET`, route `*@INBOUND_DOMAIN` to it, and set INBOUND_DOMAIN. Each user sees their own address in Settings.
- Account deletion removes the user and all parcels (cascade).

## Step 3
- Privacy policy and terms are drafts at /privacy and /terms; have them reviewed and add your operator/contact details.
- Ride code: fill `config/ride-cities.json` with `[{"city":"…","name":"…","url":"https://… or weixin://…"}]` using links from each city's official ride service (needs your own WeChat open-platform/mini-program access for URL links). Empty list shows an honest empty state. WeChat OAuth is not implemented.
