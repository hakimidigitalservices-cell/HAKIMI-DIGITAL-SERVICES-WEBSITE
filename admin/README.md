# Hakimi Digital Services Admin Panel

Standalone Vite + React admin panel for applications, services/prices, offers, reviews and SEO/social settings.

## Environment
Create `.env`:
`VITE_SUPABASE_URL=https://xlguefboinvbolnkozlc.supabase.co`
`VITE_SUPABASE_ANON_KEY=<Supabase publishable/anon key>`

Run `npm install` then `npm run dev` or `npm run build`.

The Supabase migration in the client project's `supabase/migrations/20260903010000_business_content_and_seo.sql` creates the content tables and admin RLS policies.
