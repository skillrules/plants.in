ALTER TABLE public.products
ADD COLUMN available_sizes TEXT[] DEFAULT ARRAY['s', 'm', 'l'],
ADD COLUMN available_pots TEXT[] DEFAULT ARRAY['nursery', 'terracotta', 'ceramic'];

-- Update existing records to have the default values if they are null
UPDATE public.products
SET available_sizes = ARRAY['s', 'm', 'l']
WHERE available_sizes IS NULL;

UPDATE public.products
SET available_pots = ARRAY['nursery', 'terracotta', 'ceramic']
WHERE available_pots IS NULL;
