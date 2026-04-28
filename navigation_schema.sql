-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.navigation_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Items Table (Sub-menus)
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.navigation_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url_path TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.navigation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Public can view active navigation items
CREATE POLICY "Public Read Categories" ON public.navigation_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Items" ON public.navigation_items FOR SELECT USING (true);

-- Admins can do anything
CREATE POLICY "Admin Write Categories" ON public.navigation_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Items" ON public.navigation_items FOR ALL USING (auth.role() = 'authenticated');

-- 5. Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';
