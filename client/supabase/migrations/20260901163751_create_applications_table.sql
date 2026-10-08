/*
# Create applications table for Hakimi Digital Services

1. New Tables
- `applications`
  - `id` (uuid, primary key)
  - `application_id` (text, unique, human-readable format HDS-2026-XXXXXX)
  - `service` (text, not null - the selected service name)
  - `full_name` (text, not null)
  - `mobile_number` (text, not null)
  - `whatsapp_number` (text, not null)
  - `email` (text, not null)
  - `state` (text, not null)
  - `city` (text, not null)
  - `document_url` (text, nullable - URL to uploaded document in storage)
  - `document_name` (text, nullable - original filename of uploaded document)
  - `status` (text, not null, default 'Application Received')
    - Possible values: Application Received, Documents Under Verification, Processing, Submitted, Completed, Rejected / Action Required
  - `notes` (text, nullable - admin notes about the application)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `applications`.
- This is a no-auth public application form (no sign-in screen).
- Allow anon + authenticated to INSERT (customers submit applications).
- Allow anon + authenticated to SELECT by application_id (customers track their applications).
- No UPDATE or DELETE from the frontend - status changes are admin-only via service role.

3. Notes
- The application_id is generated server-side via a trigger to ensure uniqueness.
- A sequence is used to generate the numeric portion of the application_id.
*/

CREATE SEQUENCE IF NOT EXISTS application_seq START 1;

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id text UNIQUE,
  service text NOT NULL,
  full_name text NOT NULL,
  mobile_number text NOT NULL,
  whatsapp_number text NOT NULL,
  email text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  document_url text,
  document_name text,
  status text NOT NULL DEFAULT 'Application Received',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new applications
DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Allow anyone to select applications (needed for tracking by application_id)
DROP POLICY IF EXISTS "anon_select_applications" ON applications;
CREATE POLICY "anon_select_applications" ON applications FOR SELECT
  TO anon, authenticated USING (true);

-- Create index for faster lookups by application_id
CREATE INDEX IF NOT EXISTS idx_applications_application_id ON applications (application_id);

-- Create index for faster lookups by mobile_number
CREATE INDEX IF NOT EXISTS idx_applications_mobile ON applications (mobile_number);

-- Trigger to auto-generate application_id in format HDS-2026-XXXXXX
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS trigger AS $$
DECLARE
  seq_val int;
  year_val int;
BEGIN
  year_val := EXTRACT(YEAR FROM now())::int;
  seq_val := nextval('application_seq');
  NEW.application_id := 'HDS-' || year_val::text || '-' || lpad(seq_val::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_generate_application_id ON applications;
CREATE TRIGGER trg_generate_application_id
  BEFORE INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION generate_application_id();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_updated_at ON applications;
CREATE TRIGGER trg_update_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
