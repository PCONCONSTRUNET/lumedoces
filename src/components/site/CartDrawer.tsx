import { useState } from "react";
import { Clock, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { formatBRL, useCart } from "@/store/cart";
import { toast } from "sonner";
import mascot from "@/assets/mascot.png";
import { PixIcon } from "@/components/PaymentLabel";

type PayMethod = "pix" | "cartao" | "dinheiro";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pay, setPay] = useState<PayMethod>("pix");
  const [obs, setObs] = useState("");

  // Demo "closed" state — flip to true if you want to allow orders
  const isOpenStore = false;

  if (!open) return null;

  const handleCheckout = () => {
    if (!isOpenStore) return;
    if (!name || !phone) {
      toast.error("Preencha nome e telefone");
      return;
    }
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }
    toast.success("Pedido enviado! Em breve entraremos em contato.");
    clear();
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 animate-in fade-in sm:items-stretch">
      <div className="flex h-[100dvh] w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right sm:h-full">
        {/* Header (sticky) */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
          <h2 className="flex items-center gap-2 font-hand text-lg font-bold sm:text-xl">
            <ShoppingBag className="h-5 w-5 text-brand" /> SEU PEDIDO
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted hover:bg-muted/70"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {items.length === 0 ? (
            <div className="mt-6 flex flex-col items-center text-center">
              <img src={mascot} alt="" className="h-32 w-auto animate-mascot-wave drop-shadow-lg sm:h-40" />
              <p className="mt-3 font-hand text-lg font-bold text-foreground">Seu carrinho tá vazio!</p>
              <p className="mt-1 text-sm text-muted-foreground">Escolhe umas coxinhas pra mim preparar 🧡</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((it) => (
                <div key={it.uid} className="rounded-2xl border border-border bg-card p-2.5">
                  <div className="flex items-start gap-2.5">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-border/60"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-hand text-[15px] font-bold leading-tight">{it.name}</h3>
                      {it.addons.length > 0 && (
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                          + {it.addons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {it.notes && <p className="mt-0.5 line-clamp-2 text-[11px] italic text-muted-foreground">"{it.notes}"</p>}
                    </div>
                    <button
                      onClick={() => remove(it.uid)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQty(it.uid, it.quantity - 1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-muted/70 active:scale-95"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold tabular-nums">{it.quantity}</span>
                      <button
                        onClick={() => setQty(it.uid, it.quantity + 1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-foreground hover:opacity-90 active:scale-95"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-extrabold text-brand tabular-nums">{formatBRL(it.unitPrice * it.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 border-t border-border pt-4">
            <h3 className="font-hand text-base font-bold">Seus dados</h3>
            <div className="mt-2 space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome *"
                autoComplete="name"
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-3 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:text-sm"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefone (XX) XXXXX-XXXX *"
                inputMode="tel"
                autoComplete="tel"
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-3 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Forma de pagamento</h3>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {([
                { id: "pix", label: "PIX", emoji: "pix" },
                { id: "cartao", label: "Cartão", emoji: "💳" },
                { id: "dinheiro", label: "Dinheiro", emoji: "💵" },
              ] as const).map((p) => {
                const active = pay === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPay(p.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs transition ${
                      active ? "border-brand bg-brand/10 ring-2 ring-brand/40" : "border-border bg-card hover:border-brand/50"
                    }`}
                  >
                    {p.emoji === "pix" ? (
                      <PixIcon className="h-6 w-6" />
                    ) : (
                      <span className="text-xl">{p.emoji}</span>
                    )}
                    <span className="font-semibold">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Observações do pedido (opcional)"
            rows={2}
            className="mt-3 w-full resize-none rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:text-sm"
          />

          {!isOpenStore && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-bold text-destructive">Estamos fechados</p>
                <p className="text-xs text-destructive/80">Abrimos às 18:00</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer (sticky) */}
        <div className="shrink-0 border-t border-border bg-background px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-between">
            <span className="font-hand text-lg font-bold sm:text-xl">TOTAL</span>
            <span className="text-xl font-extrabold text-brand tabular-nums">{formatBRL(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={!isOpenStore}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-muted py-3.5 text-[15px] font-bold text-muted-foreground transition disabled:opacity-100 enabled:bg-highlight enabled:text-highlight-foreground enabled:hover:opacity-95 enabled:active:scale-[0.99]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {isOpenStore ? "Enviar pedido" : "Pedidos fechados"}
          </button>
        </div>
      </div>
    </div>
  );
}

