import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export function useQuickLinks() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data, error } = await supabase
        .from("quick_links")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setLinks(data);
      }
      setLoading(false);
    };

    fetchLinks();
  }, []);

  return { links, loading };
}
