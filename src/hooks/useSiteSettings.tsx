import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({ site_name: "", logo_url: null, favicon_url: null });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("site_name, logo_url, favicon_url")
      .eq("id", 1)
      .maybeSingle();
    if (data) setSettings({ site_name: data.site_name, logo_url: data.logo_url, favicon_url: data.favicon_url });
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (settings.favicon_url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings.favicon_url]);

  return { settings, loading, refresh };
}
