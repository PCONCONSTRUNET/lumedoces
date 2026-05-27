import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { formatBRL, useCart } from "@/store/cart";
import type { Product } from "@/data/menu";
import { toast } from "sonner";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { add } = useCart();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setSelected(new Set());
    setNotes("");
  }, [product?.id]);

  const addonTotal = useMemo(() => {
    if (!product?.addons) return 0;
    return product.addons.filter((a) => selected.has(a.name)).reduce((s, a) => s + a.price, 0);
  }, [product, selected]);

  if (!product) return null;
  const unit = product.price + addonTotal;

  const toggle = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });

  const handleAdd = () => {
    const chosen = product.addons?.filter((a) => selected.has(a.name)) ?? [];
    add({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: unit,
      quantity: 1,
      addons: chosen,
      notes: notes || undefined,
    });
    toast.success(`${product.name} adicionado ao carrinho`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 animate-in fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-background shadow-2xl animate-in slide-in-from-bottom">
        <div className="relative aspect-square max-h-[70vh] w-full shrink-0 overflow-hidden bg-muted">
          <img
            src={product.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-xl"
          />
          <div className="absolute inset-0 bg-black/5" />
          <img
            src={product.image}
            alt={product.name}
            className="relative z-10 h-full w-full object-cover"
          />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h2 className="font-hand text-2xl font-bold text-foreground">{product.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>

          {product.addons && product.addons.length > 0 && (
            <div className="mt-5">
              <h3 className="font-hand text-base font-bold text-foreground">Adicionais</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {product.addons.map((a) => {
                  const active = selected.has(a.name);
                  return (
                    <button
                      key={a.name}
                      onClick={() => toggle(a.name)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
                        active
                          ? "border-brand bg-brand/10 ring-2 ring-brand/40"
                          : "border-border bg-card hover:border-brand/50"
                      }`}
                    >
                      <span className="font-medium">{a.name}</span>
                      <span className="text-xs font-semibold text-brand">
                        +{formatBRL(a.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5">
            <h3 className="font-hand text-base font-bold text-foreground">Observações</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Sem cebola, molho à parte..."
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
        </div>

        <div className="border-t border-border bg-background p-3">
          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-highlight py-3.5 font-bold text-highlight-foreground shadow hover:opacity-95 transition"
          >
            <span>Adicionar</span>
            <span>{formatBRL(unit)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
