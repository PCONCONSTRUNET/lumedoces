import { useMemo, useState, useRef, Component, ErrorInfo, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { formatBRL, useCart } from "@/store/cart";
import { supabase } from "@/integrations/supabase/client";
import { type Product, type Addon, products as staticProducts, categories as staticCategories } from "@/data/menu";

class ErrorBoundary extends Component<{children: ReactNode, fallback: (err: Error) => ReactNode}, {error: Error | null}> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error(error, errorInfo); }
  render() {
    if (this.state.error) return this.props.fallback(this.state.error);
    return this.props.children;
  }
}

type CategoryRow = {
  id: string;
  name: string;
  sort_order?: number | null;
};

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  category_id: string | null;
};

const sauces: Addon[] = [
  { name: "Maionese da Casa", price: 3 },
  { name: "Molho Cheddar", price: 5 },
  { name: "Molho Barbecue", price: 4 },
  { name: "Molho Picante", price: 4 },
  { name: "Catupiry Extra", price: 5 },
  { name: "Ketchup", price: 2 },
];

const PLACEHOLDER = "/products/placeholder.png";
const COMBO_IMAGE = "/products/combo.png";
const COMBO_FALLBACK: Product = {
  id: "combo-festa",
  name: "Combo Festa (100un)",
  description: "100 mini coxinhas mistas + 4 molhos da casa",
  price: 110,
  image: COMBO_IMAGE,
  category: "combos",
  featured: true,
  addons: sauces,
};
const FALLBACK_CATEGORIES: CategoryRow[] = [{ id: "combos", name: "Combos", sort_order: 4 }];

function CategoryRow({ category, products, onSelect }: { category: CategoryRow, products: Product[], onSelect: (p: Product) => void }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <div className="mb-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h3 className="font-serif text-3xl font-extrabold tracking-tight text-foreground">{category.name}</h3>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => scroll('left')} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-foreground hover:bg-muted transition" aria-label="Anterior">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scroll('right')} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-foreground hover:bg-muted transition" aria-label="Próximo">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={rowRef}
        onScroll={handleScroll}
        className="no-scrollbar grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:overflow-x-auto sm:snap-x sm:snap-mandatory sm:pb-4"
      >
        {products.map((p) => (
          <div key={p.id} className="sm:snap-start sm:shrink-0 sm:w-[280px]">
            <ProductCard product={p} onClick={() => onSelect(p)} />
          </div>
        ))}
      </div>
    </div>
  );
}


export function Menu({ menuRef }: { menuRef: React.RefObject<HTMLDivElement | null> }) {
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
      if (cats.error || prods.error) {
        console.error(cats.error ?? prods.error);
        return { categories: [], products: [] };
      }
      return { categories: cats.data ?? [], products: prods.data ?? [] };
    },
  });

  const categories = useMemo(() => {
    let sortedCats = [...staticCategories];
    if (typeof window !== 'undefined') {
      const savedOrder = localStorage.getItem("categoryOrder");
      if (savedOrder) {
        try {
          const orderArr = JSON.parse(savedOrder);
          sortedCats.sort((a, b) => {
            let indexA = orderArr.indexOf(a.id);
            let indexB = orderArr.indexOf(b.id);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
          });
        } catch (e) {}
      }
    }
    return sortedCats;
  }, []);
  const products = useMemo(() => staticProducts, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <section ref={menuRef} id="menu" className="relative bg-[#FAF9F6] dark:bg-background pb-32 pt-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground font-extrabold tracking-tight">Nosso Cardápio</h2>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
            Explore nossa variedade de hambúrgueres e porções feitos na hora pra você.
          </p>
        </div>

        <div className="relative mx-auto mt-6 max-w-xl mb-16">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por sabor..."
            className="w-full rounded-full border border-border bg-white py-4 pl-12 pr-6 text-base shadow-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-highlight/50 transition-all dark:bg-card"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-5 py-10 text-center text-sm text-muted-foreground">
            Nenhum produto encontrado.
          </p>
        ) : (
          <div className="mt-5">
            {categories.map((c) => {
              const items = filtered.filter((p) => p.category === c.id);
              if (items.length === 0) return null;
              return <CategoryRow key={c.id} category={c} products={items} onSelect={setSelected} />;
            })}
          </div>
        )}
      </div>

      {count > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md">
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-full bg-highlight px-5 py-4 text-white shadow-2xl hover:opacity-95 transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
                <ShoppingCart className="h-4 w-4" />
              </span>
              <span className="font-bold text-lg">{count} · Ver Carrinho</span>
            </span>
            <span className="rounded-full bg-white px-4 py-1 text-sm font-bold text-highlight shadow-sm">
              {formatBRL(total)}
            </span>
          </button>
        </div>
      )}

      <ErrorBoundary fallback={(err) => (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white p-10 overflow-auto">
          <h1 className="text-red-500 font-bold text-2xl">Erro no ProductModal</h1>
          <p className="mt-4 font-bold">{err.toString()}</p>
          <pre className="mt-4 text-xs whitespace-pre-wrap">{err.stack}</pre>
          <button onClick={() => setSelected(null)} className="mt-6 bg-black text-white px-4 py-2 rounded">Fechar</button>
        </div>
      )}>
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      </ErrorBoundary>
    </section>
  );
}
