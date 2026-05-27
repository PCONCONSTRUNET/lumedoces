import { useMemo, useState } from "react";
import { Search, Star, ShoppingCart } from "lucide-react";
import { categories, products, type Product } from "@/data/menu";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { formatBRL, useCart } from "@/store/cart";

export function Menu({ menuRef }: { menuRef: React.RefObject<HTMLDivElement | null> }) {
  const [active, setActive] = useState<(typeof categories)[number]["id"]>("salgados");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const { count, total, setOpen } = useCart();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !`${p.name} ${p.description}`.toLowerCase().includes(q)) return false;
      return p.category === active;
    });
  }, [active, query]);

  const featured = useMemo(
    () =>
      products.filter(
        (p) => p.featured && (!query || `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [query],
  );

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

        {featured.length > 0 && (
          <div className="mt-8">
            <h3 className="flex items-center gap-2 font-hand text-xl font-bold uppercase tracking-wide">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-highlight text-highlight-foreground">
                <Star className="h-4 w-4 fill-current" />
              </span>
              Destaques
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          </div>
        )}

        <div className="sticky top-[68px] z-30 -mx-4 mt-8 bg-cream/90 px-4 py-3 backdrop-blur">
          <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full bg-card p-1.5 shadow-sm ring-1 ring-border/60">
            {categories.map((c) => {
              const isActive = active === c.id;
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
                  <span>{c.emoji}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.length === 0 ? (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          ) : (
            filtered.map((p) => <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />)
          )}
        </div>
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
