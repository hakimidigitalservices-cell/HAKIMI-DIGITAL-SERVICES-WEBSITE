-- Reviews are managed manually in Admin and should not display a Google/manual source label on the client website.
UPDATE public.customer_reviews
SET source = 'Customer Feedback',
    source_url = NULL,
    updated_at = now()
WHERE source ILIKE 'Google Review%';

GRANT SELECT ON public.customer_reviews TO anon, authenticated;
