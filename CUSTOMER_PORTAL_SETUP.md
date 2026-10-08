# Hakimi Digital Services — Customer Portal

This update adds a customer login/signup portal, customer dashboard, application ownership for logged-in submissions, application status timeline, document links, WhatsApp support, and support tickets.

## Supabase
Run `supabase/migrations/20260904001000_customer_portal.sql` in Supabase SQL Editor.

## Important
Existing applications created before this migration remain unowned (`user_id` is NULL). New applications submitted while a customer is logged in are automatically linked to that customer.

## Local test
1. `cd client`
2. `npm install`
3. `npm run dev`
4. Open the localhost URL.
5. Click Customer Login → Create Account.
6. Login and submit a new application.
7. Return to Dashboard and verify the application appears.
