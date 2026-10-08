-- Manual customer reviews only. Google Reviews integration is intentionally disabled.
-- Reviews entered from the Admin Panel are published directly to the client website
-- when is_active = true and is_featured = true.

UPDATE public.site_settings
SET google_reviews_enabled = false,
    updated_at = now()
WHERE id = true;

GRANT SELECT ON public.customer_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.customer_reviews TO authenticated;

DROP POLICY IF EXISTS "Public can view active reviews" ON public.customer_reviews;
CREATE POLICY "Public can view active reviews"
ON public.customer_reviews
FOR SELECT
TO anon, authenticated
USING (is_active = true AND is_featured = true);
