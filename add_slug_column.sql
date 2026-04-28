-- Safely add slug column only if it doesn't exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Set existing products to use their id as a fallback slug so no links break
UPDATE public.products SET slug = id::text WHERE slug IS NULL;

-- Force permissions to refresh for the API
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;

-- Force the API to reload its memory
NOTIFY pgrst, 'reload schema';
