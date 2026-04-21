import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

export function useMenuItems(onlyActive: boolean = true) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    let query = supabase.from("menu_items").select("*").order("sort_order", { ascending: true });
    
    if (onlyActive) {
      query = query.eq("is_active", true);
    }
    
    const { data, error } = await query;
    if (!error && data) {
      setItems(data as MenuItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [onlyActive]);

  return { items, loading, refresh: fetchItems };
}
