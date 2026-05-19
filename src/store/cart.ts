import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = { id: string; qty: number };

type CartState = {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (id, qty = 1) => set((s) => {
        const existing = s.items.find((i) => i.id === id);
        if (existing) return { items: s.items.map((i) => i.id === id ? { ...i, qty: i.qty + qty } : i) };
        return { items: [...s.items, { id, qty }] };
      }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) => set((s) => ({
        items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => i.id === id ? { ...i, qty } : i)
      })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "farmes_cart",
    },
  ),
);
