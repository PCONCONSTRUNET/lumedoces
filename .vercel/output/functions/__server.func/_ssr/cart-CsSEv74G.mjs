import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
const Ctx = reactExports.createContext(null);
const CART_STORAGE_KEY = "minicoxinhas_cart_v1";
function CartProvider({ children }) {
  const [items, setItems] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [loaded, setLoaded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
    setLoaded(true);
  }, []);
  reactExports.useEffect(() => {
    if (loaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);
  const add = (item) => {
    setItems((prev) => [...prev, { ...item, uid: crypto.randomUUID() }]);
  };
  const remove = (uid) => setItems((p) => p.filter((i) => i.uid !== uid));
  const setQty = (uid, qty) => setItems(
    (p) => qty <= 0 ? p.filter((i) => i.uid !== uid) : p.map((i) => i.uid === uid ? { ...i, quantity: qty } : i)
  );
  const clear = () => setItems([]);
  const total = reactExports.useMemo(() => items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [items]);
  const count = reactExports.useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { items, add, remove, setQty, clear, total, count, open, setOpen }, children });
}
function useCart() {
  const v = reactExports.useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
const formatBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export {
  CartProvider as C,
  formatBRL as f,
  useCart as u
};
