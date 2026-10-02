import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { l as logoImage } from "./logo_lume-9BuO-Xgn.mjs";
import { u as useCart, f as formatBRL } from "./cart-CsSEv74G.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as PixIcon } from "./PaymentLabel-C4dSyJxL.mjs";
import { u as useBusinessStatus } from "./useBusinessStatus-BBSRvrw0.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { f as formatOrderCode } from "./order-utils-DIKjTF50.mjs";
import { ar as X, Q as Menu, a as ArrowRight, ac as ShoppingCart, ab as ShoppingBag, o as CircleCheck, aj as Trash2, S as Minus, _ as Plus, am as Truck, P as MapPin, v as CreditCard, d as Banknote, s as Clock, K as LoaderCircle, u as Copy } from "../_libs/lucide-react.mjs";
function WhatsAppIcon({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      className,
      "aria-hidden": "true",
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })
    }
  );
}
const WPP = "5548996915303";
function Header() {
  const { count, setOpen } = useCart();
  const [dark, setDark] = reactExports.useState(false);
  const [navOpen, setNavOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: `sticky top-0 z-50 w-full bg-white/80 px-4 sm:px-8 py-2 shadow-sm backdrop-blur-md border-b border-gray-200 transition-all duration-300`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoImage, alt: "Lume Artesanais", className: "h-10 sm:h-12 w-auto object-contain drop-shadow-sm", width: 144, height: 48 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setNavOpen(!navOpen),
            className: "grid h-10 w-11 place-items-center rounded-xl border-2 border-highlight bg-white text-highlight shadow-sm transition hover:bg-highlight/10 dark:bg-transparent",
            "aria-label": "Menu",
            children: navOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6 stroke-[2.5]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-6 w-6 stroke-[2.5]" })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `overflow-hidden transition-all duration-300 ease-in-out ${navOpen ? "max-h-96 opacity-100 mt-4 pb-2" : "max-h-0 opacity-0"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col space-y-2 px-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            onClick: () => setNavOpen(false),
            className: "flex items-center justify-between py-2 text-foreground/90 font-bold hover:text-foreground transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Início" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 opacity-50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            hash: "menu",
            onClick: () => setNavOpen(false),
            className: "flex items-center justify-between py-2 text-foreground/90 font-bold hover:text-foreground transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Produtos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 opacity-50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/contato",
            onClick: () => setNavOpen(false),
            className: "flex items-center justify-between py-2 text-foreground/90 font-bold hover:text-foreground transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Contato" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 opacity-50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/rastreio",
            onClick: () => setNavOpen(false),
            className: "flex items-center justify-between py-2 text-highlight font-bold hover:text-highlight/80 transition bg-highlight/5 px-3 rounded-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Rastrear Pedido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 opacity-50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/historico",
            onClick: () => setNavOpen(false),
            className: "flex items-center justify-between py-2 text-brand font-bold hover:text-brand/80 transition bg-brand/5 px-3 rounded-lg mb-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Meus Pedidos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 opacity-50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/perfil",
            onClick: () => setNavOpen(false),
            className: "flex items-center justify-between py-2 text-gray-700 font-bold hover:text-gray-900 transition bg-gray-50 px-3 rounded-lg mb-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Meu Perfil" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 opacity-50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setNavOpen(false);
              setOpen(true);
            },
            className: "flex items-center justify-center gap-2 w-full rounded-2xl bg-highlight hover:bg-highlight/90 text-white font-bold py-3 shadow-sm transition mt-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5 fill-white/20" }),
              "Fazer pedido"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: `https://wa.me/${WPP}`,
        target: "_blank",
        rel: "noreferrer",
        className: "fixed bottom-8 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-7 w-7" })
      }
    )
  ] });
}
const brandIcon = "/assets/icon-BcssllVv.png";
const PIX_EXPIRY_SECONDS = 30 * 60;
function PixPaymentScreen({ logo, orderId, orderNumber, pixQrCode, pixCopyPaste, confirmedTotal, onPaid }) {
  const [paid, setPaid] = reactExports.useState(false);
  const [secondsLeft, setSecondsLeft] = reactExports.useState(PIX_EXPIRY_SECONDS);
  const [copied, setCopied] = reactExports.useState(false);
  const intervalRef = reactExports.useRef(null);
  const pollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    const checkStatus = async () => {
      const { data } = await supabase.from("orders").select("status").eq("id", orderId).single();
      if (data?.status === "confirmed" || data?.status === "preparing" || data?.status === "ready") {
        setPaid(true);
        if (pollRef.current) clearInterval(pollRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        toast.success("Pagamento confirmado! 🎉");
      }
    };
    const channel = supabase.channel(`order_pix_${orderId}`).on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` }, (payload) => {
      const status = payload.new?.status;
      if (status === "confirmed" || status === "preparing" || status === "ready") {
        setPaid(true);
        if (pollRef.current) clearInterval(pollRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        toast.success("Pagamento confirmado! 🎉");
      }
    }).subscribe();
    pollRef.current = setInterval(checkStatus, 5e3);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      supabase.removeChannel(channel);
    };
  }, [orderId]);
  const handleCopy = () => {
    if (!pixCopyPaste) return;
    navigator.clipboard.writeText(pixCopyPaste);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3e3);
  };
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const expired = secondsLeft === 0;
  if (paid) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] text-center px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Lume Artesanais", className: "w-20 h-20 rounded-full object-contain border-4 border-brand/20 mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-white" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-6 text-2xl font-bold text-brand font-hand", children: "Pagamento Confirmado!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
        "Pedido ",
        formatOrderCode(orderId, orderNumber),
        " foi pago com sucesso. Já estamos preparando tudo! 🍫"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-bold text-brand text-lg", children: formatBRL(confirmedTotal) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/historico", onClick: onPaid, className: "mt-8 w-full flex items-center justify-center bg-brand text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand/90 transition shadow-md", children: "Acompanhar meu pedido" })
    ] });
  }
  if (expired) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] text-center px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Lume Artesanais", className: "h-10 w-auto object-contain mb-4 opacity-60 mix-blend-multiply" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "QR Code expirado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: "O tempo para pagamento via PIX expirou. Faça um novo pedido para gerar um novo código." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/historico", onClick: onPaid, className: "mt-8 w-full flex items-center justify-center border border-brand text-brand font-bold py-3 px-4 rounded-xl hover:bg-brand/5 transition", children: "Ver meu pedido" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-white border border-brand/10 rounded-2xl p-6 shadow-sm flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Lume Artesanais", className: "h-12 sm:h-14 w-auto object-contain mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: formatBRL(confirmedTotal) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs mb-6", children: [
        "Pedido ",
        formatOrderCode(orderId, orderNumber)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground/70 mb-3", children: "Escaneie o QR Code para pagar" }),
      pixQrCode ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: pixQrCode, alt: "QR Code PIX", className: "w-52 h-52 rounded-xl border-4 border-brand/10" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center w-52 h-52 mx-auto rounded-xl border-4 border-brand/10 bg-brand/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 text-brand animate-spin" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-sm font-bold tabular-nums ${secondsLeft < 120 ? "text-red-500" : "text-amber-600"}`, children: [
          minutes,
          ":",
          seconds
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "para expirar" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 mt-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 text-muted-foreground animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Aguardando pagamento..." })
      ] })
    ] }),
    pixCopyPaste && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Ou use o Pix Copia e Cola" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleCopy,
          className: `w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all ${copied ? "bg-emerald-500 text-white" : "bg-brand text-white hover:bg-brand/90 active:scale-95"}`,
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
            " Código copiado!"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }),
            " Copiar código PIX"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: 'Cole no app do seu banco em "Pix → Copia e Cola"' })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/historico", onClick: onPaid, className: "mt-5 text-sm text-brand/70 underline underline-offset-2 hover:text-brand transition", children: "Já paguei, acompanhar pedido" })
  ] });
}
function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function matchesPaymentMethod(name, pay) {
  const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (pay === "pix") return normalized.includes("pix");
  if (pay === "dinheiro") return normalized.includes("dinheiro");
  return normalized.includes("cartao");
}
function onlyPhoneDigits(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}
function onlyCpfCnpjDigits(value) {
  return value.replace(/\D/g, "").slice(0, 14);
}
function formatCpfCnpj(value) {
  const digits = onlyCpfCnpjDigits(value);
  if (digits.length > 11) {
    const d = digits.slice(0, 14);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}
function formatPhone(value) {
  const digits = onlyPhoneDigits(value);
  const area = digits.slice(0, 2);
  const firstPart = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const secondPart = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);
  if (digits.length <= 2) return area ? `(${area}` : "";
  if (!secondPart) return `(${area}) ${firstPart}`;
  return `(${area}) ${firstPart}-${secondPart}`;
}
function isMissingAddressReferenceColumnError(error) {
  const message = (error.message ?? "").toLowerCase();
  return error.code === "PGRST204" || message.includes("schema cache") || message.includes("address_reference") || message.includes("coupon_id") || message.includes("coupon_code");
}
function normalizeCouponCode(value) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
function getCouponDiscount(coupon, subtotal) {
  if (coupon.discount_type === "percent") {
    return Math.min(subtotal, Number((subtotal * coupon.discount_value / 100).toFixed(2)));
  }
  return Math.min(subtotal, Number(coupon.discount_value));
}
function validateCoupon(coupon, subtotal) {
  const now = /* @__PURE__ */ new Date();
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
function CartDrawer() {
  const supabaseUntyped = supabase;
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  const status = useBusinessStatus();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [cpf, setCpf] = reactExports.useState("");
  const [pay, setPay] = reactExports.useState("pix");
  const [obs, setObs] = reactExports.useState("");
  const [couponCode, setCouponCode] = reactExports.useState("");
  const [coupon, setCoupon] = reactExports.useState(null);
  const [couponLoading, setCouponLoading] = reactExports.useState(false);
  const [paymentMethods, setPaymentMethods] = reactExports.useState([]);
  const [saving, setSaving] = reactExports.useState(false);
  const [orderId, setOrderId] = reactExports.useState(null);
  const [pixQrCode, setPixQrCode] = reactExports.useState(null);
  const [pixCopyPaste, setPixCopyPaste] = reactExports.useState(null);
  const [confirmedTotal, setConfirmedTotal] = reactExports.useState(0);
  const [orderNumber, setOrderNumber] = reactExports.useState(null);
  const discount = coupon ? getCouponDiscount(coupon, total) : 0;
  const deliveryModeInitial = "pickup";
  const [deliveryMode, setDeliveryMode] = reactExports.useState(deliveryModeInitial);
  const [storeSettings, setStoreSettings] = reactExports.useState({ delivery_enabled: true, pickup_enabled: true, delivery_fee: 0 });
  const finalDeliveryFee = deliveryMode === "delivery" && storeSettings.delivery_enabled ? storeSettings.delivery_fee : 0;
  const finalTotal = Math.max(0, total - discount) + finalDeliveryFee;
  const [savedAddresses, setSavedAddresses] = reactExports.useState([]);
  const [selectedAddressId, setSelectedAddressId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!open) return;
    supabase.from("payment_methods").select("id, name").eq("is_active", true).order("sort_order").then(({ data }) => setPaymentMethods(data ?? []));
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.addresses) {
        const addrs = session.user.user_metadata.addresses;
        setSavedAddresses(addrs);
        if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
      }
    });
    supabaseUntyped.from("store_settings").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) {
        setStoreSettings(data);
        if (!data.pickup_enabled && data.delivery_enabled) setDeliveryMode("delivery");
        if (!data.delivery_enabled && data.pickup_enabled) setDeliveryMode("pickup");
      }
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
      const { data, error } = await supabaseUntyped.from("coupons").select("*").eq("code", normalized).maybeSingle();
      if (error) throw error;
      if (!data) {
        setCoupon(null);
        toast.error("Cupom nao encontrado");
        return;
      }
      const row = data;
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
        const addr = savedAddresses.find((a) => a.id === selectedAddressId);
        if (addr) {
          finalAddress = `${addr.street}, ${addr.number}`;
          if (addr.complement) finalAddress += ` - ${addr.complement}`;
          finalAddress += ` | ${addr.neighborhood} | ${addr.city} - ${addr.state} | CEP: ${addr.zipCode}`;
          if (addr.lat && addr.lng) {
            finalAddress += `

📍 Mapa de Entrega: https://www.google.com/maps?q=${addr.lat},${addr.lng}`;
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
        status: pay === "pix" ? "pending" : "confirmed"
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
          status: pay === "pix" ? "pending" : "confirmed"
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
            price: opt.price
          })),
          ...item.addons.map((addon) => ({
            name: addon.name,
            price: addon.price
          })),
          ...item.notes ? [{ name: "Observação", value: item.notes }] : []
        ]
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;
      let fetchedOrderNumber = null;
      try {
        const { data: orderData } = await supabase.from("orders").select("order_number").eq("id", nextOrderId).single();
        if (orderData) {
          fetchedOrderNumber = orderData.order_number;
        }
      } catch (e) {
        console.error("Failed to fetch order_number", e);
      }
      if (coupon) {
        await supabaseUntyped.from("coupons").update({ used_count: coupon.used_count + 1 }).eq("id", coupon.id);
      }
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
        } catch (e) {
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
      }
      const cpfDigits = cpf.replace(/\D/g, "");
      if (cpfDigits.length === 11 || cpfDigits.length === 14) {
        try {
          const clientEmail = `${cpfDigits}@cliente.lumedoces.com`;
          const { error: signUpError } = await supabase.auth.signUp({
            email: clientEmail,
            password: cpfDigits,
            options: {
              data: {
                full_name: name.trim(),
                phone: formatPhone(phone),
                cpf,
                document_type: cpfDigits.length === 14 ? "cnpj" : "cpf"
              }
            }
          });
          if (signUpError && !signUpError.message.includes("already registered")) {
            console.warn("Auto-signup warning:", signUpError.message);
          }
          localStorage.setItem("customer_auto_credentials", JSON.stringify({
            email: clientEmail,
            hint: cpfDigits.length === 14 ? "CNPJ" : "CPF"
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex justify-end bg-black/50 animate-in fade-in sm:items-stretch", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[100dvh] w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right sm:h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-5 py-4 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-hand text-xl font-extrabold text-gray-900 tracking-wide", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5 text-brand" }),
        " SEU PEDIDO"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleClose,
          className: "grid h-10 w-10 place-items-center rounded-full bg-gray-50 text-gray-400 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition",
          "aria-label": "Fechar",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto overscroll-contain px-4 py-3", children: [
      orderId ? pay === "pix" && (pixQrCode || pixCopyPaste) ? (
        // ===== MODAL PIX =====
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PixPaymentScreen,
          {
            logo: logoImage,
            orderId,
            orderNumber,
            pixQrCode,
            pixCopyPaste,
            confirmedTotal,
            onPaid: handleClose
          }
        )
      ) : (
        // ===== SUCESSO NORMAL (dinheiro/cartao ou pix sem QR) =====
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-9 w-9" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-hand text-xl font-bold text-foreground", children: "Pedido recebido!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 max-w-xs text-sm text-muted-foreground", children: [
            "Vamos acompanhar seu pedido por aqui. Codigo ",
            formatOrderCode(orderId, orderNumber)
          ] }),
          pay === "pix" && !pixQrCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm font-semibold max-w-xs mx-auto text-center", children: [
            "Pague via PIX no app do seu banco. Total: ",
            formatBRL(confirmedTotal)
          ] }),
          pay !== "pix" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm font-semibold max-w-xs mx-auto text-center", children: "O pagamento será realizado no local de retirada do seu pedido." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 max-w-xs mx-auto w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/historico",
              onClick: handleClose,
              className: "w-full flex items-center justify-center bg-brand text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand/90 transition shadow-md",
              children: "Acompanhar meu pedido"
            }
          ) })
        ] })
      ) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex flex-col items-center text-center px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-brand/10 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: brandIcon,
              alt: "",
              className: "relative h-28 w-auto drop-shadow-xl sm:h-36 rounded-full"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-hand text-2xl font-bold text-gray-900", children: "Seu carrinho tá vazio!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-gray-500 max-w-[250px] leading-relaxed", children: "Escolha algumas delícias do cardápio pra gente preparar pra você." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: it.image,
              alt: it.name,
              className: "h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-border/60",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-hand text-[15px] font-bold leading-tight", children: it.name }),
            it.selectedOptions && it.selectedOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 line-clamp-2 text-[11px] text-muted-foreground", children: it.selectedOptions.map((o) => o.name).join(", ") }),
            it.addons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 line-clamp-2 text-[11px] text-muted-foreground", children: [
              "+ ",
              it.addons.map((a) => a.name).join(", ")
            ] }),
            it.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 line-clamp-2 text-[11px] italic text-muted-foreground", children: [
              '"',
              it.notes,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => remove(it.uid),
              className: "grid h-8 w-8 shrink-0 place-items-center rounded-full text-destructive hover:bg-destructive/10",
              "aria-label": "Remover",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setQty(it.uid, it.quantity - 1),
                className: "grid h-9 w-9 place-items-center rounded-full bg-white border border-border text-brand hover:bg-white/80 active:scale-95 shadow-sm",
                "aria-label": "Diminuir",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center text-sm font-bold tabular-nums text-brand", children: it.quantity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setQty(it.uid, it.quantity + 1),
                className: "grid h-9 w-9 place-items-center rounded-full bg-highlight text-white hover:opacity-90 active:scale-95 shadow-sm",
                "aria-label": "Aumentar",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-brand tabular-nums", children: formatBRL(it.unitPrice * it.quantity) })
        ] })
      ] }, it.uid)) }),
      !orderId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border-t border-gray-100 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-hand text-lg font-extrabold text-gray-900 mb-4", children: "Seus dados" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Seu nome *",
                autoComplete: "name",
                className: "w-full rounded-2xl border border-gray-200 bg-gray-50 shadow-sm px-4 py-3.5 text-[15px] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 transition"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: phone,
                onChange: (e) => setPhone(formatPhone(e.target.value)),
                placeholder: "Telefone (XX) XXXXX-XXXX *",
                inputMode: "tel",
                autoComplete: "tel",
                maxLength: 15,
                className: "w-full rounded-2xl border border-gray-200 bg-gray-50 shadow-sm px-4 py-3.5 text-[15px] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 transition"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: cpf,
                onChange: (e) => setCpf(formatCpfCnpj(e.target.value)),
                placeholder: "CPF ou CNPJ (opcional, para recibo PIX)",
                inputMode: "numeric",
                autoComplete: "off",
                maxLength: 18,
                className: "w-full rounded-2xl border border-gray-200 bg-gray-50 shadow-sm px-4 py-3.5 text-[15px] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 transition"
              }
            ),
            storeSettings.delivery_enabled && storeSettings.pickup_enabled ? (
              // Ambos ativos → mostra toggle
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-2 p-1.5 bg-gray-100 rounded-2xl shadow-inner", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setDeliveryMode("pickup"),
                    className: `flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl font-bold text-[15px] transition-all ${deliveryMode === "pickup" ? "bg-white shadow-sm text-brand" : "text-gray-500 hover:text-gray-700"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
                      " Retirada"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setDeliveryMode("delivery"),
                    className: `flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl font-bold text-[15px] transition-all ${deliveryMode === "delivery" ? "bg-white shadow-sm text-brand" : "text-gray-500 hover:text-gray-700"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4" }),
                      " Entrega"
                    ]
                  }
                )
              ] })
            ) : !storeSettings.delivery_enabled && !storeSettings.pickup_enabled ? (
              // Nenhum ativo → aviso
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700", children: "⚠️ Loja não está aceitando pedidos no momento." })
            ) : storeSettings.pickup_enabled && !storeSettings.delivery_enabled ? (
              // Só retirada ativa → badge informativo
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5 text-brand shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-brand text-sm", children: "Apenas Retirada no Local" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Entrega indisponível no momento" })
                ] })
              ] })
            ) : (
              // Só entrega ativa → badge informativo
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-brand shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-brand text-sm", children: "Apenas Entrega Delivery" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Retirada indisponível no momento" })
                ] })
              ] })
            ),
            deliveryMode === "pickup" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] font-extrabold text-brand", children: "Retirada no local" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-600 leading-relaxed", children: "O pedido não será entregue. Retire em: KM1 ATRÁS DO FUBICA CAR." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: "https://www.google.com/maps/place/28%C2%B024'22.9%22S+49%C2%B024'25.2%22W/@-28.4063492,-49.407153,20.75z/data=!4m4!3m3!8m2!3d-28.4063606!4d-49.4069977",
                    target: "_blank",
                    rel: "noreferrer",
                    className: "mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand text-white px-4 py-2.5 text-[13px] font-bold hover:bg-brand/90 transition shadow-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
                      "Ver no mapa"
                    ]
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-brand/20 bg-brand/5 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-brand mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
                " Entregar em:"
              ] }),
              savedAddresses.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                savedAddresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAddressId === addr.id ? "border-brand bg-white shadow-sm" : "border-transparent hover:bg-white/50"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "address",
                      className: "mt-1 text-brand focus:ring-brand",
                      checked: selectedAddressId === addr.id,
                      onChange: () => setSelectedAddressId(addr.id)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-gray-800 text-sm", children: [
                      addr.street,
                      ", ",
                      addr.number
                    ] }),
                    addr.complement && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: addr.complement }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [
                      addr.neighborhood,
                      " - ",
                      addr.city,
                      "/",
                      addr.state
                    ] })
                  ] })
                ] }, addr.id)),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/enderecos",
                    onClick: () => setOpen(false),
                    className: "block text-center text-xs font-bold text-brand mt-2 hover:underline",
                    children: "Gerenciar meus endereços"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 bg-white rounded-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mb-3", children: "Nenhum endereço salvo." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/enderecos",
                    onClick: () => setOpen(false),
                    className: "inline-block px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand/90 transition",
                    children: "Adicionar Endereço"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border-t border-gray-100 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[13px] font-extrabold uppercase tracking-wider text-gray-400 mb-3", children: "Forma de pagamento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
            { id: "pix", label: "PIX", emoji: "pix" },
            { id: "cartao", label: "Cartão", emoji: "card" },
            { id: "dinheiro", label: "Dinheiro", emoji: "cash" }
          ].map((p) => {
            const active = pay === p.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setPay(p.id),
                className: `flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-[13px] transition-all ${active ? "border-brand bg-brand/5 ring-2 ring-brand/20 text-brand shadow-sm" : "border-gray-200 bg-white hover:border-brand/30 text-gray-500 hover:bg-gray-50"}`,
                children: [
                  p.emoji === "pix" ? /* @__PURE__ */ jsxRuntimeExports.jsx(PixIcon, { className: "h-6 w-6 opacity-90" }) : p.emoji === "card" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-6 w-6 text-sky-600 opacity-90" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "h-6 w-6 text-green-600 opacity-90" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: p.label })
                ]
              },
              p.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-inner", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[13px] font-extrabold uppercase tracking-wider text-gray-400 mb-2", children: "Cupom de desconto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: couponCode,
                onChange: (e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setCoupon(null);
                },
                placeholder: "Digite o cupom",
                className: "min-w-0 flex-1 rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3 text-[15px] uppercase placeholder:normal-case placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: applyCoupon,
                disabled: couponLoading || total <= 0,
                className: "rounded-xl bg-brand px-5 py-3 text-[15px] font-bold text-white shadow-sm transition hover:bg-brand/90 disabled:cursor-wait disabled:opacity-50",
                children: couponLoading ? "..." : "Aplicar"
              }
            )
          ] }),
          coupon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              coupon.code,
              " aplicado!"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "-",
              formatBRL(discount)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: obs,
            onChange: (e) => setObs(e.target.value),
            placeholder: "Observações do pedido (opcional)",
            rows: 2,
            className: "mt-5 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 shadow-sm px-4 py-3.5 text-[15px] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 transition"
          }
        ),
        !status.loading && !status.isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-destructive", children: "Estamos fechados" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive/80", children: status.label })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-t border-gray-100 bg-white px-5 pt-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]", children: [
      !orderId && discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between text-[15px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-gray-500", children: "Desconto aplicado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-extrabold text-emerald-600", children: [
          "-",
          formatBRL(discount)
        ] })
      ] }),
      !orderId && deliveryMode === "delivery" && storeSettings.delivery_enabled && storeSettings.delivery_fee > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between text-[15px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-gray-500", children: "Taxa de entrega" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-gray-900", children: formatBRL(storeSettings.delivery_fee) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-hand text-xl font-extrabold text-gray-900", children: "TOTAL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-extrabold text-brand tabular-nums drop-shadow-sm", children: formatBRL(orderId ? confirmedTotal : finalTotal) })
      ] }),
      orderId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleClose,
          className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-[16px] font-bold text-white transition hover:bg-brand/90 active:scale-[0.98] shadow-md shadow-brand/20",
          children: "Fechar Detalhes"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleCheckout,
          disabled: saving || status.loading || !status.isOpen || items.length === 0,
          className: "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 py-4 text-[16px] font-bold text-gray-400 transition disabled:opacity-100 enabled:bg-brand enabled:text-white enabled:shadow-lg enabled:shadow-brand/30 enabled:hover:bg-brand/90 enabled:active:scale-[0.98]",
          children: [
            saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
            saving ? "Processando pedido..." : status.isOpen ? "Finalizar pedido agora" : "Loja Fechada"
          ]
        }
      )
    ] })
  ] }) });
}
export {
  CartDrawer as C,
  Header as H,
  WhatsAppIcon as W
};
