-- Add missing column on products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gallery text[];

-- Add missing column on site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS favicon_url text;

-- hero_slides
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  cta_label text NOT NULL DEFAULT '',
  cta_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active hero slides viewable by anyone" ON public.hero_slides;
CREATE POLICY "Active hero slides viewable by anyone" ON public.hero_slides
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins manage hero slides" ON public.hero_slides;
CREATE POLICY "Admins manage hero slides" ON public.hero_slides
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER trg_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- menu_items
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active menu items viewable by anyone" ON public.menu_items;
CREATE POLICY "Active menu items viewable by anyone" ON public.menu_items
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins manage menu items" ON public.menu_items;
CREATE POLICY "Admins manage menu items" ON public.menu_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER trg_menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- quick_links
CREATE TABLE IF NOT EXISTS public.quick_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active quick links viewable by anyone" ON public.quick_links;
CREATE POLICY "Active quick links viewable by anyone" ON public.quick_links
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins manage quick links" ON public.quick_links;
CREATE POLICY "Admins manage quick links" ON public.quick_links
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_quick_links_updated_at ON public.quick_links;
CREATE TRIGGER trg_quick_links_updated_at BEFORE UPDATE ON public.quick_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();