-- 1. Add additional_info column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS additional_info TEXT;

-- 2. Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';
