# Hakimi Digital Services — Login First + Customer Analytics Fix

## Customer Apply flow
- Customer must log in/create an account before any Apply Now action can navigate to the application form.
- Before login, Apply Now navigation is blocked.
- After successful login, the customer can open Apply Now and submit an application.
- If the customer came through a direct `#/apply` URL, the app sends them to Customer Login first.

## Customer Analytics
The admin panel now renders the Customer Analytics screen instead of referencing a missing component.
It shows:
- Customer accounts
- Email/login information
- Mobile/WhatsApp
- Last login
- Application count
- Services used
- Service-wise applications, revenue, cost and profit

The analytics SQL migration also links older applications to customer accounts when their application email matches the customer's login email.

## IMPORTANT: Supabase SQL
Run this file once in the Supabase SQL Editor:
`supabase/migrations/20260904002000_admin_customer_analytics.sql`

After running it, log into the admin panel and click Refresh.
If the SQL function is missing, the Customer Analytics page now displays the exact RPC error instead of silently showing a blank page.

## Notes
- Profit is only meaningful after Customer Charge and Business Cost are entered in an application.
- Existing applications that cannot be matched by email remain legacy/unlinked.
