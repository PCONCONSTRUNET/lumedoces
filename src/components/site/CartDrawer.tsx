import { useState } from "react";
import { Clock, Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from "lucide-react";
import { formatBRL, useCart } from "@/store/cart";
import { toast } from "sonner";
import mascot from "@/assets/mascot.png";

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 animate-in fade-in">
      <div className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="flex items-center gap-2 font-hand text-xl font-bold">
            <ShoppingBag className="h-5 w-5 text-brand" /> SEU PEDIDO
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-muted/70"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="mt-8 flex flex-col items-center text-center">
              <img src={mascot} alt="" className="h-40 w-auto animate-mascot-wave drop-shadow-lg" />
              <p className="mt-3 font-hand text-lg font-bold text-foreground">Seu carrinho tá vazio!</p>
              <p className="mt-1 text-sm text-muted-foreground">Escolhe umas coxinhas pra mim preparar 🧡</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.uid} className="rounded-2xl border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-hand text-base font-bold">{it.name}</h3>
                      {it.addons.length > 0 && (
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          + {it.addons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {it.notes && <p className="mt-0.5 text-[11px] italic text-muted-foreground">"{it.notes}"</p>}
                    </div>
                    <button
                      onClick={() => remove(it.uid)}
                      className="grid h-8 w-8 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(it.uid, it.quantity - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-muted/70"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{it.quantity}</span>
                      <button
                        onClick={() => setQty(it.uid, it.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-brand text-brand-foreground hover:opacity-90"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-extrabold text-brand">{formatBRL(it.unitPrice * it.quantity)}</span>
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
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefone (XX) XXXXX-XXXX *"
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Forma de pagamento</h3>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {([
                { id: "pix", label: "PIX", emoji: "📱" },
                { id: "cartao", label: "Cartão", emoji: "💳" },
                { id: "dinheiro", label: "Dinheiro", emoji: "💵" },
              ] as const).map((p) => {
                const active = pay === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPay(p.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs transition ${
                      active ? "border-brand bg-brand/10 ring-2 ring-brand/40" : "border-border bg-card hover:border-brand/50"
                    }`}
                  >
                    <span className="text-xl">{p.emoji}</span>
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
            className="mt-3 w-full resize-none rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40"
          />

          {!isOpenStore && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-3">
              <Clock className="mt-0.5 h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-bold text-destructive">Estamos fechados</p>
                <p className="text-xs text-destructive/80">Abrimos às 18:00</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-hand text-xl font-bold">TOTAL</span>
            <span className="text-xl font-extrabold text-brand">{formatBRL(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={!isOpenStore}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-muted py-3.5 font-bold text-muted-foreground disabled:opacity-100 enabled:bg-highlight enabled:text-highlight-foreground enabled:hover:opacity-95 transition"
          >
            <MessageCircle className="h-4 w-4" />
            {isOpenStore ? "Enviar pedido" : "Pedidos fechados"}
          </button>
        </div>
      </div>
    </div>
  );
}
