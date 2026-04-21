CREATE TABLE public.menu_items (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type text NOT NULL CHECK (type IN ('link', 'page')),
    slug text,
    url text,
    content text,
    sort_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT menu_items_pkey PRIMARY KEY (id),
    CONSTRAINT menu_items_slug_unique UNIQUE (slug)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public menu items are viewable by everyone."
ON public.menu_items FOR SELECT
USING (true);

-- Allow full access to admins
CREATE POLICY "Admins have full access to menu_items."
ON public.menu_items FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Insert a default 'Shop' link
INSERT INTO public.menu_items (title, type, url, sort_order) VALUES
('Shop All', 'link', '/shop', 0);
