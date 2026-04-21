DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read site assets" ON storage.objects;

CREATE POLICY "Admins can list product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can list site assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));