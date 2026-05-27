import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  uid: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number; // including addons
  quantity: number;
  addons: { name: string; price: number }[];
  notes?: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "uid">) => void;
  remove: (uid: string) => void;
  setQty: (uid: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (o: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const add: CartCtx["add"] = (item) => {
    setItems((prev) => [...prev, { ...item, uid: crypto.randomUUID() }]);
  };
  const remove = (uid: string) => setItems((p) => p.filter((i) => i.uid !== uid));
  const setQty = (uid: string, qty: number) =>
    setItems((p) =>
      qty <= 0 ? p.filter((i) => i.uid !== uid) : p.map((i) => (i.uid === uid ? { ...i, quantity: qty } : i)),
    );
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count, open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
