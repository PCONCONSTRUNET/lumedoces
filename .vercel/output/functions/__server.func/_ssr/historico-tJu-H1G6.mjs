import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { f as formatBRL } from "./cart-CsSEv74G.mjs";
import { f as formatOrderCode } from "./order-utils-DIKjTF50.mjs";
import { l as logoImage } from "./logo_lume-9BuO-Xgn.mjs";
import { p as products } from "./menu-D9sMzlT2.mjs";
import { A as ArrowLeft, V as PackageOpen, am as Truck, ae as SquareCheckBig, r as CircleX, o as CircleCheck, i as ChefHat, s as Clock, ar as X } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const STATUS_CONFIG = {
  pending: {
    label: "Aguardando Confirmação",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  confirmed: {
    label: "Confirmado",
    icon: CircleCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  preparing: {
    label: "Em Preparo",
    icon: ChefHat,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  },
  ready_for_pickup: {
    label: "Aguardando Retirada",
    icon: SquareCheckBig,
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-100"
  },
  out_for_delivery: {
    label: "Saiu para Entrega",
    icon: Truck,
    color: "text-sky-600",
    bgColor: "bg-sky-100"
  },
  delivered: {
    label: "Finalizado",
    icon: SquareCheckBig,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100"
  },
  paid: {
    label: "Pago",
    icon: CircleCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
  cancelled: {
    label: "Cancelado",
    icon: CircleX,
    color: "text-rose-600",
    bgColor: "bg-rose-100"
  },
  ready: {
    label: "Pronto",
    icon: SquareCheckBig,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  dispatched: {
    label: "Despachado",
    icon: Truck,
    color: "text-teal-600",
    bgColor: "bg-teal-100"
  }
};
const TIMELINE_STEPS = [{
  id: "pending",
  label: "Pedido Recebido"
}, {
  id: "confirmed",
  label: "Confirmado"
}, {
  id: "preparing",
  label: "Em Preparo"
}, {
  id: "dispatch",
  label: "Saiu para Entrega / Retirada"
}, {
  id: "delivered",
  label: "Finalizado"
}];
const getStatusIndex = (status) => {
  if (status === "cancelled") return -1;
  if (status === "pending" || status === "paid") return 0;
  if (status === "confirmed") return 1;
  if (status === "preparing") return 2;
  if (status === "out_for_delivery" || status === "ready_for_pickup") return 3;
  if (status === "delivered") return 4;
  return 0;
};
function HistoricoPage() {
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const [cancelling, setCancelling] = reactExports.useState(null);
  const [confirmCancel, setConfirmCancel] = reactExports.useState(null);
  const handleCancel = async (order) => {
    if (cancelling) return;
    setCancelling(order.id);
    try {
      const {
        error
      } = await supabase.from("orders").update({
        status: "cancelled",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", order.id);
      if (error) throw error;
      setOrders((prev) => prev.map((o) => o.id === order.id ? {
        ...o,
        status: "cancelled"
      } : o));
      setSelectedOrder((prev) => prev?.id === order.id ? {
        ...prev,
        status: "cancelled"
      } : prev);
      setConfirmCancel(null);
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(null);
    }
  };
  reactExports.useEffect(() => {
    async function loadOrders() {
      try {
        const savedIds = JSON.parse(localStorage.getItem("customer_order_ids") || "[]");
        if (!savedIds || savedIds.length === 0) {
          setLoading(false);
          return;
        }
        const {
          data,
          error
        } = await supabase.from("orders").select("*, order_items(*)").in("id", savedIds).order("created_at", {
          ascending: false
        });
        if (data) {
          setOrders(data);
        }
      } catch (e) {
        console.error("Erro ao carregar histórico", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-cream/30 pb-20 pt-8 px-4 sm:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/perfil", className: "inline-flex items-center gap-2 text-brand font-bold hover:underline mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Voltar ao Perfil"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl font-extrabold text-highlight mb-2", children: "Meus Pedidos" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-8", children: "Acompanhe o andamento dos pedidos que você fez neste dispositivo." }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" }) }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, { className: "h-10 w-10 text-gray-300" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Nenhum pedido encontrado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-2 max-w-sm mx-auto", children: "Você ainda não fez nenhum pedido neste aparelho ou eles foram apagados do histórico." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 rounded-full bg-brand px-6 py-3 font-bold text-white shadow-md hover:scale-105 transition", children: "Ver Cardápio" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: orders.map((order) => {
      const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
      const StatusIcon = statusConfig.icon;
      const isPix = order.payment_method_id === "pix";
      const isPendingPayment = isPix && order.status === "pending";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-md border-2 border-brand/20 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-gray-50 bg-gray-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400", children: formatOrderCode(order.id, order.order_number) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500", children: new Date(order.created_at).toLocaleString("pt-BR") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-800", children: order.customer_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 px-4 py-2 rounded-xl border ${statusConfig.bgColor} border-white shadow-sm shrink-0`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: `h-5 w-5 ${statusConfig.color}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold text-sm ${statusConfig.color}`, children: isPendingPayment ? "Aguardando PIX" : statusConfig.label })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4 mb-6", children: order.order_items?.map((item) => {
            const product = products.find((p) => p.name === item.product_name);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                product?.image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: item.product_name, className: "w-14 h-14 object-cover rounded-lg" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-gray-800", children: [
                    item.quantity,
                    "x ",
                    item.product_name
                  ] }),
                  item.variations_snapshot && item.variations_snapshot.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: item.variations_snapshot.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block", children: [
                    "• ",
                    v.name,
                    " (+",
                    formatBRL(v.price),
                    ")"
                  ] }, i)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800 shrink-0", children: formatBRL(item.total_price || 0) })
            ] }, item.id);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center pt-4 border-t border-gray-100 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-medium", children: "Total do Pedido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-highlight", children: formatBRL(order.total || 0) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto", children: [
              (order.status === "pending" || order.status === "confirmed") && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setConfirmCancel(order), disabled: cancelling === order.id, className: "w-full sm:w-auto px-4 py-3 border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors flex justify-center items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
                " Cancelar"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedOrder(order), className: "w-full sm:w-auto px-6 py-3 bg-brand/10 text-brand font-bold rounded-xl hover:bg-brand/20 transition-colors flex justify-center items-center gap-2", children: "Acompanhar Pedido" })
            ] })
          ] }),
          isPendingPayment && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-amber-800 font-bold mb-1", children: "Pagamento Pendente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700", children: "Seu pedido foi registrado e está aguardando a confirmação do pagamento PIX." })
          ] })
        ] })
      ] }, order.id);
    }) }),
    confirmCancel && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-8 w-8 text-rose-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Cancelar pedido?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-500 mt-2 text-sm", children: [
          "Tem certeza que deseja cancelar o pedido ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatOrderCode(confirmCancel.id, confirmCancel.order_number) }),
          "? Esta ação não pode ser desfeita."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleCancel(confirmCancel), disabled: cancelling === confirmCancel.id, className: "w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition disabled:opacity-50", children: cancelling === confirmCancel.id ? "Cancelando..." : "Sim, cancelar pedido" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmCancel(null), className: "w-full py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition", children: "Voltar" })
      ] })
    ] }) }),
    selectedOrder && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedOrder(null), className: "absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-6 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoImage, alt: "Lume Artesanais", className: "h-14 w-auto object-contain mb-2 drop-shadow-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Status do Pedido" })
      ] }),
      selectedOrder.status === "cancelled" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-8 w-8 text-rose-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Pedido Cancelado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-2", children: "Infelizmente este pedido foi cancelado." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative pl-6 border-l-2 border-gray-100 space-y-8 mt-4 ml-4 pb-4", children: TIMELINE_STEPS.map((step, index) => {
        const currentIndex = getStatusIndex(selectedOrder.status);
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -left-[42px] flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-sm shrink-0 z-10 transition-colors duration-500
                          ${isCompleted ? "bg-brand" : isCurrent ? "bg-brand" : "bg-gray-200"}`, children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-white" }) : isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-white animate-pulse" }) : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-bold transition-all duration-500 ${isCurrent ? "text-brand text-lg translate-x-1" : isCompleted ? "text-gray-800" : "text-gray-400"}`, children: step.label })
        ] }, step.id);
      }) })
    ] }) })
  ] }) });
}
export {
  HistoricoPage as component
};
