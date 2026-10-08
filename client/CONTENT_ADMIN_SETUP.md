# Hakimi Digital Services — Professional Admin Setup

## New admin-managed features
- Services & prices: add/edit/publish services and prices without code.
- Offers: publish, edit and remove offers shown on the website.
- Reviews: add testimonials manually and import Google reviews through Places API.
- SEO & Social: edit SEO title/description/keywords, OG image and Google verification.
- Instagram: live feed infrastructure for an Instagram Professional account via Meta's Instagram API.
- Application status email: customer/admin email on submission; admin status changes also trigger email.
- Robots.txt, sitemap.xml and JSON-LD structured data.

## One-time Supabase migration
Run the migration file in `supabase/migrations/20260903010000_business_content_and_seo.sql` in Supabase SQL Editor.

## Supabase Edge Function secrets
Add these in Supabase → Edge Functions → Secrets:

### Email
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` = `Hakimi Digital Services <support@hakimidigitalservices.com>`
- `ADMIN_EMAIL` = `hakimidigitalservices@gmail.com`

### Instagram
- `INSTAGRAM_ACCESS_TOKEN` = Meta Instagram Professional account access token
- `INSTAGRAM_USER_ID` = Instagram Professional account ID
- `INSTAGRAM_API_VERSION` = optional, defaults to `v24.0`

### Google reviews
- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACE_ID`

## Deploy these Edge Functions
- `send-application-email`
- `sync-instagram-feed`
- `sync-google-reviews`

## Instagram requirement
The live feed uses Meta's Instagram API and requires an Instagram Professional (Business or Creator) account plus the appropriate Meta app/access token. Do not put the access token in the frontend. The website calls the Supabase Edge Function, which keeps the token server-side.

## Google review requirement
The Google sync uses Places API (New). Google may return up to 5 reviews. When displaying them, keep author attribution and a direct Google Maps link as required by Google policies.
