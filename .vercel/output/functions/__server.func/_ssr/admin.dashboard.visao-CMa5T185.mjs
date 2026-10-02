import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { b as toISODate, p as periodRange, f as formatBRL } from "./finance-utils-C_yvMaVf.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { f as ChartColumn, K as LoaderCircle, D as DollarSign, ab as ShoppingBag, al as TrendingUp } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, a as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, B as Bar } from "../_libs/recharts.mjs";
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
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const STATUS_LABELS = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  delivered: "Entregue",
  paid: "Pago",
  cancelled: "Cancelado"
};
const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#a855f7",
  delivered: "#06b6d4",
  paid: "#10b981",
  cancelled: "#ef4444"
};
function DashboardVisaoPage() {
  const [preset, setPreset] = reactExports.useState("30d");
  const [customFrom, setCustomFrom] = reactExports.useState(toISODate(/* @__PURE__ */ new Date()));
  const [customTo, setCustomTo] = reactExports.useState(toISODate(/* @__PURE__ */ new Date()));
  const [loading, setLoading] = reactExports.useState(true);
  const [orders, setOrders] = reactExports.useState([]);
  const [items, setItems] = reactExports.useState([]);
  const [methods, setMethods] = reactExports.useState([]);
  const range = reactExports.useMemo(() => periodRange(preset, customFrom, customTo), [preset, customFrom, customTo]);
  reactExports.useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const isoFrom = range.from + "T00:00:00.000Z";
        const isoTo = range.to + "T23:59:59.999Z";
        const [ordersRes, itemsRes, pmRes] = await Promise.all([supabase.from("orders").select("id, customer_name, total, status, payment_method_id, created_at").gte("created_at", isoFrom).lte("created_at", isoTo), supabase.from("order_items").select("order_id, product_id, product_name, quantity, total_price"), supabase.from("payment_methods").select("id, name")]);
        if (cancel) return;
        if (ordersRes.data) setOrders(ordersRes.data);
        if (itemsRes.data) setItems(itemsRes.data);
        if (pmRes.data) setMethods(pmRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [range.from, range.to]);
  const stats = reactExports.useMemo(() => {
    const paid = orders.filter((o) => o.status === "paid");
    const revenue = paid.reduce((s, o) => s + Number(o.total), 0);
    const count = orders.length;
    const avg = paid.length ? revenue / paid.length : 0;
    const today = toISODate(/* @__PURE__ */ new Date());
    const todayCount = orders.filter((o) => o.created_at.slice(0, 10) === today).length;
    return {
      revenue,
      count,
      avg,
      todayCount,
      paidCount: paid.length
    };
  }, [orders]);
  const byDay = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    const from = new Date(range.from);
    const to = new Date(range.to);
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const k = toISODate(d);
      map.set(k, {
        day: k.slice(5),
        pedidos: 0,
        receita: 0
      });
    }
    orders.forEach((o) => {
      const k = o.created_at.slice(0, 10);
      const entry = map.get(k);
      if (entry) {
        entry.pedidos += 1;
        if (o.status === "paid") entry.receita += Number(o.total);
      }
    });
    return Array.from(map.values());
  }, [orders, range.from, range.to]);
  const byStatus = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    orders.forEach((o) => m.set(o.status, (m.get(o.status) ?? 0) + 1));
    return Array.from(m.entries()).map(([k, v]) => ({
      name: STATUS_LABELS[k] ?? k,
      value: v,
      color: STATUS_COLORS[k] ?? "#94a3b8"
    }));
  }, [orders]);
  const byPayment = reactExports.useMemo(() => {
    const nm = new Map(methods.map((m2) => [m2.id, m2.name]));
    const m = /* @__PURE__ */ new Map();
    orders.filter((o) => o.status === "paid").forEach((o) => {
      const k = o.payment_method_id ? nm.get(o.payment_method_id) ?? "Outros" : "Não informado";
      m.set(k, (m.get(k) ?? 0) + Number(o.total));
    });
    return Array.from(m.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [orders, methods]);
  const topProducts = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    items.forEach((it) => {
      const key = it.product_name || "—";
      const e = m.get(key) ?? {
        name: key,
        qty: 0,
        total: 0
      };
      e.qty += it.quantity;
      e.total += Number(it.total_price);
      m.set(key, e);
    });
    return Array.from(m.values()).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [items]);
  orders.slice(0, 8);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-foreground", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Visão geral de pedidos, faturamento e performance." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeriodFilter, { preset, setPreset, customFrom, customTo, setCustomFrom, setCustomTo }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-brand" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4" }), label: "Faturamento", value: formatBRL(stats.revenue), accent: "emerald" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }), label: "Pedidos no período", value: stats.count.toString(), sub: `${stats.paidCount} pagos` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }), label: "Ticket médio", value: formatBRL(stats.avg) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }), label: "Pedidos hoje", value: stats.todayCount.toString(), accent: "brand" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 xl:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Faturamento por dia", className: "border-none shadow-xl shadow-brand/5 bg-white/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: byDay, margin: {
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "var(--border)", opacity: 0.5 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false, tickFormatter: (v) => `R$${v}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { cursor: {
              fill: "var(--muted)",
              opacity: 0.4
            }, contentStyle: {
              background: "#fff",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              color: "var(--foreground)",
              fontWeight: 500
            }, formatter: (v, name) => [formatBRL(v), "Receita"], labelStyle: {
              color: "var(--muted-foreground)",
              marginBottom: "4px"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "receita", fill: "#10b981", radius: [4, 4, 0, 0], barSize: 32 })
          ] }) }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Formas de Pagamento", className: "border-none shadow-xl shadow-brand/5 bg-white/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
              byPayment.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Sem dados" }),
              byPayment.map((p) => {
                const totalRevenue = byPayment.reduce((acc, curr) => acc + curr.value, 0);
                const pct = totalRevenue > 0 ? p.value / totalRevenue * 100 : 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: p.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: formatBRL(p.value) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-brand rounded-full", style: {
                    width: `${pct}%`
                  } }) })
                ] }, p.name);
              })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Status dos Pedidos", className: "border-none shadow-xl shadow-brand/5 bg-white/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
              byStatus.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Sem dados" }),
              byStatus.map((s) => {
                const totalOrders = byStatus.reduce((acc, curr) => acc + curr.value, 0);
                const pct = totalOrders > 0 ? s.value / totalOrders * 100 : 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: s.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-muted-foreground", children: [
                      s.value,
                      " ped."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full", style: {
                    width: `${pct}%`,
                    backgroundColor: s.color
                  } }) })
                ] }, s.name);
              })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:col-span-1 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Mais Vendidos", className: "border-none shadow-xl shadow-brand/5 bg-gradient-to-br from-brand/5 to-transparent h-full", children: topProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-10 text-center", children: "Nenhuma venda no período." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3 pt-2", children: topProducts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/60 hover:bg-white transition-colors shadow-sm ring-1 ring-white/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("grid h-8 w-8 place-items-center rounded-xl text-xs font-black shrink-0 shadow-sm", i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-slate-300 text-slate-800" : i === 2 ? "bg-amber-700/40 text-amber-950" : "bg-muted text-muted-foreground"), children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-foreground/90 text-sm", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                p.qty,
                " unidades"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 font-bold text-sm text-emerald-600", children: formatBRL(p.total) })
        ] }, p.name)) }) }) })
      ] })
    ] })
  ] });
}
function PeriodFilter({
  preset,
  setPreset,
  customFrom,
  customTo,
  setCustomFrom,
  setCustomTo
}) {
  const opts = [{
    k: "today",
    l: "Hoje"
  }, {
    k: "7d",
    l: "7 dias"
  }, {
    k: "30d",
    l: "30 dias"
  }, {
    k: "month",
    l: "Este mês"
  }, {
    k: "custom",
    l: "Personalizado"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 rounded-full bg-muted p-1", children: opts.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPreset(o.k), className: "rounded-full px-3 py-1.5 text-xs font-bold transition " + (preset === o.k ? "bg-brand text-brand-foreground shadow" : "text-foreground/70 hover:text-foreground"), children: o.l }, o.k)) }),
    preset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: customFrom, onChange: (e) => setCustomFrom(e.target.value), className: "rounded-lg border border-border bg-background px-2 py-1.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "até" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: customTo, onChange: (e) => setCustomTo(e.target.value), className: "rounded-lg border border-border bg-background px-2 py-1.5" })
    ] })
  ] });
}
function StatCard({
  icon,
  label,
  value,
  sub,
  accent
}) {
  const accentClass = accent === "emerald" ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-200" : accent === "brand" ? "bg-gradient-to-br from-brand to-brand-foreground text-white shadow-brand/20" : "bg-white text-brand shadow-orange-100 ring-1 ring-border/50";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-white p-5 shadow-xl shadow-brand/5 border border-border/40 transition hover:shadow-2xl hover:-translate-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("grid h-10 w-10 place-items-center rounded-2xl shadow-lg", accentClass), children: icon })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-foreground tracking-tight", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mt-1", children: sub })
    ] })
  ] });
}
function Card({
  title,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-3xl bg-white p-6 shadow-sm border border-border/40", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black text-foreground mb-4", children: title }),
    children
  ] });
}
export {
  PeriodFilter,
  DashboardVisaoPage as component
};
