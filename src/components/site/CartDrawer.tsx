import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  MapPin,
  Truck,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { PixIcon } from "@/components/PaymentLabel";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";
import { supabase } from "@/integrations/supabase/client";
import { formatOrderCode } from "@/lib/order-utils";
import { formatBRL, useCart } from "@/store/cart";
import brandIcon from "@/assets/icon.png";
import iconPoints from "@/assets/icon_points_lume.png";
import logoLume from "@/assets/logo_lume.png";
import { PixPaymentScreen } from "@/components/site/PixPaymentScreen";

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

function onlyCpfCnpjDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 14);
}

function formatCpfCnpj(value: string) {
  const digits = onlyCpfCnpjDigits(value);
  // CNPJ: 14 digits → XX.XXX.XXX/XXXX-XX
  if (digits.length > 11) {
    const d = digits.slice(0, 14);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }
  // CPF: 11 digits → XXX.XXX.XXX-XX
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
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
  const supabaseUntyped = supabase as any;
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  const status = useBusinessStatus();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [pay, setPay] = useState<PayMethod>("pix");
  const [obs, setObs] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponRow | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number>(0);
  const [usePoints, setUsePoints] = useState<boolean>(false);

  const pointsToUse = usePoints ? Math.floor(pointsBalance / 100) * 100 : 0;
  const pointsDiscount = (pointsToUse / 100) * 5;
  const discount = (coupon ? getCouponDiscount(coupon, total) : 0) + pointsDiscount;
  const deliveryModeInitial = "pickup"; // will be set in effect
  const [deliveryMode, setDeliveryMode] = useState<"pickup" | "delivery">(deliveryModeInitial);
  
  const [storeSettings, setStoreSettings] = useState<{ delivery_enabled: boolean, pickup_enabled: boolean, delivery_fee: number }>({ delivery_enabled: true, pickup_enabled: true, delivery_fee: 0 });
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
  const matchedNeighborhood = selectedAddress 
    ? neighborhoods.find(n => n.name.toLowerCase() === selectedAddress.neighborhood.toLowerCase())
    : null;
    
  let baseDeliveryFee = deliveryMode === "delivery" && storeSettings.delivery_enabled 
    ? (matchedNeighborhood ? matchedNeighborhood.fee : storeSettings.delivery_fee) 
    : 0;

  if (coupon && coupon.free_shipping) {
    baseDeliveryFee = 0;
  }
  const finalDeliveryFee = baseDeliveryFee;
  const finalTotal = Math.max(0, total - discount) + finalDeliveryFee;

  useEffect(() => {
    if (!open) return;
    supabase
      .from("payment_methods")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setPaymentMethods((data as PaymentMethodRow[]) ?? []));
      
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.addresses) {
        const addrs = session.user.user_metadata.addresses;
        setSavedAddresses(addrs);
        if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
      }
    });

    supabaseUntyped.from("store_settings").select("*").limit(1).maybeSingle().then(({ data }: any) => {
      if (data) {
        setStoreSettings(data);
        if (!data.pickup_enabled && data.delivery_enabled) setDeliveryMode("delivery");
        if (!data.delivery_enabled && data.pickup_enabled) setDeliveryMode("pickup");
      }
    });

    supabaseUntyped.from("delivery_neighborhoods").select("*").eq("is_active", true).then(({ data }: any) => {
      if (data) setNeighborhoods(data);
    });
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setOpen(false);
    if (!orderId) return;
    setOrderId(null);
    setName("");
    setPhone("");
    setCpf("");
    setObs("");
    setCouponCode("");
    setCoupon(null);
    setPay("pix");
    setConfirmedTotal(0);
    setPixQrCode(null);
    setPixCopyPaste(null);
  };

  const applyCoupon = async () => {
    const normalized = normalizeCouponCode(couponCode);
    if (!normalized) {
      toast.error("Informe o cupom");
      return;
    }

    setCouponLoading(true);
    try {
      const { data, error } = await supabaseUntyped
        .from("coupons")
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
    
    if (deliveryMode === "delivery" && !selectedAddressId) {
      toast.error("Selecione um endereço para entrega");
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
      let finalAddress = "Retirada no Local";
      if (deliveryMode === "delivery") {
        const addr = savedAddresses.find(a => a.id === selectedAddressId);
        if (addr) {
          finalAddress = `${addr.street}, ${addr.number}`;
          if (addr.complement) finalAddress += ` - ${addr.complement}`;
          finalAddress += ` | ${addr.neighborhood} | ${addr.city} - ${addr.state} | CEP: ${addr.zipCode}`;
          
          if (addr.lat && addr.lng) {
            finalAddress += `\n\n📍 Mapa de Entrega: https://www.google.com/maps?q=${addr.lat},${addr.lng}`;
          }
        }
      }
      
      const nextOrderId = crypto.randomUUID();
      const paymentMethod = paymentMethods.find((method) => matchesPaymentMethod(method.name, pay));
      const orderPayload = {
        id: nextOrderId,
        customer_name: name.trim(),
        customer_phone: formatPhone(phone),
        customer_address: finalAddress,
        address_reference: null,
        notes: obs.trim() || null,
        payment_method_id: paymentMethod?.id ?? null,
        subtotal: total,
        discount,
        delivery_fee: finalDeliveryFee,
        total: finalTotal,
        coupon_id: coupon?.id ?? null,
        coupon_code: coupon?.code ?? null,
        status: pay === "pix" ? "pending" : "confirmed",
      };

      const { error: firstOrderError } = await supabaseUntyped.from("orders").insert(orderPayload);
      let orderError = firstOrderError;

      if (firstOrderError && isMissingAddressReferenceColumnError(firstOrderError)) {
        const { error: fallbackOrderError } = await supabase.from("orders").insert({
          id: nextOrderId,
          customer_name: name.trim(),
          customer_phone: formatPhone(phone),
          customer_address: finalAddress,
          notes: obs.trim() || null,
          payment_method_id: paymentMethod?.id ?? null,
          subtotal: total,
          discount,
          delivery_fee: finalDeliveryFee,
          total: finalTotal,
          status: pay === "pix" ? "pending" : "confirmed",
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
          ...(item.selectedOptions || []).map((opt) => ({
            name: `${opt.group}: ${opt.name}`,
            price: opt.price,
          })),
          ...item.addons.map((addon) => ({
            name: addon.name,
            price: addon.price,
          })),
          ...(item.notes ? [{ name: "Observação", value: item.notes }] : []),
        ],
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      let fetchedOrderNumber: number | null = null;
      try {
        const { data: orderData } = await supabase.from("orders").select("order_number").eq("id", nextOrderId).single();
        if (orderData) {
          fetchedOrderNumber = orderData.order_number;
        }
      } catch(e) {
        console.error("Failed to fetch order_number", e);
      }

      if (coupon) {
        await supabaseUntyped.from("coupons").update({ used_count: coupon.used_count + 1 }).eq("id", coupon.id);
      }

      // MERCADO PAGO INTEGRATION
      if (pay === "pix") {
        try {
          const { data: pixData, error: pixError } = await supabase.rpc("create_pix_payment", {
            payload: {
              amount: finalTotal,
              description: `Pedido ${formatOrderCode(nextOrderId, fetchedOrderNumber)}`,
              payerName: name.trim(),
              payerEmail: "lumeartesanaisc@gmail.com",
              payerCpf: cpf,
              externalReference: nextOrderId
            }
          });

          if (pixError) throw pixError;
          if (pixData?.error) throw new Error(pixData.error);

          if (pixData?.qrCodeBase64) setPixQrCode(`data:image/jpeg;base64,${pixData.qrCodeBase64}`);
          if (pixData?.qrCode) setPixCopyPaste(pixData.qrCode);
          
        } catch(e: any) {
          console.error("Erro MP proc", e);
          toast.error(`Erro MP: ${e.message}`);
        }
      }

      setConfirmedTotal(finalTotal);
      clear();
      setOrderId(nextOrderId);
      if (fetchedOrderNumber) setOrderNumber(fetchedOrderNumber);
      
      try {
        const existingIds = JSON.parse(localStorage.getItem("customer_order_ids") || "[]");
        localStorage.setItem("customer_order_ids", JSON.stringify([nextOrderId, ...existingIds]));
      } catch (e) {
        // ignore
      }

      // ===== AUTO-CRIAR CONTA DO CLIENTE =====
      const cpfDigits = cpf.replace(/\D/g, "");
      if (cpfDigits.length === 11 || cpfDigits.length === 14) {
        try {
          const clientEmail = `${cpfDigits}@cliente.lumedoces.com`;
          // Tenta criar conta (se já existir, o signUp retorna erro e ignoramos)
          const { error: signUpError } = await supabase.auth.signUp({
            email: clientEmail,
            password: cpfDigits,
            options: {
              data: {
                full_name: name.trim(),
                phone: formatPhone(phone),
                cpf: cpf,
                document_type: cpfDigits.length === 14 ? "cnpj" : "cpf",
              },
            },
          });
          if (signUpError && !signUpError.message.includes("already registered")) {
            console.warn("Auto-signup warning:", signUpError.message);
          }
          // Salva credenciais no localStorage para o cliente logar depois
          localStorage.setItem("customer_auto_credentials", JSON.stringify({
            email: clientEmail,
            hint: cpfDigits.length === 14 ? "CNPJ" : "CPF",
          }));
        } catch (e) {
          console.warn("Auto-signup silenced:", e);
        }
      }

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
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-5 py-4 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-md">
          <h2 className="flex items-center gap-2 font-hand text-xl font-extrabold text-gray-900 tracking-wide">
            <ShoppingBag className="h-5 w-5 text-brand" /> SEU PEDIDO
          </h2>
          <button
            onClick={handleClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-gray-50 text-gray-400 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {orderId ? (
            pay === "pix" && (pixQrCode || pixCopyPaste) ? (
              // ===== MODAL PIX =====
              <PixPaymentScreen
                logo={logoLume}
                orderId={orderId}
                orderNumber={orderNumber}
                pixQrCode={pixQrCode}
                pixCopyPaste={pixCopyPaste}
                confirmedTotal={confirmedTotal}
                onPaid={handleClose}
              />
            ) : (
              // ===== SUCESSO NORMAL (dinheiro/cartao ou pix sem QR) =====
              <div className="mt-10 flex flex-col items-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
              <p className="mt-4 font-hand text-xl font-bold text-foreground">Pedido recebido!</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Vamos acompanhar seu pedido por aqui. Codigo {formatOrderCode(orderId, orderNumber)}
              </p>
              
              {pay === "pix" && !pixQrCode && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm font-semibold max-w-xs mx-auto text-center">
                  Pague via PIX no app do seu banco. Total: {formatBRL(confirmedTotal)}
                </div>
              )}

              {pay !== "pix" && (
                <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm font-semibold max-w-xs mx-auto text-center">
                  O pagamento será realizado no local de retirada do seu pedido.
                </div>
              )}
              
              <div className="mt-8 max-w-xs mx-auto w-full">
                <Link
                  to="/historico"
                  onClick={handleClose}
                  className="w-full flex items-center justify-center bg-brand text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand/90 transition shadow-md"
                >
                  Acompanhar meu pedido
                </Link>
              </div>
            </div>
            )
          ) : items.length === 0 ? (
            <div className="mt-12 flex flex-col items-center text-center px-4">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-brand/10 blur-2xl"></div>
                <img
                  src={brandIcon}
                  alt=""
                  className="relative h-28 w-auto drop-shadow-xl sm:h-36 rounded-full"
                />
              </div>
              <p className="font-hand text-2xl font-bold text-gray-900">
                Seu carrinho tá vazio!
              </p>
              <p className="mt-2 text-sm text-gray-500 max-w-[250px] leading-relaxed">
                Escolha algumas delícias do cardápio pra gente preparar pra você.
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
                      {it.selectedOptions && it.selectedOptions.length > 0 && (
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                          {it.selectedOptions.map((o) => o.name).join(", ")}
                        </p>
                      )}
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
                        className="grid h-9 w-9 place-items-center rounded-full bg-white border border-border text-brand hover:bg-white/80 active:scale-95 shadow-sm"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold tabular-nums text-brand">
                        {it.quantity}
                      </span>
                      <button
                        onClick={() => setQty(it.uid, it.quantity + 1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-highlight text-white hover:opacity-90 active:scale-95 shadow-sm"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-4 w-4" />
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
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="font-hand text-lg font-extrabold text-gray-900 mb-4">Seus dados</h3>
                <div className="mt-2 space-y-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome *"
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3.5 text-base text-gray-800 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="Telefone (XX) XXXXX-XXXX *"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={15}
                    className="w-full rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3.5 text-base text-gray-800 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all"
                  />
                  <input
                    value={cpf}
                    onChange={(e) => setCpf(formatCpfCnpj(e.target.value))}
                    placeholder="CPF ou CNPJ (opcional)"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={18}
                    className="w-full rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3.5 text-base text-gray-800 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all"
                  />
                  {/* Toggle de modo de entrega */}
                  {storeSettings.delivery_enabled && storeSettings.pickup_enabled ? (
                    // Ambos ativos → mostra toggle
                    <div className="mt-5 flex gap-2 p-1.5 bg-gray-100 rounded-2xl shadow-inner">
                      <button 
                        onClick={() => setDeliveryMode("pickup")}
                        className={`flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl font-bold text-[15px] transition-all ${deliveryMode === 'pickup' ? 'bg-white shadow-sm text-brand' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <ShoppingBag className="h-4 w-4" /> Retirada
                      </button>
                      <button 
                        onClick={() => setDeliveryMode("delivery")}
                        className={`flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl font-bold text-[15px] transition-all ${deliveryMode === 'delivery' ? 'bg-white shadow-sm text-brand' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <Truck className="h-4 w-4" /> Entrega
                      </button>
                    </div>
                  ) : !storeSettings.delivery_enabled && !storeSettings.pickup_enabled ? (
                    // Nenhum ativo → aviso
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                      ⚠️ Loja não está aceitando pedidos no momento.
                    </div>
                  ) : storeSettings.pickup_enabled && !storeSettings.delivery_enabled ? (
                    // Só retirada ativa → badge informativo
                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
                      <ShoppingBag className="h-5 w-5 text-brand shrink-0" />
                      <div>
                        <p className="font-bold text-brand text-sm">Apenas Retirada no Local</p>
                        <p className="text-xs text-gray-500">Entrega indisponível no momento</p>
                      </div>
                    </div>
                  ) : (
                    // Só entrega ativa → badge informativo
                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
                      <Truck className="h-5 w-5 text-brand shrink-0" />
                      <div>
                        <p className="font-bold text-brand text-sm">Apenas Entrega Delivery</p>
                        <p className="text-xs text-gray-500">Retirada indisponível no momento</p>
                      </div>
                    </div>
                  )}

                  {deliveryMode === "pickup" ? (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4 shadow-sm">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <p className="text-[15px] font-extrabold text-brand">Retirada no local</p>
                        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                          O pedido não será entregue. Retire em: KM1 ATRÁS DO FUBICA CAR.
                        </p>
                        <a
                          href="https://www.google.com/maps/place/28%C2%B024'22.9%22S+49%C2%B024'25.2%22W/@-28.4063492,-49.407153,20.75z/data=!4m4!3m3!8m2!3d-28.4063606!4d-49.4069977"
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand text-white px-4 py-2.5 text-[13px] font-bold hover:bg-brand/90 transition shadow-sm"
                        >
                          <MapPin className="h-4 w-4" />
                          Ver no mapa
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-brand/20 bg-brand/5 p-3">
                      <p className="text-sm font-bold text-brand mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Entregar em:
                      </p>
                      
                      {savedAddresses.length > 0 ? (
                        <div className="space-y-2">
                          {savedAddresses.map(addr => (
                            <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAddressId === addr.id ? 'border-brand bg-white shadow-sm' : 'border-transparent hover:bg-white/50'}`}>
                              <input 
                                type="radio" 
                                name="address"
                                className="mt-1 text-brand focus:ring-brand"
                                checked={selectedAddressId === addr.id}
                                onChange={() => setSelectedAddressId(addr.id)}
                              />
                              <div className="flex-1">
                                <p className="font-bold text-gray-800 text-sm">
                                  {addr.street}, {addr.number}
                                </p>
                                {addr.complement && <p className="text-sm text-gray-500">{addr.complement}</p>}
                                <p className="text-xs text-gray-500 mt-0.5">{addr.neighborhood} - {addr.city}/{addr.state}</p>
                              </div>
                            </label>
                          ))}
                          
                          <Link 
                            to="/enderecos"
                            onClick={() => setOpen(false)} 
                            className="block text-center text-xs font-bold text-brand mt-2 hover:underline"
                          >
                            Gerenciar meus endereços
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-white rounded-lg">
                          <p className="text-sm text-gray-500 mb-3">Nenhum endereço salvo.</p>
                          <Link 
                            to="/enderecos"
                            onClick={() => setOpen(false)} 
                            className="inline-block px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand/90 transition"
                          >
                            Adicionar Endereço
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-gray-400 mb-3">
                  Forma de pagamento
                </h3>
                <div className="grid grid-cols-3 gap-3">
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
                        className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-[13px] transition-all ${
                          active
                            ? "border-brand bg-brand/5 ring-2 ring-brand/20 text-brand shadow-sm"
                            : "border-gray-200 bg-white hover:border-brand/30 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {p.emoji === "pix" ? (
                          <PixIcon className="h-6 w-6 opacity-90" />
                        ) : p.emoji === "card" ? (
                          <img src="https://img.icons8.com/fluency/48/bank-card-back-side.png" alt="Cartão" className="h-6 w-6 object-contain" />
                        ) : (
                          <img src="https://img.icons8.com/fluency/48/money.png" alt="Dinheiro" className="h-6 w-6 object-contain" />
                        )}
                        <span className="font-bold">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-inner">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                  Cupom de desconto
                </h3>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCoupon(null);
                    }}
                    placeholder="Digite o cupom"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3 text-base uppercase text-gray-800 placeholder:normal-case placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading || total <= 0}
                    className="rounded-xl bg-brand px-5 py-3 text-[15px] font-bold text-white shadow-sm transition hover:bg-brand/90 disabled:cursor-wait disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Aplicar"}
                  </button>
                </div>
                {coupon && (
                  <div className="mt-3 flex flex-col justify-center rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span>{coupon.code} aplicado!</span>
                      {getCouponDiscount(coupon, total) > 0 && (
                        <span>-{formatBRL(getCouponDiscount(coupon, total))}</span>
                      )}
                    </div>
                    {coupon.free_shipping && (
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                        <Truck className="h-4 w-4" />
                        Frete Grátis garantido!
                      </span>
                    )}
                  </div>
                )}
              </div>

              <textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Observações do pedido (opcional)"
                rows={2}
                className="mt-5 w-full resize-none rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3.5 text-base text-gray-800 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all"
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

        <div className="shrink-0 border-t border-gray-100 bg-white px-5 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]">
          {!orderId && discount > 0 && (
            <div className="mb-3 flex items-center justify-between text-[15px]">
              <span className="font-extrabold text-gray-500">Desconto aplicado</span>
              <span className="font-extrabold text-emerald-600">-{formatBRL(discount)}</span>
            </div>
          )}
          {!orderId && deliveryMode === "delivery" && storeSettings.delivery_enabled && storeSettings.delivery_fee > 0 && (
            <div className="mb-2 flex items-center justify-between text-[15px]">
              <span className="font-extrabold text-gray-500">Taxa de entrega</span>
              <span className="font-extrabold text-gray-900">{formatBRL(storeSettings.delivery_fee)}</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-hand text-lg font-extrabold text-gray-900">TOTAL</span>
            <span className="text-xl font-extrabold text-brand tabular-nums drop-shadow-sm">
              {formatBRL(orderId ? confirmedTotal : finalTotal)}
            </span>
          </div>
          {!orderId && items.length > 0 && finalTotal >= 5 && (
            <div className="flex justify-end mb-1 mt-0.5">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-1.5 rounded-full ring-1 ring-amber-200">
                <img src={iconPoints} alt="Pontos" className="h-4 w-4 object-contain drop-shadow-sm" />
                Você vai ganhar {Math.floor(finalTotal / 5)} pontos!
              </div>
            </div>
          )}
          {orderId ? (
            <button
              onClick={handleClose}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3 text-[15px] font-bold text-white transition hover:bg-brand/90 active:scale-[0.98] shadow-md shadow-brand/20"
            >
              Fechar Detalhes
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={saving || status.loading || !status.isOpen || items.length === 0}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-3.5 text-[15px] font-bold text-gray-400 transition disabled:opacity-100 enabled:bg-brand enabled:text-white enabled:shadow-lg enabled:shadow-brand/30 enabled:hover:bg-brand/90 enabled:active:scale-[0.98]"
            >
              {saving && <Loader2 className="h-5 w-5 animate-spin" />}
              {saving
                ? "Processando pedido..."
                : status.isOpen
                  ? "Finalizar pedido agora"
                  : "Loja Fechada"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
