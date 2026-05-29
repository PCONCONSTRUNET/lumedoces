import { useEffect, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PixIcon } from "@/components/PaymentLabel";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";
import { supabase } from "@/integrations/supabase/client";
import { formatOrderCode } from "@/lib/order-utils";
import { formatBRL, useCart } from "@/store/cart";
import mascot from "@/assets/mascot.png";

type PayMethod = "pix" | "cartao" | "dinheiro";
type PaymentMethodRow = { id: string; name: string };
type CouponRow = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "fixed" | "percent";
  discount_value: number;
  min_order_total: number;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function matchesPaymentMethod(name: string, pay: PayMethod) {
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (pay === "pix") return normalized.includes("pix");
  if (pay === "dinheiro") return normalized.includes("dinheiro");
  return normalized.includes("cartao");
}

function onlyPhoneDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatPhone(value: string) {
  const digits = onlyPhoneDigits(value);
  const area = digits.slice(0, 2);
  const firstPart = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const secondPart = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

  if (digits.length <= 2) return area ? `(${area}` : "";
  if (!secondPart) return `(${area}) ${firstPart}`;
  return `(${area}) ${firstPart}-${secondPart}`;
}

function isMissingAddressReferenceColumnError(error: { code?: string; message?: string }) {
  const message = (error.message ?? "").toLowerCase();
  return (
    error.code === "PGRST204" ||
    message.includes("schema cache") ||
    message.includes("address_reference") ||
    message.includes("coupon_id") ||
    message.includes("coupon_code")
  );
}

function formatCustomerAddress(street: string, district: string) {
  const parts = [];
  if (street.trim()) parts.push(`Rua: ${street.trim()}`);
  if (district.trim()) parts.push(`Bairro: ${district.trim()}`);
  return parts.join(" | ") || null;
}

function buildLegacyNotes(notes: string, addressReference: string) {
  const details = [notes.trim()];

  if (addressReference.trim()) {
    details.push(`Referencia: ${addressReference.trim()}`);
  }

  const joined = details.filter(Boolean).join("\n");
  return joined || null;
}

function normalizeCouponCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

function getCouponDiscount(coupon: CouponRow, subtotal: number) {
  if (coupon.discount_type === "percent") {
    return Math.min(subtotal, Number(((subtotal * coupon.discount_value) / 100).toFixed(2)));
  }
  return Math.min(subtotal, Number(coupon.discount_value));
}

function validateCoupon(coupon: CouponRow, subtotal: number) {
  const now = new Date();

  if (!coupon.is_active) return "Cupom inativo";
  if (coupon.starts_at && new Date(coupon.starts_at) > now) return "Cupom ainda nao esta valido";
  if (coupon.expires_at && new Date(coupon.expires_at) < now) return "Cupom expirado";
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return "Cupom esgotado";
  }
  if (subtotal < coupon.min_order_total) {
    return `Pedido minimo para este cupom: ${formatBRL(coupon.min_order_total)}`;
  }

  return null;
}

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  const status = useBusinessStatus();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [addressReference, setAddressReference] = useState("");
  const [pay, setPay] = useState<PayMethod>("pix");
  const [obs, setObs] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponRow | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const discount = coupon ? getCouponDiscount(coupon, total) : 0;
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("payment_methods")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setPaymentMethods((data as PaymentMethodRow[]) ?? []));
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setOpen(false);
    if (!orderId) return;
    setOrderId(null);
    setName("");
    setPhone("");
    setStreet("");
    setDistrict("");
    setAddressReference("");
    setObs("");
    setCouponCode("");
    setCoupon(null);
    setPay("pix");
    setConfirmedTotal(0);
  };

  const applyCoupon = async () => {
    const normalized = normalizeCouponCode(couponCode);
    if (!normalized) {
      toast.error("Informe o cupom");
      return;
    }

    setCouponLoading(true);
    try {
      const { data, error } = await (supabase
        .from("coupons") as never)
        .select("*")
        .eq("code", normalized)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setCoupon(null);
        toast.error("Cupom nao encontrado");
        return;
      }

      const row = data as CouponRow;
      const validationError = validateCoupon(row, total);
      if (validationError) {
        setCoupon(null);
        toast.error(validationError);
        return;
      }

      setCoupon(row);
      setCouponCode(row.code);
      toast.success("Cupom aplicado");
    } catch (err) {
      console.error(err);
      toast.error("Nao foi possivel aplicar o cupom");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (saving || status.loading || !status.isOpen) return;
    if (!name.trim() || !phone.trim()) {
      toast.error("Preencha nome e telefone");
      return;
    }
    const phoneDigits = onlyPhoneDigits(phone);
    if (phoneDigits.length < 10) {
      toast.error("Informe um telefone com DDD");
      return;
    }
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    if (coupon) {
      const validationError = validateCoupon(coupon, total);
      if (validationError) {
        setCoupon(null);
        toast.error(validationError);
        return;
      }
    }

    setSaving(true);
    try {
      const nextOrderId = crypto.randomUUID();
      const paymentMethod = paymentMethods.find((method) => matchesPaymentMethod(method.name, pay));
      const orderPayload = {
        id: nextOrderId,
        customer_name: name.trim(),
        customer_phone: formatPhone(phone),
        customer_address: formatCustomerAddress(street, district),
        address_reference: addressReference.trim() || null,
        notes: obs.trim() || null,
        payment_method_id: paymentMethod?.id ?? null,
        subtotal: total,
        discount,
        total: finalTotal,
        coupon_id: coupon?.id ?? null,
        coupon_code: coupon?.code ?? null,
      };

      const { error: firstOrderError } = await (supabase.from("orders") as never).insert(orderPayload);
      let orderError = firstOrderError;

      if (firstOrderError && isMissingAddressReferenceColumnError(firstOrderError)) {
        const { error: fallbackOrderError } = await supabase.from("orders").insert({
          id: nextOrderId,
          customer_name: name.trim(),
          customer_phone: formatPhone(phone),
          customer_address: formatCustomerAddress(street, district),
          notes: buildLegacyNotes(obs, addressReference),
          payment_method_id: paymentMethod?.id ?? null,
          subtotal: total,
          discount,
          total: finalTotal,
        });
        orderError = fallbackOrderError;
      }

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: nextOrderId,
        product_id: isUuid(item.productId) ? item.productId : null,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.unitPrice * item.quantity,
        variations_snapshot: [
          ...item.addons.map((addon) => ({
            name: addon.name,
            price: addon.price,
          })),
          ...(item.notes ? [{ name: "Observação", value: item.notes }] : []),
        ],
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      if (coupon) {
        await (supabase
          .from("coupons") as never)
          .update({ used_count: coupon.used_count + 1 })
          .eq("id", coupon.id);
      }

      setConfirmedTotal(finalTotal);
      clear();
      setOrderId(nextOrderId);
      toast.success("Pedido recebido pelo site!");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 animate-in fade-in sm:items-stretch">
      <div className="flex h-[100dvh] w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right sm:h-full">
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
          <h2 className="flex items-center gap-2 font-hand text-lg font-bold sm:text-xl">
            <ShoppingBag className="h-5 w-5 text-brand" /> SEU PEDIDO
          </h2>
          <button
            onClick={handleClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted hover:bg-muted/70"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {orderId ? (
            <div className="mt-10 flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <p className="mt-4 font-hand text-xl font-bold text-foreground">Pedido recebido!</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Vamos acompanhar seu pedido por aqui. Codigo {formatOrderCode(orderId)}
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-6 flex flex-col items-center text-center">
              <img
                src={mascot}
                alt=""
                className="h-32 w-auto animate-mascot-wave drop-shadow-lg sm:h-40"
              />
              <p className="mt-3 font-hand text-lg font-bold text-foreground">
                Seu carrinho tá vazio!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Escolhe umas coxinhas pra mim preparar
              </p>
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
                      {it.notes && (
                        <p className="mt-0.5 line-clamp-2 text-[11px] italic text-muted-foreground">
                          "{it.notes}"
                        </p>
                      )}
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
                      <span className="w-6 text-center text-sm font-bold tabular-nums">
                        {it.quantity}
                      </span>
                      <button
                        onClick={() => setQty(it.uid, it.quantity + 1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-foreground hover:opacity-90 active:scale-95"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-extrabold text-brand tabular-nums">
                      {formatBRL(it.unitPrice * it.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!orderId && (
            <>
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
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="Telefone (XX) XXXXX-XXXX *"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={15}
                    className="w-full rounded-xl border border-border bg-muted/50 px-3 py-3 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:text-sm"
                  />
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Rua"
                    autoComplete="street-address"
                    className="w-full rounded-xl border border-border bg-muted/50 px-3 py-3 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:text-sm"
                  />
                  <input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Bairro"
                    className="w-full rounded-xl border border-border bg-muted/50 px-3 py-3 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:text-sm"
                  />
                  <input
                    value={addressReference}
                    onChange={(e) => setAddressReference(e.target.value)}
                    placeholder="Referencia"
                    className="w-full rounded-xl border border-border bg-muted/50 px-3 py-3 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Forma de pagamento
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "pix", label: "PIX", emoji: "pix" },
                      { id: "cartao", label: "Cartão", emoji: "card" },
                      { id: "dinheiro", label: "Dinheiro", emoji: "cash" },
                    ] as const
                  ).map((p) => {
                    const active = pay === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPay(p.id)}
                        className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs transition ${
                          active
                            ? "border-brand bg-brand/10 ring-2 ring-brand/40"
                            : "border-border bg-card hover:border-brand/50"
                        }`}
                      >
                        {p.emoji === "pix" ? (
                          <PixIcon className="h-6 w-6" />
                        ) : p.emoji === "card" ? (
                          <CreditCard className="h-6 w-6 text-sky-600" />
                        ) : (
                          <Banknote className="h-6 w-6 text-green-600" />
                        )}
                        <span className="font-semibold">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-card p-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Cupom de desconto
                </h3>
                <div className="mt-2 flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCoupon(null);
                    }}
                    placeholder="Digite o cupom"
                    className="min-w-0 flex-1 rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm uppercase placeholder:normal-case placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading || total <= 0}
                    className="rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition hover:opacity-95 disabled:cursor-wait disabled:opacity-60"
                  >
                    {couponLoading ? "..." : "Aplicar"}
                  </button>
                </div>
                {coupon && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                    <span>{coupon.code} aplicado</span>
                    <span>-{formatBRL(discount)}</span>
                  </div>
                )}
              </div>

              <textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Observações do pedido (opcional)"
                rows={2}
                className="mt-3 w-full resize-none rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand/40 sm:text-sm"
              />

              {!status.loading && !status.isOpen && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-bold text-destructive">Estamos fechados</p>
                    <p className="text-xs text-destructive/80">{status.label}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-background px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.15)]">
          {!orderId && discount > 0 && (
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-muted-foreground">Desconto</span>
              <span className="font-extrabold text-emerald-700">-{formatBRL(discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-hand text-lg font-bold sm:text-xl">TOTAL</span>
            <span className="text-xl font-extrabold text-brand tabular-nums">
              {formatBRL(orderId ? confirmedTotal : finalTotal)}
            </span>
          </div>
          {orderId ? (
            <button
              onClick={handleClose}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-highlight py-3.5 text-[15px] font-bold text-highlight-foreground transition hover:opacity-95 active:scale-[0.99]"
            >
              Fechar
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={saving || status.loading || !status.isOpen || items.length === 0}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-muted py-3.5 text-[15px] font-bold text-muted-foreground transition disabled:opacity-100 enabled:bg-highlight enabled:text-highlight-foreground enabled:hover:opacity-95 enabled:active:scale-[0.99]"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving
                ? "Enviando pedido..."
                : status.isOpen
                  ? "Finalizar pedido"
                  : "Pedidos fechados"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
