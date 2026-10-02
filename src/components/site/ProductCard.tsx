import { Plus, Star } from "lucide-react";
import { formatBRL } from "@/store/cart";
import type { Product } from "@/data/menu";

export function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const isOutOfStock = product.manage_stock && typeof product.stock === 'number' && product.stock <= 0;

  return (
    <button
      onClick={isOutOfStock ? undefined : onClick}
      disabled={isOutOfStock}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-md ring-1 ring-border/50 transition-all ${isOutOfStock ? 'opacity-60 cursor-not-allowed grayscale-[0.5]' : 'hover:-translate-y-1 hover:shadow-xl'} dark:bg-card`}
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5" />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-bold px-3 py-1 rounded-full text-xs">ESGOTADO</span>
          </div>
        )}
      </div>

      {product.featured && (
        <span className="absolute left-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-highlight text-white shadow-lg sm:h-8 sm:w-8">
          <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
        </span>
      )}

      <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:p-4">
        <div className="flex flex-col">
          <h3 className="font-serif text-[15px] sm:text-lg font-bold leading-[1.15] text-foreground line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs text-muted-foreground leading-snug">
              {product.description}
            </p>
          )}
        </div>
        
        <div className="mt-auto pt-1">
          <span className="text-[14px] sm:text-base font-extrabold text-highlight whitespace-nowrap">
            {formatBRL(product.price)}
          </span>
        </div>
      </div>
    </button>
  );
}
