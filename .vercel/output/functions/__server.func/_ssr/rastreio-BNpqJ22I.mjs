import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Header, C as CartDrawer } from "./CartDrawer-BMuulltj.mjs";
import { F as Footer } from "./Footer-jppd2-op.mjs";
import { C as CartProvider } from "./cart-CsSEv74G.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { f as formatOrderCode } from "./order-utils-DIKjTF50.mjs";
import { t as Clock3, a6 as Search, U as Package, c as Ban, o as CircleCheck, am as Truck, ap as UtensilsCrossed } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./logo_lume-9BuO-Xgn.mjs";
import "./PaymentLabel-C4dSyJxL.mjs";
import "./useBusinessStatus-BBSRvrw0.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const STATUS_ICONS = {
  pending: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-5 w-5" }),
  confirmed: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }),
  preparing: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "h-5 w-5" }),
  ready_for_pickup: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
  out_for_delivery: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5" }),
  delivered: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }),
  cancelled: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-5 w-5" }),
  paid: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" })
};
const STATUS_LABELS = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready_for_pickup: "Aguardando Retirada",
  out_for_delivery: "Saiu para Entrega",
  delivered: "Finalizado",
  cancelled: "Cancelado",
  paid: "Pago"
};
const STATUS_STEPS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
function RastreioPage() {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [orders, setOrders] = reactExports.useState([]);
  const [searched, setSearched] = reactExports.useState(false);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || searchQuery.trim().length < 3) {
      toast.error("Por favor, insira um código de pedido ou telefone válido.");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      let query = supabase.from("orders").select("*").order("created_at", {
        ascending: false
      }).limit(5);
      const cleanSearch = searchQuery.trim();
      const isNumberOnly = /^\d+$/.test(cleanSearch.replace(/^#/, ""));
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSearch);
      if (isUUID) {
        query = query.eq("id", cleanSearch);
      } else if (isNumberOnly && cleanSearch.replace(/^#/, "").length <= 6) {
        query = query.eq("order_number", parseInt(cleanSearch.replace(/^#/, ""), 10));
      } else {
        query = query.ilike("customer_phone", `%${cleanSearch.replace(/\D/g, "")}%`);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar pedidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  const getStepIndex = (status) => {
    if (status === "cancelled") return -1;
    if (status === "ready_for_pickup") return 3;
    if (status === "paid") return 1;
    return STATUS_STEPS.indexOf(status);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container max-w-3xl mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-black text-brand font-fredoka mb-3", children: "Acompanhe seu Pedido" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-brand/80 font-nunito", children: "Digite seu número de telefone ou o código do pedido para acompanhar o status." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-brand/20 shadow-lg mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearch, className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ex: 11999999999 ou #0012", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-4 h-12 text-lg border-brand/30 focus-visible:ring-highlight" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "h-12 px-8 bg-highlight hover:bg-highlight/90 text-white font-bold text-lg", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5 mr-2" }),
          "Buscar"
        ] }) })
      ] }) }) }),
      searched && !loading && orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 bg-white rounded-xl border border-brand/10 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-16 w-16 mx-auto text-brand/30 mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-brand font-fredoka", children: "Nenhum pedido encontrado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/70 mt-2", children: "Não localizamos pedidos recentes para o número informado." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: orders.map((order) => {
        const currentStepIndex = getStepIndex(order.status || "pending");
        const isCancelled = order.status === "cancelled";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-brand/20 shadow-md overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-brand/5 px-6 py-4 border-b border-brand/10 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-brand/60 uppercase tracking-wider", children: [
                "Pedido ",
                formatOrderCode(order.id, order.order_number)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand/50 mt-1", children: new Date(order.created_at).toLocaleString("pt-BR") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-brand text-lg", children: [
                "R$ ",
                Number(order.total).toFixed(2).replace(".", ",")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-brand/20 text-brand mt-1 shadow-sm", children: [
                STATUS_ICONS[order.status || "pending"],
                STATUS_LABELS[order.status || "pending"]
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: isCancelled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-12 w-12 mx-auto text-red-500 mb-3 opacity-80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-red-700", children: "Pedido Cancelado" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-600/80 mt-1 text-sm", children: "Este pedido foi cancelado e não será entregue." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-4 right-4 h-1 bg-brand/10 -translate-y-1/2 rounded-full hidden sm:block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-4 h-1 bg-highlight -translate-y-1/2 rounded-full transition-all duration-500 hidden sm:block", style: {
              width: `${Math.max(0, currentStepIndex / (STATUS_STEPS.length - 1) * 100)}%`
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0", children: STATUS_STEPS.map((step, idx) => {
              const isCompleted = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row sm:flex-col items-center gap-4 sm:gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 transition-all duration-300 ${isCompleted ? "bg-highlight border-highlight text-white shadow-md shadow-highlight/30" : "bg-white border-brand/20 text-brand/40"} ${isCurrent ? "ring-4 ring-highlight/20 scale-110" : ""}`, children: STATUS_ICONS[step] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-bold ${isCompleted ? "text-brand" : "text-brand/50"}`, children: STATUS_LABELS[step] }) })
              ] }, step);
            }) })
          ] }) })
        ] }, order.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] }) });
}
export {
  RastreioPage as component
};
