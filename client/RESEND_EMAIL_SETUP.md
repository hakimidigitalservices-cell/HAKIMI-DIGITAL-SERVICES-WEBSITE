# Hakimi Digital Services — Email + Application Tracking

## Email
This project sends application confirmation emails through a Supabase Edge Function and Resend.
The Resend API key is NOT placed in the React frontend.

Set these Supabase Edge Function secrets:
- RESEND_API_KEY = your Resend API key
- RESEND_FROM_EMAIL = e.g. Hakimi Digital Services <support@hakimidigitalservices.com>
- ADMIN_EMAIL = hakimidigitalservices@gmail.com

Deploy:
supabase functions deploy send-application-email --no-verify-jwt

Then submit a test application.

## Application Tracking
Run `supabase/track_application.sql` in Supabase SQL Editor.
Customers can track using:
https://hakimidigitalservices.com/#/track

## Instagram
The homepage can include a rotating Instagram updates section, but actual live Instagram posts require the correct Instagram profile/post URLs or an approved Instagram feed integration. Do not put Instagram access tokens in the frontend.
