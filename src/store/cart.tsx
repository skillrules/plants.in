import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  variant?: string;
  unitPrice: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "leaflet:cart:v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const addItem: CartContextValue["addItem"] = (item) => {
    const id = item.id ?? `${item.productId}-${item.variant ?? "default"}`;
    setItems((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + item.qty } : p));
      }
      return [...prev, { ...item, id }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
  const updateQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p)),
    );

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    return {
      items,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      setOpen: setIsOpen,
      addItem,
      removeItem,
      updateQty,
      count,
      subtotal,
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
