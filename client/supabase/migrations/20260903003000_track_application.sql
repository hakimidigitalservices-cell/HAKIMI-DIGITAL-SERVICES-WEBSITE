-- Run this once in Supabase SQL Editor.
-- This securely lets the public Track Application page look up an application
-- by its Application ID without exposing the applications table through RLS.

CREATE OR REPLACE FUNCTION public.track_application(p_application_id text)
RETURNS TABLE (
  application_id text,
  service text,
  full_name text,
  mobile_number text,
  whatsapp_number text,
  email text,
  state text,
  city text,
  status text,
  document_url text,
  document_name text,
  notes text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.application_id,
    a.service,
    a.full_name,
    a.mobile_number,
    a.whatsapp_number,
    a.email,
    a.state,
    a.city,
    a.status,
    a.document_url,
    a.document_name,
    a.notes,
    a.created_at
  FROM public.applications AS a
  WHERE upper(a.application_id) = upper(trim(p_application_id))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.track_application(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_application(text) TO anon, authenticated;
