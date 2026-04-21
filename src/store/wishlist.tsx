import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/hooks/useProducts";

interface WishlistContextValue {
  items: Product[];
  hasItem: (id: string) => boolean;
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Product) => void;
  clear: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "plantsin:wishlist:v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Product[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const hasItem = (id: string) => items.some((p) => p.id === id);

  const addItem = (item: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleItem = (item: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) {
        return prev.filter((p) => p.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const clear = () => setItems([]);

  const value = useMemo<WishlistContextValue>(() => {
    return {
      items,
      hasItem,
      addItem,
      removeItem,
      toggleItem,
      clear,
      count: items.length,
    };
  }, [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
