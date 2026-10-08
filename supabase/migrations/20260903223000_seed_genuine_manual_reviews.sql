-- Seed the 10 genuine customer reviews supplied by the business owner.
-- These are manually entered; no Google API is required.

INSERT INTO public.customer_reviews
  (customer_name, rating, review_text, source, is_featured, is_active)
SELECT v.customer_name, v.rating, v.review_text, 'Customer Feedback', true, true
FROM (VALUES
  ('Kinju Mevada', 5, 'I just wanted to take a moment to thank you for the exceptional service you provided while helping me obtain my food license and Udyham certificate. I must admit I had a few trust issues at first, but you proved me wrong with your efficiency and professionalism! Both my friend and I were amazed at how quickly everything was done.'),
  ('Shashikant Kuwar', 5, 'Very good service... instant payment resolution done here... one and only hakimi mobile in shahada...'),
  ('Advibe Gujarat', 5, 'Nice and super fast service'),
  ('Vivek Marathe', 5, 'Very nice service Bro'),
  ('Chatur Chavhan', 5, 'Hakimi Mobile And Computer Accessories is Very Good Service And Nice Information'),
  ('Sanz Unique World', 5, 'Good excellent service'),
  ('Ramlal Shivade', 5, 'Dedicated awesome service'),
  ('Kamlesh Jat', 5, 'Excellent service'),
  ('Ravindra Pawara', 5, 'Nice services'),
  ('Yash Patil', 5, 'Best service')
) AS v(customer_name, rating, review_text)
WHERE NOT EXISTS (
  SELECT 1 FROM public.customer_reviews r
  WHERE lower(trim(r.customer_name)) = lower(trim(v.customer_name))
    AND lower(trim(r.review_text)) = lower(trim(v.review_text))
);
