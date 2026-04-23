-- hero_slides column rename
ALTER TABLE public.hero_slides RENAME COLUMN cta_label TO cta_text;
ALTER TABLE public.hero_slides RENAME COLUMN cta_url TO cta_link;

-- menu_items restructure
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'link';
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS content text;

-- Backfill title from label if any rows exist
UPDATE public.menu_items SET title = label WHERE title IS NULL;

-- Make url nullable, label optional/removed
ALTER TABLE public.menu_items ALTER COLUMN url DROP NOT NULL;
ALTER TABLE public.menu_items DROP COLUMN IF EXISTS label;

-- Enforce title not null after backfill
ALTER TABLE public.menu_items ALTER COLUMN title SET NOT NULL;

-- Type check
ALTER TABLE public.menu_items DROP CONSTRAINT IF EXISTS menu_items_type_check;
ALTER TABLE public.menu_items ADD CONSTRAINT menu_items_type_check CHECK (type IN ('link','page'));