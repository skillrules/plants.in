import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HeroSlide {
  id: string;
  image_url: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
}

export function useHeroSlides(onlyActive: boolean = true) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    setLoading(true);
    let query = supabase.from("hero_slides").select("*").order("sort_order", { ascending: true });
    
    if (onlyActive) {
      query = query.eq("is_active", true);
    }
    
    const { data, error } = await query;
    if (!error && data) {
      setSlides(data as HeroSlide[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, [onlyActive]);

  return { slides, loading, refresh: fetchSlides };
}
