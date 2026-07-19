# Production setup

## 1. Supabase database and uploads

Create a Supabase project, open **SQL Editor**, and run `supabase/schema.sql`.
In **Project Settings → API**, copy the Project URL and the **service_role** key.
Add both to the backend environment as `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`. The service-role key belongs only in Render and
must never be added to Vercel or any frontend `.env` file.

## 2. Reliable enquiry email

Create a Resend account, verify `voxelis3d.in`, and create an API key. Set:

```
RESEND_API_KEY=re_...
NOTIFY_EMAIL_FROM=Voxelis <notifications@voxelis3d.in>
NOTIFY_EMAIL_TO=contact@voxelis3d.in
```

Resend is used over HTTPS, so it works on Render's Free service where SMTP
ports are blocked. Set the notification sender to an address on the verified
domain.

## 3. Secure admin session

Set these in Render:

```
ADMIN_PASSWORD=<long unique password>
ADMIN_SESSION_SECRET=<different long random value>
CORS_ORIGIN=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

For local development use `CORS_ORIGIN=http://localhost:5173` and do not set
`NODE_ENV=production`.

## 4. Deploy

Deploy the backend to Render after adding all variables. Then deploy the
frontend to Vercel. Keep `VITE_API_URL` set in Vercel to the Render backend
URL. Admin cookies require the exact Vercel URL in `CORS_ORIGIN`.

## 5. Import existing local leads (optional)

After configuring Supabase, run this once from `server/` before you deploy:

```
node scripts/migrate-json-to-supabase.js
```

It imports existing `data/*.json` records and copies any local order images to
the private Storage bucket. Records that were already imported are skipped.
