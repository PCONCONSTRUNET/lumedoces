import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileDown, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  formatBRL,
  formatDateBR,
  periodRange,
  toISODate,
  type PeriodPreset,
} from "@/lib/finance-utils";
import { PeriodFilter } from "./admin.dashboard.visao";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const Route = createFileRoute("/admin/dashboard/financeiro/dre")({
  component: DREPage,
});

type Category = {
  id: string;
  name: string;
  kind: "revenue" | "expense";
  dre_group: "revenue" | "cost" | "expense";
};
type Tx = {
  amount: number;
  kind: "revenue" | "expense";
  status: "paid" | "pending";
  category_id: string | null;
};

function DREPage() {
  const [preset, setPreset] = useState<PeriodPreset>("month");
  const [customFrom, setCustomFrom] = useState(toISODate(new Date()));
  const [customTo, setCustomTo] = useState(toISODate(new Date()));
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);

  const range = useMemo(
    () => periodRange(preset, customFrom, customTo),
    [preset, customFrom, customTo],
  );

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const [{ data: cats }, { data: ts }] = await Promise.all([
        supabase.from("finance_categories").select("id, name, kind, dre_group"),
        supabase
          .from("finance_transactions")
          .select("amount, kind, status, category_id")
          .gte("occurred_at", range.from)
          .lte("occurred_at", range.to)
          .eq("status", "paid"),
      ]);
      if (cancel) return;
      setCategories((cats ?? []) as Category[]);
      setTxs((ts ?? []) as Tx[]);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [range.from, range.to]);

  const dre = useMemo(() => {
    const catMap = new Map(categories.map((c) => [c.id, c]));
    const byCat = new Map<string, number>();
    let uncategorizedRev = 0;
    let uncategorizedCost = 0;
    let uncategorizedExp = 0;
    txs.forEach((t) => {
      const c = t.category_id ? catMap.get(t.category_id) : undefined;
      if (!c) {
        if (t.kind === "revenue") uncategorizedRev += Number(t.amount);
        else uncategorizedExp += Number(t.amount);
        return;
      }
      byCat.set(c.id, (byCat.get(c.id) ?? 0) + Number(t.amount));
    });

    const list = (group: "revenue" | "cost" | "expense") =>
      categories
        .filter((c) => c.dre_group === group)
        .map((c) => ({ name: c.name, value: byCat.get(c.id) ?? 0 }))
        .filter((r) => r.value > 0);

    const revenues = list("revenue");
    if (uncategorizedRev > 0) revenues.push({ name: "Outras receitas (sem categoria)", value: uncategorizedRev });
    const costs = list("cost");
    if (uncategorizedCost > 0) costs.push({ name: "Outros custos", value: uncategorizedCost });
    const expenses = list("expense");
    if (uncategorizedExp > 0) expenses.push({ name: "Outras despesas (sem categoria)", value: uncategorizedExp });

    const totalRev = revenues.reduce((s, r) => s + r.value, 0);
    const totalCost = costs.reduce((s, r) => s + r.value, 0);
    const totalExp = expenses.reduce((s, r) => s + r.value, 0);
    const grossProfit = totalRev - totalCost;
    const netProfit = grossProfit - totalExp;
    const margin = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;
    return { revenues, costs, expenses, totalRev, totalCost, totalExp, grossProfit, netProfit, margin };
  }, [txs, categories]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Demonstrativo de Resultados (DRE)", 14, 18);
    doc.setFontSize(10);
    doc.text(`Período: ${formatDateBR(range.from)} a ${formatDateBR(range.to)}`, 14, 26);

    const rows: Array<[string, string]> = [];
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
      styles: { fontSize: 9 },
      headStyles: { fillColor: [120, 80, 40] },
      columnStyles: { 1: { halign: "right" } },
    });
    doc.save(`DRE_${range.from}_a_${range.to}.pdf`);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard/financeiro"
            className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-muted/70"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl text-foreground">DRE</h1>
            <p className="text-sm text-muted-foreground">
              Demonstrativo de resultados do período.
            </p>
          </div>
        </div>
        <button
          onClick={exportPDF}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95"
        >
          <FileDown className="h-4 w-4" /> Exportar PDF
        </button>
      </header>

      <PeriodFilter
        preset={preset}
        setPreset={setPreset}
        customFrom={customFrom}
        customTo={customTo}
        setCustomFrom={setCustomFrom}
        setCustomTo={setCustomTo}
      />

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      ) : (
        <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/60">
            <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wide">
              Período
            </p>
            <p className="text-sm font-bold">
              {formatDateBR(range.from)} → {formatDateBR(range.to)}
            </p>
          </div>

          <div className="divide-y divide-border/40">
            <Section title="(+) Receitas" rows={dre.revenues} total={dre.totalRev} totalLabel="Receita Bruta" />
            <Section
              title="(−) Custos"
              rows={dre.costs}
              total={dre.totalCost}
              totalLabel="Total de Custos"
              negative
            />
            <Row label="= Lucro Bruto" value={dre.grossProfit} bold highlight />
            <Section
              title="(−) Despesas Operacionais"
              rows={dre.expenses}
              total={dre.totalExp}
              totalLabel="Total de Despesas"
              negative
            />
            <Row label="= LUCRO LÍQUIDO" value={dre.netProfit} bold highlight big />
            <div className="px-5 py-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Margem líquida</span>
              <span className="font-bold">{dre.margin.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  rows,
  total,
  totalLabel,
  negative,
}: {
  title: string;
  rows: Array<{ name: string; value: number }>;
  total: number;
  totalLabel: string;
  negative?: boolean;
}) {
  return (
    <div className="px-5 py-3">
      <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wide mb-2">
        {title}
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Sem lançamentos</p>
      ) : (
        <div className="space-y-1.5">
          {rows.map((r) => (
            <div key={r.name} className="flex justify-between text-sm">
              <span className="pl-3 text-foreground/80">{r.name}</span>
              <span className={negative ? "text-rose-600" : "text-emerald-600"}>
                {negative ? "−" : ""} {formatBRL(r.value)}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 pt-2 border-t border-border/40 flex justify-between text-sm font-bold">
        <span>{totalLabel}</span>
        <span className={negative ? "text-rose-600" : "text-emerald-600"}>
          {negative ? "−" : ""} {formatBRL(total)}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
  big,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
  big?: boolean;
}) {
  return (
    <div
      className={
        "px-5 py-3 flex justify-between " +
        (highlight ? "bg-muted/40 " : "") +
        (big ? "text-base " : "text-sm ") +
        (bold ? "font-bold " : "")
      }
    >
      <span>{label}</span>
      <span className={value >= 0 ? "text-emerald-600" : "text-rose-600"}>
        {formatBRL(value)}
      </span>
    </div>
  );
}
