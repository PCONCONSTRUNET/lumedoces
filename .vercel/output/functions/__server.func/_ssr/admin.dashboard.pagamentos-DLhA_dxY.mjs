import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { f as formatBRL, a as formatDateBR } from "./finance-utils-C_yvMaVf.mjs";
import { f as formatOrderCode } from "./order-utils-DIKjTF50.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { l as logoImage } from "./logo_lume-9BuO-Xgn.mjs";
import { v as CreditCard, a0 as ReceiptText, o as CircleCheck, t as Clock3, e as CalendarDays, c as Ban, a2 as RotateCcw, K as LoaderCircle, m as ChevronUp, j as ChevronDown, w as Download, aj as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
const PERIOD_FILTERS = [{
  key: "all",
  label: "Todos"
}, {
  key: "today",
  label: "Hoje"
}, {
  key: "week",
  label: "Semana"
}, {
  key: "month",
  label: "Mes"
}];
const STATUS_FILTERS = [{
  key: "all",
  label: "Todos",
  icon: ReceiptText
}, {
  key: "pending",
  label: "Pendente",
  icon: Clock3
}, {
  key: "paid",
  label: "Pago",
  icon: CircleCheck
}, {
  key: "cancelled",
  label: "Cancelado",
  icon: Ban
}, {
  key: "refunded",
  label: "Reembolsado",
  icon: RotateCcw
}];
function statusLabel(status) {
  if (status === "paid") return "Pago";
  if (status === "cancelled") return "Cancelado";
  if (status === "refunded") return "Reembolsado";
  return "Pendente";
}
function statusIcon(status) {
  if (status === "paid") return CircleCheck;
  if (status === "cancelled") return Ban;
  if (status === "refunded") return RotateCcw;
  return Clock3;
}
function formatDateTimeBR(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function statusClasses(status) {
  if (status === "paid") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (status === "refunded") return "bg-sky-50 text-sky-700 ring-sky-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}
function cardClasses(status) {
  if (status === "paid") return "border-emerald-200 shadow-emerald-900/5 ring-emerald-100";
  if (status === "cancelled") return "border-rose-200 shadow-rose-900/5 ring-rose-100";
  if (status === "refunded") return "border-sky-200 shadow-sky-900/5 ring-sky-100";
  return "border-amber-200 shadow-amber-900/5 ring-amber-100";
}
function sideBarClass(status) {
  if (status === "paid") return "bg-emerald-500";
  if (status === "cancelled") return "bg-rose-500";
  if (status === "refunded") return "bg-sky-500";
  return "bg-amber-500";
}
function paymentStatusFromOrder(order, fallback) {
  if (order?.status === "cancelled") return "cancelled";
  return fallback;
}
function isWithinPeriod(value, period) {
  if (period === "all") return true;
  const date = new Date(value);
  const now = /* @__PURE__ */ new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === "today") return date >= start;
  if (period === "week") {
    start.setDate(start.getDate() - 6);
    return date >= start;
  }
  start.setDate(1);
  return date >= start;
}
function PagamentosPage() {
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [transactions, setTransactions] = reactExports.useState([]);
  const [orders, setOrders] = reactExports.useState([]);
  const [paymentMethods, setPaymentMethods] = reactExports.useState([]);
  const [periodFilter, setPeriodFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [expandedPaymentId, setExpandedPaymentId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [ordersRes, pmRes] = await Promise.all([supabase.from("orders").select("*"), supabase.from("payment_methods").select("*")]);
        if (ordersRes.error) throw ordersRes.error;
        if (pmRes.error) throw pmRes.error;
        if (cancelled) return;
        setTransactions([]);
        setOrders(ordersRes.data);
        setPaymentMethods(pmRes.data);
      } catch (err) {
        console.error("Fetch falhou:", err);
        setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const paymentMethodNameById = reactExports.useMemo(() => new Map(paymentMethods.map((method) => [method.id, method.name])), [paymentMethods]);
  const orderById = reactExports.useMemo(() => new Map(orders.map((order) => [order.id, order])), [orders]);
  const payments = reactExports.useMemo(() => {
    const rows = transactions.map((transaction) => {
      const order = transaction.order_id ? orderById.get(transaction.order_id) : void 0;
      return {
        id: transaction.id,
        orderId: transaction.order_id ?? "",
        customerName: order?.customer_name ?? transaction.description,
        customerPhone: order?.customer_phone,
        amount: transaction.amount,
        status: paymentStatusFromOrder(order, transaction.status),
        occurredAt: transaction.occurred_at,
        paymentMethod: transaction.payment_method_id ? paymentMethodNameById.get(transaction.payment_method_id) ?? "Nao informado" : "Nao informado",
        source: "finance"
      };
    });
    const transactionOrderIds = new Set(transactions.map((transaction) => transaction.order_id).filter((orderId) => Boolean(orderId)));
    for (const order of orders) {
      if (transactionOrderIds.has(order.id)) continue;
      rows.push({
        id: `order-${order.id}`,
        orderId: order.id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        amount: order.total,
        status: paymentStatusFromOrder(order, order.status === "paid" ? "paid" : "pending"),
        occurredAt: order.paid_at ?? order.created_at,
        paymentMethod: order.payment_method_id ? paymentMethodNameById.get(order.payment_method_id) ?? "Nao informado" : "Nao informado",
        source: "order"
      });
    }
    return rows.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [orderById, orders, paymentMethodNameById, transactions]);
  const periodPayments = reactExports.useMemo(() => payments.filter((payment) => isWithinPeriod(payment.occurredAt, periodFilter)), [payments, periodFilter]);
  const filteredPayments = reactExports.useMemo(() => periodPayments.filter((payment) => statusFilter === "all" ? true : payment.status === statusFilter), [periodPayments, statusFilter]);
  const countByStatus = reactExports.useMemo(() => {
    const counts = /* @__PURE__ */ new Map([["all", periodPayments.length], ["pending", 0], ["paid", 0], ["cancelled", 0], ["refunded", 0]]);
    periodPayments.forEach((payment) => {
      counts.set(payment.status, (counts.get(payment.status) ?? 0) + 1);
    });
    return counts;
  }, [periodPayments]);
  const totals = reactExports.useMemo(() => ({
    paid: periodPayments.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0),
    pending: periodPayments.filter((payment) => payment.status === "pending").reduce((sum, payment) => sum + payment.amount, 0)
  }), [periodPayments]);
  const updatePaymentStatus = (id, newStatus) => {
    setTransactions((prev) => prev.map((tx) => tx.id === id ? {
      ...tx,
      status: newStatus
    } : tx));
  };
  const deletePayment = (id) => {
    if (confirm("Tem certeza que deseja excluir este pagamento?")) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-foreground", children: "Pagamentos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Historico e status dos pagamentos." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: ReceiptText, label: "Pagamentos", value: String(periodPayments.length), tone: "bg-orange-50 text-brand ring-orange-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: CircleCheck, label: "Recebido", value: formatBRL(totals.paid), tone: "bg-emerald-50 text-emerald-700 ring-emerald-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: Clock3, label: "Pendente", value: formatBRL(totals.pending), tone: "bg-amber-50 text-amber-700 ring-amber-100" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 space-y-3 rounded-2xl border border-orange-100 bg-white p-3 shadow-sm ring-1 ring-orange-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4" }),
          "Periodo"
        ] }),
        PERIOD_FILTERS.map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPeriodFilter(filter.key), className: cn("rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition", periodFilter === filter.key ? "bg-brand text-brand-foreground ring-brand" : "bg-orange-50 text-brand ring-orange-100 hover:bg-orange-100"), children: filter.label }, filter.key))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "h-4 w-4" }),
          "Status"
        ] }),
        STATUS_FILTERS.map((filter) => {
          const active = statusFilter === filter.key;
          const Icon = filter.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setStatusFilter(filter.key), className: cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition", active ? "bg-brand text-brand-foreground ring-brand" : "bg-white text-foreground ring-orange-100 hover:bg-orange-50"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
            filter.label,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full px-1.5 py-0.5 text-[10px]", active ? "bg-white/20" : "bg-orange-50 text-brand"), children: countByStatus.get(filter.key) ?? 0 })
          ] }, filter.key);
        })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center rounded-2xl bg-card p-10 shadow-sm ring-1 ring-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-brand" }) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-600", children: error }) }) : filteredPayments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhum pagamento encontrado para este filtro." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredPayments.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentCard, { payment, expanded: expandedPaymentId === payment.id, onToggle: () => setExpandedPaymentId(expandedPaymentId === payment.id ? null : payment.id), onStatusChange: (status) => updatePaymentStatus(payment.id, status), onDelete: () => deletePayment(payment.id) }, payment.id)) })
  ] });
}
function PaymentCard({
  payment,
  expanded,
  onToggle,
  onStatusChange,
  onDelete
}) {
  const StatusIcon = statusIcon(payment.status);
  const generateReceipt = async () => {
    try {
      const doc = new jsPDF();
      const W = 210;
      const BRAND = [106, 13, 21];
      const HIGHLIGHT = [222, 27, 35];
      const CREAM = [252, 244, 235];
      const GRAY = [80, 80, 80];
      const LGRAY = [160, 160, 160];
      const WHITE = [255, 255, 255];
      try {
        const b64 = await new Promise(async (resolve, reject) => {
          try {
            const r = await fetch(logoImage);
            const blob = await r.blob();
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          } catch (e) {
            reject(e);
          }
        });
        doc.addImage(b64, "PNG", 12, 8, 55, 18);
      } catch (_) {
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...BRAND);
      doc.text("COMPROVANTE", W - 12, 15, {
        align: "right"
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text("DE PAGAMENTO", W - 12, 21, {
        align: "right"
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...BRAND);
      const titleText = payment.orderId ? `Pagamento de Pedido ${formatOrderCode(payment.orderId)}` : `Pagamento #${payment.id.slice(0, 8)}`;
      doc.text(titleText, W - 12, 29, {
        align: "right"
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...LGRAY);
      doc.text(formatDateTimeBR(payment.occurredAt), W - 12, 35.5, {
        align: "right"
      });
      const sLabel = statusLabel(payment.status);
      const sBg = {
        pending: [245, 158, 11],
        paid: [16, 185, 129],
        cancelled: [239, 68, 68],
        refunded: [14, 165, 233]
      };
      const bC = sBg[payment.status] ?? [100, 100, 100];
      doc.setFillColor(...bC);
      doc.roundedRect(12, 44, 38, 7, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      doc.text(sLabel.toUpperCase(), 31, 49, {
        align: "center"
      });
      const cTop = 55;
      const cH = 44;
      doc.setFillColor(...CREAM);
      doc.roundedRect(12, cTop, 90, cH, 3, 3, "F");
      doc.setFillColor(...HIGHLIGHT);
      doc.rect(12, cTop, 3, cH, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...BRAND);
      doc.text("CLIENTE", 19, cTop + 7);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(payment.customerName || "—", 19, cTop + 14);
      if (payment.customerPhone) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(payment.customerPhone, 19, cTop + 18);
        doc.setFontSize(7.5);
        doc.setTextColor(...LGRAY);
        doc.text(`Pedido Vinculado: ${formatOrderCode(payment.orderId)}`, 19, cTop + 26);
      } else {
        doc.setFontSize(7.5);
        doc.setTextColor(...LGRAY);
        doc.text(`Pedido Vinculado: ${formatOrderCode(payment.orderId)}`, 19, cTop + 24);
      }
      doc.setFillColor(...CREAM);
      doc.roundedRect(108, cTop, 90, cH, 3, 3, "F");
      doc.setFillColor(...BRAND);
      doc.rect(108, cTop, 3, cH, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...BRAND);
      doc.text("PAGAMENTO", 115, cTop + 7);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(payment.paymentMethod || "—", 115, cTop + 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...LGRAY);
      const idLines = doc.splitTextToSize(`ID Transação: ${payment.id}`, 82);
      doc.text(idLines, 115, cTop + 33);
      const pBadgeBg = payment.status === "paid" ? [16, 185, 129] : [245, 158, 11];
      const pBadgeW = payment.status === "paid" ? 22 : 30;
      doc.setFillColor(...pBadgeBg);
      doc.roundedRect(115, cTop + 18, pBadgeW, 7, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      doc.text(payment.status === "paid" ? "PAGO" : "PENDENTE", 115 + pBadgeW / 2, cTop + 23, {
        align: "center"
      });
      let ty = cTop + cH + 15;
      doc.setFillColor(...BRAND);
      doc.rect(118, ty - 1, 80, 9, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...WHITE);
      doc.text("TOTAL PAGO", 164, ty + 5.5, {
        align: "right"
      });
      doc.text(formatBRL(payment.amount), 194, ty + 5.5, {
        align: "right"
      });
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...BRAND);
      doc.text("Lume Artesanais", W / 2, pageH - 10, {
        align: "center"
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      doc.text("Obrigada por fazer parte desse momento!", W / 2, pageH - 5, {
        align: "center"
      });
      const safeId = payment.orderId ? formatOrderCode(payment.orderId).replace("#", "") : payment.id.slice(0, 8);
      doc.save(`Comprovante_Pedido_${safeId}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar o PDF");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative overflow-hidden rounded-2xl border-2 bg-gradient-to-r from-orange-50 via-white to-white p-4 shadow-md ring-1 transition", cardClasses(payment.status)), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: cn("absolute inset-y-0 left-0 w-1.5", sideBarClass(payment.status)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onToggle, className: "flex w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-white/75 px-3 py-2 text-left ring-1 ring-white/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: payment.customerName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold ring-1", statusClasses(payment.status)), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3.5 w-3.5" }),
            statusLabel(payment.status)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          "Pedido ",
          formatOrderCode(payment.orderId),
          " | ",
          formatDateBR(payment.occurredAt),
          " |",
          " ",
          payment.paymentMethod
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-brand", children: formatBRL(payment.amount) }),
          payment.source === "order" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700", children: "Aguardando sync financeiro" })
        ] }),
        expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
      ] })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-col gap-4 rounded-xl border border-orange-100 bg-white/90 p-4 shadow-inner shadow-brand/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 text-sm sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Status:" }),
          " ",
          statusLabel(payment.status)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Valor:" }),
          " ",
          formatBRL(payment.amount)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Data e horario:" }),
          " ",
          formatDateTimeBR(payment.occurredAt)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Metodo:" }),
          " ",
          payment.paymentMethod
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Pedido:" }),
          " ",
          formatOrderCode(payment.orderId)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Origem:" }),
          " ",
          payment.source === "finance" ? "Financeiro" : "Pedido"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 border-t border-border/50 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-muted-foreground", children: "Alterar para:" }),
        STATUS_FILTERS.filter((f) => f.key !== "all").map((f) => {
          const Icon = f.icon;
          const isActive = payment.status === f.key;
          if (isActive) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onStatusChange(f.key), className: cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ring-1 transition hover:bg-black/5", f.key === "paid" && "ring-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100", f.key === "pending" && "ring-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100", f.key === "cancelled" && "ring-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100", f.key === "refunded" && "ring-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
            f.label
          ] }, f.key);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: generateReceipt, className: "inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
            "Comprovante"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onDelete, className: "inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
            "Excluir"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function SummaryCard({
  icon: Icon,
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("grid h-10 w-10 place-items-center rounded-full ring-1", tone), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-right text-xl font-extrabold text-foreground", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-semibold text-muted-foreground", children: label })
  ] });
}
export {
  PagamentosPage as component
};
