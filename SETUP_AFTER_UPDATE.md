# Hakimi Digital Services – Update Setup

## 1. Run the new SQL
In Supabase SQL Editor, run these two files in order:
- `project/supabase/migrations/20260903220000_offer_service_google_review_upgrade.sql`
- `project/supabase/migrations/20260903220500_google_review_ids.sql`

These add the offer-to-service link, Google review URL, and Google review de-duplication.

## 2. Deploy updated Edge Functions
Replace/deploy these functions in Supabase:
- `sync-google-reviews`
- `send-application-email`

The Google function can auto-detect the HAKIMI MOBILE AND COMPUTER ACCESSORIES listing in Shahada when no Place ID is entered. It then syncs Google reviews into `customer_reviews`.

## 3. Google Places secret
Supabase Edge Function Secret:
- `GOOGLE_PLACES_API_KEY` = your Google Cloud Places API key

The new Google function does not require `GOOGLE_PLACE_ID` because it can auto-detect the listing. You can still set `GOOGLE_PLACE_ID` if you already have the exact `ChIJ...` ID.

## 4. Google review behavior
- Admin can click **Sync Google Reviews**.
- Public website also refreshes Google review data when the home page loads and Google Reviews is enabled.
- A **Leave a Google Review** button is shown on the website.
- When an application is changed to **Completed**, the customer email includes a Google review button.
- A customer may leave a Google review at any time after completion; the next sync/site visit can bring new reviews into the website.

Google Places API returns up to five reviews for a place, so the site should not be expected to receive every Google review in one API response.

## 5. Instagram Auto Feed
Supabase Edge Function Secrets:
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`
- `INSTAGRAM_API_VERSION` (optional; current code defaults to `v24.0`)

The Instagram account must be an Instagram Professional account (Business or Creator) with the required Meta API access. Without these credentials, Instagram cannot provide the live post feed to the website.

In Admin → SEO & Social, enter the Instagram username/profile URL and save.

## 6. Offers behavior
In Admin → Offers:
- **Offer Title / Service** is now a dropdown populated automatically from published Services.
- Selecting a service automatically fills **Offer Title** and **Service Name (Auto)**.
- You can still edit the offer title if you need a campaign-specific title.
- When an offer is published, that service is automatically removed from the regular service cards on the client Home and Pricing pages and appears in **Current Offers & Deals** instead.
- When the offer is unpublished/deleted, the regular service can appear again.


## Manual Reviews Only
Google Reviews sync is intentionally disabled. Add reviews from Admin Panel → Customer Reviews. Set Published/Active and Featured to make them appear on the client website. No Google Cloud API key or Place ID is required.
