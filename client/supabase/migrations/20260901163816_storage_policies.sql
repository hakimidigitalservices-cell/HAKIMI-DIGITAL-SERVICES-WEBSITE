/*
# Storage policies for application documents bucket

1. Security
- The 'application-documents' bucket stores documents uploaded by customers.
- Allow anon + authenticated to upload files (INSERT).
- Allow anon + authenticated to read files (SELECT) - documents are accessible via public URL.
- No UPDATE or DELETE from the frontend.
*/

-- Storage policies for the application-documents bucket
DROP POLICY IF EXISTS "anon_upload_documents" ON storage.objects;
CREATE POLICY "anon_upload_documents" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'application-documents');

DROP POLICY IF EXISTS "anon_read_documents" ON storage.objects;
CREATE POLICY "anon_read_documents" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'application-documents');
