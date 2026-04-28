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

const HARDCODED_FALLBACK: QuickLink[] = [
  {
    "id": "3b2805f4-0e0d-43d2-b2cc-9c22ea36f011",
    "title": "Plants",
    "url": "/",
    "image_url": "https://ppytxvsvewnnzxyubkhx.supabase.co/storage/v1/object/public/site-assets/uploads/quicklink-1776944655070-plqr6l.png",
    "sort_order": 0,
    "is_active": true
  },
  {
    "id": "175345e2-9a2f-4592-97b5-c8b82d5b8831",
    "title": "trees",
    "url": "/",
    "image_url": "https://ppytxvsvewnnzxyubkhx.supabase.co/storage/v1/object/public/site-assets/uploads/quicklink-1776952899790-i8sut7.png",
    "sort_order": 1,
    "is_active": true
  },
  {
    "id": "e89c22d3-6937-4818-84a2-5d11676ceb7f",
    "title": "tree",
    "url": "/",
    "image_url": "https://ppytxvsvewnnzxyubkhx.supabase.co/storage/v1/object/public/site-assets/uploads/quicklink-1776952877741-ooyy6k.ico",
    "sort_order": 2,
    "is_active": true
  },
  {
    "id": "f53f5ded-feb2-4f28-95ab-8bec0b79524c",
    "title": "rose",
    "url": "/",
    "image_url": "https://ppytxvsvewnnzxyubkhx.supabase.co/storage/v1/object/public/site-assets/uploads/quicklink-1776952920490-dh6fid.png",
    "sort_order": 3,
    "is_active": true
  },
  {
    "id": "8c075f8c-bfff-4c52-9760-0594b9039abc",
    "title": "small",
    "url": "/",
    "image_url": "https://ppytxvsvewnnzxyubkhx.supabase.co/storage/v1/object/public/site-assets/uploads/quicklink-1776952996001-zxz03x.png",
    "sort_order": 4,
    "is_active": true
  }
];

// Module-level cache to prevent reloading on every page navigation
let globalQuickLinksCache: QuickLink[] | null = null;
let globalFetchPromise: Promise<void> | null = null;

export function useQuickLinks() {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    // 1. Memory cache
    if (globalQuickLinksCache) return globalQuickLinksCache;
    
    // 2. localStorage
    try {
      const cached = localStorage.getItem("plantsin_quicklinks_cache");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    
    // 3. Fallback
    return HARDCODED_FALLBACK;
  });
  
  const [loading, setLoading] = useState(false);

  const fetchLinks = async (force = false) => {
    if (globalQuickLinksCache && !force) {
      setLinks(globalQuickLinksCache);
      return;
    }

    if (globalFetchPromise && !force) {
      await globalFetchPromise;
      if (globalQuickLinksCache) setLinks(globalQuickLinksCache);
      return;
    }

    setLoading(true);
    
    globalFetchPromise = (async () => {
      const { data, error } = await supabase
        .from("quick_links")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        globalQuickLinksCache = data;
        setLinks(data);
        localStorage.setItem("plantsin_quicklinks_cache", JSON.stringify(data));
      }
      setLoading(false);
    })();

    await globalFetchPromise;
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return { links, loading, refetch: () => fetchLinks(true) };
}
