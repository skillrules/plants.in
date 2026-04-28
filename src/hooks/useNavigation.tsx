import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface NavigationItem {
  id: string;
  name: string;
  url_path: string;
  display_order: number;
}

export interface NavigationCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  items: NavigationItem[];
}

// Fallback in case the network fails completely
const HARDCODED_FALLBACK: NavigationCategory[] = [
  {
    id: "382007bb-1bf9-4c8b-a73d-708bf7ac3d3d",
    name: "Indoor",
    slug: "indoor",
    display_order: 0,
    items: [
      { id: "d0ed1457-e90a-4854-b4c8-366e8012bbe6", name: "Areca", url_path: "/", display_order: 0 },
      { id: "44258306-7670-4a9c-b2a3-b96c9d0da41e", name: "Red", url_path: "/", display_order: 1 },
      { id: "46a34ace-2241-43d6-9734-f361d4a692bf", name: "Rose", url_path: "/", display_order: 2 }
    ]
  },
  { id: "16fecec5-22fa-4ee0-88d8-e8f36441ba51", name: "Outdoor", slug: "outdoor", display_order: 1, items: [] },
  { id: "943c3385-21fd-4155-8c03-208ef07f278c", name: "Balcony", slug: "balcony", display_order: 2, items: [] },
  { id: "dfb2b1f3-79d0-44e5-8464-f7e81dbc5d18", name: "Flowering", slug: "flowering", display_order: 3, items: [] }
];

let globalCategoriesCache: NavigationCategory[] | null = null;
let globalFetchPromise: Promise<void> | null = null;

export function useNavigation() {
  const [categories, setCategories] = useState<NavigationCategory[]>(() => {
    if (globalCategoriesCache) return globalCategoriesCache;
    try {
      const cached = localStorage.getItem("plantsin_nav_cache");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return HARDCODED_FALLBACK;
  });
  
  const [loading, setLoading] = useState(false);

  const fetchNavigation = async (force = false) => {
    if (globalCategoriesCache && !force) {
      setCategories(globalCategoriesCache);
      return;
    }

    if (globalFetchPromise && !force) {
      await globalFetchPromise;
      if (globalCategoriesCache) setCategories(globalCategoriesCache);
      return;
    }

    setLoading(true);
    
    globalFetchPromise = (async () => {
      try {
        const { data: categoriesData, error: catError } = await supabase
          .from("navigation_categories")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (catError) throw new Error(catError.message);

        const { data: itemsData, error: itemError } = await supabase
          .from("navigation_items")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (itemError) throw new Error(itemError.message);

        const mappedCategories: NavigationCategory[] = (categoriesData || []).map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          display_order: cat.display_order,
          items: (itemsData || [])
            .filter((item) => item.category_id === cat.id)
            .map((item) => ({
              id: item.id,
              name: item.name,
              url_path: item.url_path,
              display_order: item.display_order,
            })),
        }));

        globalCategoriesCache = mappedCategories;
        setCategories(mappedCategories);
        localStorage.setItem("plantsin_nav_cache", JSON.stringify(mappedCategories));
        
      } catch (e) {
        console.error("Error fetching database navigation:", e);
      } finally {
        setLoading(false);
      }
    })();

    await globalFetchPromise;
  };

  useEffect(() => {
    fetchNavigation();
  }, []);

  return { data: categories, isLoading: loading, refetch: () => fetchNavigation(true) };
}
