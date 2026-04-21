CREATE TABLE public.hero_slides (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    image_url text NOT NULL,
    eyebrow text,
    title text NOT NULL,
    subtitle text,
    cta_text text NOT NULL DEFAULT 'Shop Now',
    cta_link text NOT NULL DEFAULT '/shop',
    sort_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT hero_slides_pkey PRIMARY KEY (id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public hero slides are viewable by everyone."
ON public.hero_slides FOR SELECT
USING (true);

-- Allow full access to admins
CREATE POLICY "Admins have full access to hero_slides."
ON public.hero_slides FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);
