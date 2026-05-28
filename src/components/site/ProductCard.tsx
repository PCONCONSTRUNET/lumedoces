import { Plus, Star } from "lucide-react";
import { formatBRL } from "@/store/cart";
import type { Product } from "@/data/menu";

export function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-[2rem] bg-card text-left shadow-md ring-1 ring-border/50 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Imagem de Fundo com Degradê */}
      <div className="absolute inset-0 z-0 bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Degradê sutil para escurecer o topo e garantir leitura da estrela, e um pouco na base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 mix-blend-multiply" />
      </div>

      {product.featured && (
        <span className="absolute left-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-highlight text-white shadow-lg">
          <Star className="h-4 w-4 fill-current" />
        </span>
      )}

      <div className="flex flex-1 flex-col justify-end p-2 z-10">
        {/* Bloco Branco Inferior */}
        <div className="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-sm dark:bg-card">
          <div className="flex flex-col">
            <h3 className="font-serif text-base sm:text-lg font-bold leading-tight text-foreground">{product.name}</h3>
            {product.description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
            )}
          </div>
          
          <div className="flex shrink-0 items-center gap-2 pl-2">
            <span className="text-sm font-bold text-highlight sm:text-base whitespace-nowrap">
              {formatBRL(product.price)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
