import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface QuickLink {
  id: string;
  title: string;
  image_url: string;
  url: string;
  sort_order: number;
  is_active: boolean;
}

export function useQuickLinks() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quick_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (data && !error) {
      setLinks(data as QuickLink[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return { links, loading, refresh: fetchLinks };
}
