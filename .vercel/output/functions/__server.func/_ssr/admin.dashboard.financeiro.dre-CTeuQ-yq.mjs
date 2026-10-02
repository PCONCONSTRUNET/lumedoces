import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { b as toISODate, p as periodRange, a as formatDateBR, f as formatBRL } from "./finance-utils-C_yvMaVf.mjs";
import { P as PeriodFilter } from "./router-0IuQWyTa.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { a as autoTable } from "../_libs/jspdf-autotable.mjs";
import { A as ArrowLeft, y as FileText, F as FileDown, K as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function DREPage() {
  const [preset, setPreset] = reactExports.useState("month");
  const [customFrom, setCustomFrom] = reactExports.useState(toISODate(/* @__PURE__ */ new Date()));
  const [customTo, setCustomTo] = reactExports.useState(toISODate(/* @__PURE__ */ new Date()));
  const [loading, setLoading] = reactExports.useState(true);
  const [categories, setCategories] = reactExports.useState([]);
  const [txs, setTxs] = reactExports.useState([]);
  const range = reactExports.useMemo(() => periodRange(preset, customFrom, customTo), [preset, customFrom, customTo]);
  reactExports.useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const [{
        data: cats
      }, {
        data: ts
      }] = await Promise.all([supabase.from("finance_categories").select("id, name, kind, dre_group"), supabase.from("finance_transactions").select("amount, kind, status, category_id").gte("occurred_at", range.from).lte("occurred_at", range.to).eq("status", "paid")]);
      if (cancel) return;
      setCategories(cats ?? []);
      setTxs(ts ?? []);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [range.from, range.to]);
  const dre = reactExports.useMemo(() => {
    const catMap = new Map(categories.map((c) => [c.id, c]));
    const byCat = /* @__PURE__ */ new Map();
    let uncategorizedRev = 0;
    let uncategorizedExp = 0;
    txs.forEach((t) => {
      const c = t.category_id ? catMap.get(t.category_id) : void 0;
      if (!c) {
        if (t.kind === "revenue") uncategorizedRev += Number(t.amount);
        else uncategorizedExp += Number(t.amount);
        return;
      }
      byCat.set(c.id, (byCat.get(c.id) ?? 0) + Number(t.amount));
    });
    const list = (group) => categories.filter((c) => c.dre_group === group).map((c) => ({
      name: c.name,
      value: byCat.get(c.id) ?? 0
    })).filter((r) => r.value > 0);
    const revenues = list("revenue");
    if (uncategorizedRev > 0) revenues.push({
      name: "Outras receitas (sem categoria)",
      value: uncategorizedRev
    });
    const costs = list("cost");
    const expenses = list("expense");
    if (uncategorizedExp > 0) expenses.push({
      name: "Outras despesas (sem categoria)",
      value: uncategorizedExp
    });
    const totalRev = revenues.reduce((s, r) => s + r.value, 0);
    const totalCost = costs.reduce((s, r) => s + r.value, 0);
    const totalExp = expenses.reduce((s, r) => s + r.value, 0);
    const grossProfit = totalRev - totalCost;
    const netProfit = grossProfit - totalExp;
    const margin = totalRev > 0 ? netProfit / totalRev * 100 : 0;
    return {
      revenues,
      costs,
      expenses,
      totalRev,
      totalCost,
      totalExp,
      grossProfit,
      netProfit,
      margin
    };
  }, [txs, categories]);
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Demonstrativo de Resultados (DRE)", 14, 18);
    doc.setFontSize(10);
    doc.text(`Período: ${formatDateBR(range.from)} a ${formatDateBR(range.to)}`, 14, 26);
    const rows = [];
    rows.push(["RECEITAS", ""]);
    dre.revenues.forEach((r) => rows.push([`   ${r.name}`, formatBRL(r.value)]));
    rows.push(["Receita Bruta", formatBRL(dre.totalRev)]);
    rows.push(["", ""]);
    rows.push(["(-) CUSTOS", ""]);
    dre.costs.forEach((r) => rows.push([`   ${r.name}`, "-" + formatBRL(r.value)]));
    rows.push(["Total de Custos", "-" + formatBRL(dre.totalCost)]);
    rows.push(["= Lucro Bruto", formatBRL(dre.grossProfit)]);
    rows.push(["", ""]);
    rows.push(["(-) DESPESAS OPERACIONAIS", ""]);
    dre.expenses.forEach((r) => rows.push([`   ${r.name}`, "-" + formatBRL(r.value)]));
    rows.push(["Total de Despesas", "-" + formatBRL(dre.totalExp)]);
    rows.push(["", ""]);
    rows.push(["= LUCRO LÍQUIDO", formatBRL(dre.netProfit)]);
    rows.push(["Margem líquida", dre.margin.toFixed(1) + "%"]);
    autoTable(doc, {
      startY: 32,
      head: [["Conta", "Valor"]],
      body: rows,
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: [120, 80, 40]
      },
      columnStyles: {
        1: {
          halign: "right"
        }
      }
    });
    doc.save(`DRE_${range.from}_a_${range.to}.pdf`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/dashboard/financeiro", className: "grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-muted/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-foreground", children: "DRE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Demonstrativo de resultados do período." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportPDF, className: "inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "h-4 w-4" }),
        " Exportar PDF"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PeriodFilter, { preset, setPreset, customFrom, customTo, setCustomFrom, setCustomTo }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-brand" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card shadow-sm ring-1 ring-border/60 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase font-semibold text-muted-foreground tracking-wide", children: "Período" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold", children: [
          formatDateBR(range.from),
          " → ",
          formatDateBR(range.to)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "(+) Receitas", rows: dre.revenues, total: dre.totalRev, totalLabel: "Receita Bruta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "(−) Custos", rows: dre.costs, total: dre.totalCost, totalLabel: "Total de Custos", negative: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "= Lucro Bruto", value: dre.grossProfit, bold: true, highlight: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "(−) Despesas Operacionais", rows: dre.expenses, total: dre.totalExp, totalLabel: "Total de Despesas", negative: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "= LUCRO LÍQUIDO", value: dre.netProfit, bold: true, highlight: true, big: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Margem líquida" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
            dre.margin.toFixed(1),
            "%"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Section({
  title,
  rows,
  total,
  totalLabel,
  negative
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase font-semibold text-muted-foreground tracking-wide mb-2", children: title }),
    rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Sem lançamentos" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pl-3 text-foreground/80", children: r.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: negative ? "text-rose-600" : "text-emerald-600", children: [
        negative ? "−" : "",
        " ",
        formatBRL(r.value)
      ] })
    ] }, r.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 pt-2 border-t border-border/40 flex justify-between text-sm font-bold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: totalLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: negative ? "text-rose-600" : "text-emerald-600", children: [
        negative ? "−" : "",
        " ",
        formatBRL(total)
      ] })
    ] })
  ] });
}
function Row({
  label,
  value,
  bold,
  highlight,
  big
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 flex justify-between " + (highlight ? "bg-muted/40 " : "") + (big ? "text-base " : "text-sm ") + (bold ? "font-bold " : ""), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: value >= 0 ? "text-emerald-600" : "text-rose-600", children: formatBRL(value) })
  ] });
}
export {
  DREPage as component
};
