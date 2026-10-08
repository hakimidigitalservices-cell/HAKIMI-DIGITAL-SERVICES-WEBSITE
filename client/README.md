

## Apply form submission fix

The Apply page uses the Supabase `submit_application` RPC (created in the Supabase SQL Editor) so anonymous customers can submit an application and receive the generated Application ID without requiring SELECT access to the inserted row.


## Track Application
Run `supabase/track_application.sql` in Supabase SQL Editor. Tracking uses a secure RPC and does not expose internal notes or document URLs.
