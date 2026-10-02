import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PaymentLabel } from "./PaymentLabel-C4dSyJxL.mjs";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, b as DialogFooter } from "./dialog-BeIewlnY.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as toISODate, p as periodRange, f as formatBRL, a as formatDateBR, d as downloadBlob, t as toCSV } from "./finance-utils-C_yvMaVf.mjs";
import { P as PeriodFilter } from "./router-0IuQWyTa.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { a as autoTable } from "../_libs/jspdf-autotable.mjs";
import { aq as Wallet, y as FileText, F as FileDown, _ as Plus, al as TrendingUp, ak as TrendingDown, a4 as Scale, K as LoaderCircle, Y as Pencil, aj as Trash2, a3 as Save } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, d as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, c as Line, e as PieChart, P as Pie, b as Cell } from "../_libs/recharts.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
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
function FinanceiroPage() {
  const [preset, setPreset] = reactExports.useState("30d");
  const [customFrom, setCustomFrom] = reactExports.useState(toISODate(/* @__PURE__ */ new Date()));
  const [customTo, setCustomTo] = reactExports.useState(toISODate(/* @__PURE__ */ new Date()));
  const [kindFilter, setKindFilter] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("");
  const [catFilter, setCatFilter] = reactExports.useState("");
  const [pmFilter, setPmFilter] = reactExports.useState("");
  const [categories, setCategories] = reactExports.useState([]);
  const [methods, setMethods] = reactExports.useState([]);
  const [txs, setTxs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const range = reactExports.useMemo(() => periodRange(preset, customFrom, customTo), [preset, customFrom, customTo]);
  const load = async () => {
    setLoading(true);
    let q = supabase.from("finance_transactions").select("*").gte("occurred_at", range.from).lte("occurred_at", range.to).order("occurred_at", {
      ascending: false
    }).order("created_at", {
      ascending: false
    });
    if (kindFilter) q = q.eq("kind", kindFilter);
    if (statusFilter) q = q.eq("status", statusFilter);
    if (catFilter) q = q.eq("category_id", catFilter);
    if (pmFilter) q = q.eq("payment_method_id", pmFilter);
    try {
      const {
        data,
        error
      } = await q;
      if (error) throw error;
      setTxs(data ?? []);
    } catch (error) {
      setTxs([{
        id: "mock1",
        kind: "revenue",
        status: "paid",
        amount: 150.5,
        description: "Venda - Pedido #123",
        occurred_at: (/* @__PURE__ */ new Date()).toISOString(),
        category_id: "cat_vendas",
        payment_method_id: "pix",
        order_id: "123",
        is_auto: true
      }, {
        id: "mock2",
        kind: "expense",
        status: "paid",
        amount: 45,
        description: "Ingredientes (Farinha)",
        occurred_at: (/* @__PURE__ */ new Date()).toISOString(),
        category_id: "cat_insumos",
        payment_method_id: "dinheiro",
        order_id: null,
        is_auto: false
      }]);
    }
    setLoading(false);
  };
  reactExports.useEffect(() => {
    (async () => {
      try {
        const [{
          data: cats,
          error: err1
        }, {
          data: pms,
          error: err2
        }] = await Promise.all([supabase.from("finance_categories").select("*").order("sort_order"), supabase.from("payment_methods").select("id, name").order("sort_order")]);
        if (err1 || err2) throw new Error("Supabase error");
        setCategories(cats ?? []);
        setMethods(pms ?? []);
      } catch (e) {
        setCategories([{
          id: "cat_vendas",
          name: "Vendas",
          kind: "revenue",
          dre_group: "revenue",
          color: "#10b981"
        }, {
          id: "cat_insumos",
          name: "Insumos",
          kind: "expense",
          dre_group: "cost",
          color: "#ef4444"
        }]);
        setMethods([{
          id: "pix",
          name: "PIX"
        }, {
          id: "dinheiro",
          name: "Dinheiro"
        }]);
      }
    })();
  }, []);
  reactExports.useEffect(() => {
    load();
  }, [range.from, range.to, kindFilter, statusFilter, catFilter, pmFilter]);
  const stats = reactExports.useMemo(() => {
    const paid = txs.filter((t) => t.status === "paid");
    const revenue = paid.filter((t) => t.kind === "revenue").reduce((s, t) => s + Number(t.amount), 0);
    const expense = paid.filter((t) => t.kind === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const pending = txs.filter((t) => t.status === "pending").reduce((s, t) => s + (t.kind === "revenue" ? Number(t.amount) : -Number(t.amount)), 0);
    return {
      revenue,
      expense,
      profit: revenue - expense,
      pending
    };
  }, [txs]);
  const byDay = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    const from = new Date(range.from);
    const to = new Date(range.to);
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const k = toISODate(d);
      map.set(k, {
        day: k.slice(5),
        receita: 0,
        despesa: 0
      });
    }
    txs.filter((t) => t.status === "paid").forEach((t) => {
      const e = map.get(t.occurred_at.slice(0, 10));
      if (e) {
        if (t.kind === "revenue") e.receita += Number(t.amount);
        else e.despesa += Number(t.amount);
      }
    });
    return Array.from(map.values());
  }, [txs, range.from, range.to]);
  const byCategory = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    txs.filter((t) => t.status === "paid" && t.kind === "expense").forEach((t) => {
      const cat = categories.find((c) => c.id === t.category_id);
      const key = cat?.name ?? "Sem categoria";
      const e = m.get(key) ?? {
        name: key,
        value: 0,
        color: cat?.color ?? "#94a3b8"
      };
      e.value += Number(t.amount);
      m.set(key, e);
    });
    return Array.from(m.values());
  }, [txs, categories]);
  const byPayment = reactExports.useMemo(() => {
    const nm = new Map(methods.map((m2) => [m2.id, m2.name]));
    const m = /* @__PURE__ */ new Map();
    txs.filter((t) => t.status === "paid" && t.kind === "revenue").forEach((t) => {
      const key = t.payment_method_id ? nm.get(t.payment_method_id) ?? "Outros" : "Não informado";
      m.set(key, (m.get(key) ?? 0) + Number(t.amount));
    });
    return Array.from(m.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [txs, methods]);
  const exportCSV = () => {
    const rows = txs.map((t) => ({
      Data: formatDateBR(t.occurred_at),
      Tipo: t.kind === "revenue" ? "Receita" : "Despesa",
      Status: t.status === "paid" ? "Pago" : "Pendente",
      Descrição: t.description,
      Categoria: categories.find((c) => c.id === t.category_id)?.name ?? "",
      Pagamento: methods.find((m) => m.id === t.payment_method_id)?.name ?? "",
      Valor: Number(t.amount).toFixed(2).replace(".", ",")
    }));
    downloadBlob(toCSV(rows), `financeiro_${range.from}_a_${range.to}.csv`, "text/csv;charset=utf-8");
  };
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Relatório Financeiro", 14, 18);
    doc.setFontSize(10);
    doc.text(`Período: ${formatDateBR(range.from)} a ${formatDateBR(range.to)}`, 14, 26);
    doc.text(`Receitas: ${formatBRL(stats.revenue)}   Despesas: ${formatBRL(stats.expense)}   Lucro: ${formatBRL(stats.profit)}`, 14, 32);
    autoTable(doc, {
      startY: 38,
      head: [["Data", "Tipo", "Status", "Descrição", "Categoria", "Pagamento", "Valor"]],
      body: txs.map((t) => [formatDateBR(t.occurred_at), t.kind === "revenue" ? "Receita" : "Despesa", t.status === "paid" ? "Pago" : "Pendente", t.description, categories.find((c) => c.id === t.category_id)?.name ?? "", methods.find((m) => m.id === t.payment_method_id)?.name ?? "", formatBRL(t.amount)]),
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [120, 80, 40]
      }
    });
    doc.save(`financeiro_${range.from}_a_${range.to}.pdf`);
  };
  const remove = async (id) => {
    if (!confirm("Excluir este lançamento?")) return;
    const {
      error
    } = await supabase.from("finance_transactions").delete().eq("id", id);
    if (error) toast.error("Erro: " + error.message);
    else {
      toast.success("Lançamento excluído");
      load();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-foreground", children: "Financeiro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Lançamentos, fluxo de caixa e DRE." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/dashboard/financeiro/dre", className: "inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/70 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
          " DRE"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportCSV, className: "inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/70 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "h-4 w-4" }),
          " CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportPDF, className: "inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/70 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "h-4 w-4" }),
          " PDF"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setEditing(null);
          setModalOpen(true);
        }, className: "inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Novo lançamento"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeriodFilter, { preset, setPreset, customFrom, customTo, setCustomFrom, setCustomTo }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card shadow-sm ring-1 ring-border/60 px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1", children: "Filtros" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: kindFilter, onChange: setKindFilter, label: "Tipo", compact: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "revenue", children: "Receita" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "expense", children: "Despesa" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onChange: setStatusFilter, label: "Status", compact: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paid", children: "Pago" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pendente" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: catFilter, onChange: setCatFilter, label: "Categoria", compact: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todas" }),
        categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: pmFilter, onChange: setPmFilter, label: "Pagamento", compact: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todos" }),
        methods.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.id, children: m.name }, m.id))
      ] }),
      (kindFilter || statusFilter || catFilter || pmFilter) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
        setKindFilter("");
        setStatusFilter("");
        setCatFilter("");
        setPmFilter("");
      }, className: "ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground underline-offset-2 hover:underline", children: "Limpar" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }), label: "Receitas", value: formatBRL(stats.revenue), color: "emerald" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4" }), label: "Despesas", value: formatBRL(stats.expense), color: "rose" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-4 w-4" }), label: "Lucro / Saldo", value: formatBRL(stats.profit), color: stats.profit >= 0 ? "emerald" : "rose" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }), label: "Pendente", value: formatBRL(stats.pending), color: "amber" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartCard, { title: "Receita × Despesa por dia", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: byDay, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", stroke: "var(--muted-foreground)", fontSize: 11 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--muted-foreground)", fontSize: 11 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => formatBRL(v), contentStyle: {
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "receita", stroke: "#10b981", strokeWidth: 2, dot: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "despesa", stroke: "#ef4444", strokeWidth: 2, dot: false })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartCard, { title: "Despesas por categoria", children: byCategory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-10 text-center", children: "Sem despesas no período." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: byCategory, dataKey: "value", nameKey: "name", outerRadius: 90, label: (e) => e.name, children: byCategory.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: d.color }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => formatBRL(v), contentStyle: {
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8
        } })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartCard, { title: "Receita por forma de pagamento", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: byPayment, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 90, paddingAngle: 3, label: (e) => `${e.name}: ${formatBRL(e.value)}`, children: byPayment.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: ["#10b981", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#64748b"][i % 6] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => formatBRL(v), contentStyle: {
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8
        } })
      ] }) }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card shadow-sm ring-1 ring-border/60 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border/60 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold", children: [
        "Movimentações (",
        txs.length,
        ")"
      ] }) }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-brand" }) }) : txs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-10 text-center", children: "Nenhum lançamento no período." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs uppercase text-muted-foreground border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Descrição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Categoria" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Pagamento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Valor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4", children: "Ações" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: txs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: formatDateBR(t.occurred_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.description }),
            t.is_auto && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase rounded bg-muted px-1.5 py-0.5 text-muted-foreground", children: "auto" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: categories.find((c) => c.id === t.category_id)?.name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentLabel, { name: methods.find((m) => m.id === t.payment_method_id)?.name }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full px-2 py-0.5 text-xs font-semibold " + (t.status === "paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"), children: t.status === "paid" ? "Pago" : "Pendente" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-right font-bold whitespace-nowrap " + (t.kind === "revenue" ? "text-emerald-600" : "text-rose-600"), children: [
            t.kind === "revenue" ? "+" : "-",
            " ",
            formatBRL(t.amount)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setEditing(t);
              setModalOpen(true);
            }, disabled: t.is_auto, className: "grid h-8 w-8 place-items-center rounded-lg hover:bg-muted disabled:opacity-30", title: t.is_auto ? "Lançamento automático" : "Editar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(t.id), disabled: t.is_auto, className: "grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30", title: t.is_auto ? "Lançamento automático" : "Excluir", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
          ] }) })
        ] }, t.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TxModal, { open: modalOpen, onOpenChange: setModalOpen, editing, categories, methods, onSaved: load })
  ] });
}
function Stat({
  icon,
  label,
  value,
  color
}) {
  const cls = {
    emerald: "bg-emerald-500/10 text-emerald-600",
    rose: "bg-rose-500/10 text-rose-600",
    amber: "bg-amber-500/10 text-amber-600"
  }[color];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-8 w-8 place-items-center rounded-full ${cls}`, children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-2xl font-bold", children: value })
  ] });
}
function ChartCard({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold mb-3", children: title }),
    children
  ] });
}
function Select({
  value,
  onChange,
  label,
  children,
  compact = false
}) {
  if (compact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-muted-foreground uppercase tracking-wide", children: [
        label,
        ":"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value, onChange: (e) => onChange(e.target.value), className: "rounded-md border border-border bg-background px-2 py-1 text-xs font-medium", children })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block font-semibold text-muted-foreground uppercase tracking-wide", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value, onChange: (e) => onChange(e.target.value), className: "w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm", children })
  ] });
}
function TxModal({
  open,
  onOpenChange,
  editing,
  categories,
  methods,
  onSaved
}) {
  const [kind, setKind] = reactExports.useState("expense");
  const [status, setStatus] = reactExports.useState("paid");
  const [amount, setAmount] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [occurredAt, setOccurredAt] = reactExports.useState(toISODate(/* @__PURE__ */ new Date()));
  const [categoryId, setCategoryId] = reactExports.useState("");
  const [pmId, setPmId] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open) return;
    if (editing) {
      setKind(editing.kind);
      setStatus(editing.status);
      setAmount(String(editing.amount).replace(".", ","));
      setDescription(editing.description);
      setOccurredAt(editing.occurred_at);
      setOccurredAt(editing.occurred_at);
      const editCat = categories.find((c) => c.id === editing.category_id);
      setCategoryId(editCat ? editCat.name : "");
      const editPm = methods.find((m) => m.id === editing.payment_method_id);
      setPmId(editPm ? editPm.name : "");
    } else {
      setKind("expense");
      setStatus("paid");
      setAmount("");
      setDescription("");
      setOccurredAt(toISODate(/* @__PURE__ */ new Date()));
      setCategoryId("");
      setPmId("");
    }
  }, [open, editing]);
  const onSave = async () => {
    const value = Number(amount.replace(/\./g, "").replace(",", "."));
    if (!description.trim() || !value || value <= 0) {
      toast.error("Preencha descrição e valor válido");
      return;
    }
    setSaving(true);
    setSaving(true);
    let finalCatId = null;
    const catInput = categoryId.trim();
    if (catInput) {
      const existingCat = categories.find((c) => c.name.toLowerCase() === catInput.toLowerCase());
      if (existingCat) {
        finalCatId = existingCat.id;
      } else {
        const {
          data: newCat
        } = await supabase.from("finance_categories").insert({
          name: catInput,
          kind,
          dre_group: kind === "revenue" ? "revenue" : "expense",
          color: "#64748b"
        }).select("id").single();
        finalCatId = newCat?.id ?? null;
      }
    }
    let finalPmId = null;
    const pmInput = pmId.trim();
    if (pmInput) {
      const existingPm = methods.find((m) => m.name.toLowerCase() === pmInput.toLowerCase());
      if (existingPm) {
        finalPmId = existingPm.id;
      } else {
        const {
          data: newPm
        } = await supabase.from("payment_methods").insert({
          name: pmInput
        }).select("id").single();
        finalPmId = newPm?.id ?? null;
      }
    }
    const payload = {
      kind,
      status,
      amount: value,
      description: description.trim(),
      occurred_at: occurredAt,
      category_id: finalCatId,
      payment_method_id: finalPmId
    };
    const {
      error
    } = editing ? await supabase.from("finance_transactions").update(payload).eq("id", editing.id) : await supabase.from("finance_transactions").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Erro: " + error.message);
      return;
    }
    toast.success(editing ? "Lançamento atualizado" : "Lançamento criado");
    onOpenChange(false);
    onSaved();
  };
  const availableCats = categories.filter((c) => c.kind === kind);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "w-[calc(100vw-2rem)] sm:max-w-lg p-4 sm:p-6 rounded-lg max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Editar lançamento" : "Novo lançamento" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          setKind("revenue");
          setCategoryId("");
        }, className: "rounded-xl py-2.5 text-sm font-bold transition border-2 " + (kind === "revenue" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "border-border bg-background text-muted-foreground"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "inline h-4 w-4 mr-1" }),
          " Receita"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          setKind("expense");
          setCategoryId("");
        }, className: "rounded-xl py-2.5 text-sm font-bold transition border-2 " + (kind === "expense" ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-border bg-background text-muted-foreground"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "inline h-4 w-4 mr-1" }),
          " Despesa"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lbl, { label: "Descrição*", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: description, onChange: (e) => setDescription(e.target.value), maxLength: 200, className: "ipt", placeholder: "Ex: Compra de farinha", autoFocus: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lbl, { label: "Valor (R$)*", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: amount, onChange: (e) => setAmount(e.target.value), inputMode: "decimal", className: "ipt", placeholder: "0,00" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lbl, { label: "Data*", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: occurredAt, onChange: (e) => setOccurredAt(e.target.value), className: "ipt" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Lbl, { label: "Categoria", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { list: "cats-list", value: categoryId, onChange: (e) => setCategoryId(e.target.value), placeholder: "Ex: Insumos", className: "ipt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "cats-list", children: availableCats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.name }, c.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Lbl, { label: "Forma de pagamento", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { list: "pm-list", value: pmId, onChange: (e) => setPmId(e.target.value), placeholder: "Ex: Pix, Cartão", className: "ipt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "pm-list", children: methods.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.name }, m.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lbl, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStatus("paid"), className: "rounded-lg py-2 text-sm font-bold border-2 " + (status === "paid" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "border-border bg-background text-muted-foreground"), children: "Pago" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStatus("pending"), className: "rounded-lg py-2 text-sm font-bold border-2 " + (status === "pending" ? "border-amber-500 bg-amber-500/10 text-amber-600" : "border-border bg-background text-muted-foreground"), children: "Pendente" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onOpenChange(false), className: "inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm font-bold hover:bg-muted/70", children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onSave, disabled: saving, className: "inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-60", children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        "Salvar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
          .ipt {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
            background: var(--background);
            color: var(--foreground);
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
          }
          .ipt:focus {
            border-color: var(--brand);
            box-shadow: 0 0 0 2px color-mix(in oklab, var(--brand) 35%, transparent);
          }
        ` })
  ] }) });
}
function Lbl({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold text-foreground/80", children: label }),
    children
  ] });
}
export {
  FinanceiroPage as component
};
