import { create } from "zustand";

type CartItem = { id: string; qty: number };

type CartState = {
  items: CartItem[];
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  add: (id) => set((s) => {
    const existing = s.items.find((i) => i.id === id);
    if (existing) return { items: s.items.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i) };
    return { items: [...s.items, { id, qty: 1 }] };
  }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  setQty: (id, qty) => set((s) => ({
    items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => i.id === id ? { ...i, qty } : i)
  })),
  clear: () => set({ items: [] }),
}));
