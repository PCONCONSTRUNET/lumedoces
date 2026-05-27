import { Plus, Star } from "lucide-react";
import { formatBRL } from "@/store/cart";
import type { Product } from "@/data/menu";

export function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-3xl bg-card text-left shadow-sm ring-1 ring-border/60 hover:shadow-lg hover:-translate-y-0.5 transition"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
        />
        {product.featured && (
          <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-highlight text-highlight-foreground shadow">
            <Star className="h-3.5 w-3.5 fill-current" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-hand text-lg font-bold leading-tight text-foreground">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-extrabold text-highlight-foreground">
            {formatBRL(product.price)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </span>
        </div>
      </div>
    </button>
  );
}
