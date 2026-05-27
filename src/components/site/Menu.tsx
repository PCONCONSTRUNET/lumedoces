import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, ShoppingCart } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { formatBRL, useCart } from "@/store/cart";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Addon } from "@/data/menu";

const sauces: Addon[] = [
  { name: "Maionese da Casa", price: 3 },
  { name: "Molho Cheddar", price: 5 },
  { name: "Molho Barbecue", price: 4 },
  { name: "Molho Picante", price: 4 },
  { name: "Catupiry Extra", price: 5 },
  { name: "Ketchup", price: 2 },
];

const PLACEHOLDER = "/products/placeholder.png";

function emojiFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("coxinha")) return "🍗";
  if (n.includes("pastel") || n.includes("pasteis")) return "🥟";
  if (n.includes("porç") || n.includes("batata") || n.includes("salsicha") || n.includes("bolinho")) return "🍟";
  if (n.includes("combo")) return "🎉";
  if (n.includes("doce") || n.includes("brigad")) return "🍫";
  if (n.includes("bebida") || n.includes("refri") || n.includes("suco")) return "🥤";
  return "✨";
}

export function Menu({ menuRef }: { menuRef: React.RefObject<HTMLDivElement | null> }) {
  const [active, setActive] = useState<string | null>("__all__");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const { count, total, setOpen } = useCart();

  const { data, isLoading } = useQuery({
    queryKey: ["menu-data"],
    queryFn: async () => {
      const [cats, prods] = await Promise.all([
        supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("products").select("*").eq("is_active", true).order("sort_order"),
      ]);
      if (cats.error) throw cats.error;
      if (prods.error) throw prods.error;
      return { categories: cats.data ?? [], products: prods.data ?? [] };
    },
  });

  const categories = data?.categories ?? [];
  const products: Product[] = useMemo(
    () =>
      (data?.products ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? "",
        price: Number(p.base_price),
        image: p.image_url || PLACEHOLDER,
        category: p.category_id,
        addons: sauces,
      })),
    [data],
  );

  const currentCat = active ?? "__all__";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !`${p.name} ${p.description}`.toLowerCase().includes(q)) return false;
      if (currentCat === "__all__") return true;
      return p.category === currentCat;
    });
  }, [products, currentCat, query]);

  return (
    <section ref={menuRef} className="relative bg-cream pb-32 pt-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-brand">NOSSO CARDÁPIO</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-foreground/80">
            Feitos com ingredientes frescos e muito amor. Escolha o seu favorito!
          </p>
        </div>

        <div className="relative mx-auto mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full rounded-full border border-border bg-card py-3.5 pl-11 pr-4 text-sm shadow-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        {categories.length > 0 && (
          <div className="sticky top-[68px] z-30 -mx-4 mt-8 bg-cream/90 px-4 py-3 backdrop-blur">
            <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full bg-card p-1.5 shadow-sm ring-1 ring-border/60">
              <button
                onClick={() => setActive("__all__")}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  currentCat === "__all__"
                    ? "bg-brand text-brand-foreground shadow"
                    : "text-foreground/70 hover:bg-muted"
                }`}
              >
                <span>🍽️</span>
                Todos
              </button>
              {categories.map((c: any) => {
                const isActive = currentCat === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-brand text-brand-foreground shadow"
                        : "text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    <span>{emojiFor(c.name)}</span>
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="mt-5 py-10 text-center text-sm text-muted-foreground">Carregando cardápio...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-5 py-10 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</p>
        ) : currentCat === "__all__" ? (
          <div className="mt-5 space-y-8">
            {categories.map((c: any) => {
              const items = filtered.filter((p) => p.category === c.id);
              if (items.length === 0) return null;
              return (
                <div key={c.id}>
                  <h3 className="mb-3 flex items-center gap-2 font-display text-2xl text-brand">
                    <span>{emojiFor(c.name)}</span> {c.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((p) => (
                      <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}
      </div>

      {count > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md">
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-full bg-brand px-4 py-3 text-brand-foreground shadow-2xl hover:opacity-95 transition"
          >
            <span className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-foreground/15">
                <ShoppingCart className="h-4 w-4" />
              </span>
              <span className="font-semibold">{count} · Ver Carrinho</span>
            </span>
            <span className="rounded-full bg-highlight px-3 py-1 text-sm font-bold text-highlight-foreground">
              {formatBRL(total)}
            </span>
          </button>
        </div>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
