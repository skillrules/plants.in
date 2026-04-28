import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products as localProducts } from "@/data/products";

export interface DbProduct {
  id: string;
  slug: string | null;
  name: string;
  tag: string;
  price: number;
  old_price: number | null;
  rating: number;
  image: string;
  gallery: string[] | null;
  badge: string | null;
  category: string;
  description: string;
  care_light: string;
  care_water: string;
  care_pet_safe: string;
  is_active: boolean;
  sort_order: number;
  additional_info?: string | null;
}

export type Category = "Indoor" | "Succulent" | "Flowering" | "Trailing";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tag: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  gallery?: string[];
  badge?: "new" | "sale" | "bestseller";
  category: Category;
  description: string;
  care: { light: string; water: string; petSafe: string };
  additional_info?: string;
}

export const fromDb = (r: DbProduct): Product => ({
  id: r.id,
  slug: r.slug || r.id,
  name: r.name,
  tag: r.tag,
  price: Number(r.price),
  oldPrice: r.old_price ?? undefined,
  rating: Number(r.rating) || 4.5,
  image: r.image,
  gallery: r.gallery || undefined,
  badge: (r.badge as Product["badge"]) || undefined,
  category: r.category as Category,
  description: r.description,
  additional_info: (r as any).additional_info || undefined,
  care: { light: r.care_light, water: r.care_water, petSafe: r.care_pet_safe },
});

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancel) return;
        if (error) setError(error.message);
        else {
          const dbProducts = (data as DbProduct[]).map(fromDb);
          const newLocalProducts = localProducts.filter((lp) => !dbProducts.find((dp) => dp.id === lp.id));
          setProducts([...dbProducts, ...newLocalProducts].slice(0, 18));
        }
        setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, []);

  return { products, loading, error };
}
