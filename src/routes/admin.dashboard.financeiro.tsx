import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  Scale,
  Loader2,
  Pencil,
  Trash2,
  FileText,
  FileDown,
  Save,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  formatBRL,
  formatDateBR,
  periodRange,
  toISODate,
  toCSV,
  downloadBlob,
  type PeriodPreset,
} from "@/lib/finance-utils";
import { PeriodFilter } from "./admin.dashboard.visao";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const Route = createFileRoute("/admin/dashboard/financeiro")({
  component: FinanceiroPage,
});

type Category = {
  id: string;
  name: string;
  kind: "revenue" | "expense";
  dre_group: "revenue" | "cost" | "expense";
  color: string;
};
type PayMethod = { id: string; name: string };
type Tx = {
  id: string;
  kind: "revenue" | "expense";
  status: "paid" | "pending";
  amount: number;
  description: string;
  occurred_at: string;
  category_id: string | null;
  payment_method_id: string | null;
  order_id: string | null;
  is_auto: boolean;
};

function FinanceiroPage() {
  const [preset, setPreset] = useState<PeriodPreset>("30d");
  const [customFrom, setCustomFrom] = useState(toISODate(new Date()));
  const [customTo, setCustomTo] = useState(toISODate(new Date()));
  const [kindFilter, setKindFilter] = useState<"" | "revenue" | "expense">("");
  const [statusFilter, setStatusFilter] = useState<"" | "paid" | "pending">("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [pmFilter, setPmFilter] = useState<string>("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [methods, setMethods] = useState<PayMethod[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tx | null>(null);

  const range = useMemo(
    () => periodRange(preset, customFrom, customTo),
    [preset, customFrom, customTo],
  );

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("finance_transactions")
      .select("*")
      .gte("occurred_at", range.from)
      .lte("occurred_at", range.to)
      .order("occurred_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (kindFilter) q = q.eq("kind", kindFilter);
    if (statusFilter) q = q.eq("status", statusFilter);
    if (catFilter) q = q.eq("category_id", catFilter);
    if (pmFilter) q = q.eq("payment_method_id", pmFilter);
    const { data, error } = await q;
    if (error) {
      toast.error("Erro ao carregar lançamentos: " + error.message);
    } else {
      setTxs((data ?? []) as Tx[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: pms }] = await Promise.all([
        supabase.from("finance_categories").select("*").order("sort_order"),
        supabase.from("payment_methods").select("id, name").order("sort_order"),
      ]);
      setCategories((cats ?? []) as Category[]);
      setMethods((pms ?? []) as PayMethod[]);
    })();
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.from, range.to, kindFilter, statusFilter, catFilter, pmFilter]);

  const stats = useMemo(() => {
    const paid = txs.filter((t) => t.status === "paid");
    const revenue = paid.filter((t) => t.kind === "revenue").reduce((s, t) => s + Number(t.amount), 0);
    const expense = paid.filter((t) => t.kind === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const pending = txs
      .filter((t) => t.status === "pending")
      .reduce((s, t) => s + (t.kind === "revenue" ? Number(t.amount) : -Number(t.amount)), 0);
    return { revenue, expense, profit: revenue - expense, pending };
  }, [txs]);

  const byDay = useMemo(() => {
    const map = new Map<string, { day: string; receita: number; despesa: number }>();
    const from = new Date(range.from);
    const to = new Date(range.to);
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const k = toISODate(d);
      map.set(k, { day: k.slice(5), receita: 0, despesa: 0 });
    }
    txs
      .filter((t) => t.status === "paid")
      .forEach((t) => {
        const e = map.get(t.occurred_at.slice(0, 10));
        if (e) {
          if (t.kind === "revenue") e.receita += Number(t.amount);
          else e.despesa += Number(t.amount);
        }
      });
    return Array.from(map.values());
  }, [txs, range.from, range.to]);

  const byCategory = useMemo(() => {
    const m = new Map<string, { name: string; value: number; color: string }>();
    txs
      .filter((t) => t.status === "paid" && t.kind === "expense")
      .forEach((t) => {
        const cat = categories.find((c) => c.id === t.category_id);
        const key = cat?.name ?? "Sem categoria";
        const e = m.get(key) ?? { name: key, value: 0, color: cat?.color ?? "#94a3b8" };
        e.value += Number(t.amount);
        m.set(key, e);
      });
    return Array.from(m.values());
  }, [txs, categories]);

  const byPayment = useMemo(() => {
    const nm = new Map(methods.map((m) => [m.id, m.name]));
    const m = new Map<string, number>();
    txs
      .filter((t) => t.status === "paid" && t.kind === "revenue")
      .forEach((t) => {
        const key = t.payment_method_id ? nm.get(t.payment_method_id) ?? "Outros" : "Não informado";
        m.set(key, (m.get(key) ?? 0) + Number(t.amount));
      });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [txs, methods]);

  const exportCSV = () => {
    const rows = txs.map((t) => ({
      Data: formatDateBR(t.occurred_at),
      Tipo: t.kind === "revenue" ? "Receita" : "Despesa",
      Status: t.status === "paid" ? "Pago" : "Pendente",
      Descrição: t.description,
      Categoria: categories.find((c) => c.id === t.category_id)?.name ?? "",
      Pagamento: methods.find((m) => m.id === t.payment_method_id)?.name ?? "",
      Valor: Number(t.amount).toFixed(2).replace(".", ","),
    }));
    downloadBlob(toCSV(rows), `financeiro_${range.from}_a_${range.to}.csv`, "text/csv;charset=utf-8");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Relatório Financeiro", 14, 18);
    doc.setFontSize(10);
    doc.text(`Período: ${formatDateBR(range.from)} a ${formatDateBR(range.to)}`, 14, 26);
    doc.text(
      `Receitas: ${formatBRL(stats.revenue)}   Despesas: ${formatBRL(stats.expense)}   Lucro: ${formatBRL(stats.profit)}`,
      14,
      32,
    );
    autoTable(doc, {
      startY: 38,
      head: [["Data", "Tipo", "Status", "Descrição", "Categoria", "Pagamento", "Valor"]],
      body: txs.map((t) => [
        formatDateBR(t.occurred_at),
        t.kind === "revenue" ? "Receita" : "Despesa",
        t.status === "paid" ? "Pago" : "Pendente",
        t.description,
        categories.find((c) => c.id === t.category_id)?.name ?? "",
        methods.find((m) => m.id === t.payment_method_id)?.name ?? "",
        formatBRL(t.amount),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [120, 80, 40] },
    });
    doc.save(`financeiro_${range.from}_a_${range.to}.pdf`);
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este lançamento?")) return;
    const { error } = await supabase.from("finance_transactions").delete().eq("id", id);
    if (error) toast.error("Erro: " + error.message);
    else {
      toast.success("Lançamento excluído");
      load();
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl text-foreground">Financeiro</h1>
            <p className="text-sm text-muted-foreground">
              Lançamentos, fluxo de caixa e DRE.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/dashboard/financeiro/dre"
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/70 transition"
          >
            <FileText className="h-4 w-4" /> DRE
          </Link>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/70 transition"
          >
            <FileDown className="h-4 w-4" /> CSV
          </button>
          <button
            onClick={exportPDF}
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold hover:bg-muted/70 transition"
          >
            <FileDown className="h-4 w-4" /> PDF
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" /> Novo lançamento
          </button>
        </div>
      </header>

      <PeriodFilter
        preset={preset}
        setPreset={setPreset}
        customFrom={customFrom}
        customTo={customTo}
        setCustomFrom={setCustomFrom}
        setCustomTo={setCustomTo}
      />

      <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border/60 px-3 py-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Filtros
          </span>
          <Select value={kindFilter} onChange={setKindFilter} label="Tipo" compact>
            <option value="">Todos</option>
            <option value="revenue">Receita</option>
            <option value="expense">Despesa</option>
          </Select>
          <Select value={statusFilter} onChange={setStatusFilter} label="Status" compact>
            <option value="">Todos</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
          </Select>
          <Select value={catFilter} onChange={setCatFilter} label="Categoria" compact>
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select value={pmFilter} onChange={setPmFilter} label="Pagamento" compact>
            <option value="">Todos</option>
            {methods.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
          {(kindFilter || statusFilter || catFilter || pmFilter) && (
            <button
              type="button"
              onClick={() => {
                setKindFilter("");
                setStatusFilter("");
                setCatFilter("");
                setPmFilter("");
              }}
              className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat
          icon={<TrendingUp className="h-4 w-4" />}
          label="Receitas"
          value={formatBRL(stats.revenue)}
          color="emerald"
        />
        <Stat
          icon={<TrendingDown className="h-4 w-4" />}
          label="Despesas"
          value={formatBRL(stats.expense)}
          color="rose"
        />
        <Stat
          icon={<Scale className="h-4 w-4" />}
          label="Lucro / Saldo"
          value={formatBRL(stats.profit)}
          color={stats.profit >= 0 ? "emerald" : "rose"}
        />
        <Stat
          icon={<Wallet className="h-4 w-4" />}
          label="Pendente"
          value={formatBRL(stats.pending)}
          color="amber"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Receita × Despesa por dia">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  formatter={(v: number) => formatBRL(v)}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Despesas por categoria">
          {byCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">Sem despesas no período.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label={(e: { name: string }) => e.name}
                  >
                    {byCategory.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => formatBRL(v)}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Receita por forma de pagamento">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={byPayment}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  formatter={(v: number) => formatBRL(v)}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" fill="var(--brand)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

      <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
          <h3 className="text-sm font-bold">Movimentações ({txs.length})</h3>
        </div>
        {loading ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : txs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            Nenhum lançamento no período.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="text-left px-4 py-2">Data</th>
                  <th className="text-left">Descrição</th>
                  <th className="text-left">Categoria</th>
                  <th className="text-left">Pagamento</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Valor</th>
                  <th className="text-right px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => (
                  <tr key={t.id} className="border-b border-border/40 hover:bg-muted/30">
                    <td className="px-4 py-2 whitespace-nowrap">{formatDateBR(t.occurred_at)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{t.description}</span>
                        {t.is_auto && (
                          <span className="text-[10px] uppercase rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                            auto
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{categories.find((c) => c.id === t.category_id)?.name ?? "—"}</td>
                    <td>{methods.find((m) => m.id === t.payment_method_id)?.name ?? "—"}</td>
                    <td>
                      <span
                        className={
                          "inline-block rounded-full px-2 py-0.5 text-xs font-semibold " +
                          (t.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600")
                        }
                      >
                        {t.status === "paid" ? "Pago" : "Pendente"}
                      </span>
                    </td>
                    <td
                      className={
                        "text-right font-bold whitespace-nowrap " +
                        (t.kind === "revenue" ? "text-emerald-600" : "text-rose-600")
                      }
                    >
                      {t.kind === "revenue" ? "+" : "-"} {formatBRL(t.amount)}
                    </td>
                    <td className="text-right px-4">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => {
                            setEditing(t);
                            setModalOpen(true);
                          }}
                          disabled={t.is_auto}
                          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted disabled:opacity-30"
                          title={t.is_auto ? "Lançamento automático" : "Editar"}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(t.id)}
                          disabled={t.is_auto}
                          className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30"
                          title={t.is_auto ? "Lançamento automático" : "Excluir"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TxModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        categories={categories}
        methods={methods}
        onSaved={load}
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "emerald" | "rose" | "amber";
}) {
  const cls = {
    emerald: "bg-emerald-500/10 text-emerald-600",
    rose: "bg-rose-500/10 text-rose-600",
    amber: "bg-amber-500/10 text-amber-600",
  }[color];
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-full ${cls}`}>{icon}</span>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
      <h3 className="text-sm font-bold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Select<T extends string>({
  value,
  onChange,
  label,
  children,
}: {
  value: T;
  onChange: (v: T) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
      >
        {children}
      </select>
    </label>
  );
}

function TxModal({
  open,
  onOpenChange,
  editing,
  categories,
  methods,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Tx | null;
  categories: Category[];
  methods: PayMethod[];
  onSaved: () => void;
}) {
  const [kind, setKind] = useState<"revenue" | "expense">("expense");
  const [status, setStatus] = useState<"paid" | "pending">("paid");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [occurredAt, setOccurredAt] = useState(toISODate(new Date()));
  const [categoryId, setCategoryId] = useState("");
  const [pmId, setPmId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setKind(editing.kind);
      setStatus(editing.status);
      setAmount(String(editing.amount).replace(".", ","));
      setDescription(editing.description);
      setOccurredAt(editing.occurred_at);
      setCategoryId(editing.category_id ?? "");
      setPmId(editing.payment_method_id ?? "");
    } else {
      setKind("expense");
      setStatus("paid");
      setAmount("");
      setDescription("");
      setOccurredAt(toISODate(new Date()));
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
    const payload = {
      kind,
      status,
      amount: value,
      description: description.trim(),
      occurred_at: occurredAt,
      category_id: categoryId || null,
      payment_method_id: pmId || null,
    };
    const { error } = editing
      ? await supabase.from("finance_transactions").update(payload).eq("id", editing.id)
      : await supabase.from("finance_transactions").insert(payload);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg p-4 sm:p-6 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar lançamento" : "Novo lançamento"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setKind("revenue");
                setCategoryId("");
              }}
              className={
                "rounded-xl py-2.5 text-sm font-bold transition border-2 " +
                (kind === "revenue"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                  : "border-border bg-background text-muted-foreground")
              }
            >
              <TrendingUp className="inline h-4 w-4 mr-1" /> Receita
            </button>
            <button
              type="button"
              onClick={() => {
                setKind("expense");
                setCategoryId("");
              }}
              className={
                "rounded-xl py-2.5 text-sm font-bold transition border-2 " +
                (kind === "expense"
                  ? "border-rose-500 bg-rose-500/10 text-rose-600"
                  : "border-border bg-background text-muted-foreground")
              }
            >
              <TrendingDown className="inline h-4 w-4 mr-1" /> Despesa
            </button>
          </div>

          <Lbl label="Descrição*">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className="ipt"
              placeholder="Ex: Compra de farinha"
              autoFocus
            />
          </Lbl>

          <div className="grid grid-cols-2 gap-2">
            <Lbl label="Valor (R$)*">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="ipt"
                placeholder="0,00"
              />
            </Lbl>
            <Lbl label="Data*">
              <input
                type="date"
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
                className="ipt"
              />
            </Lbl>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Lbl label="Categoria">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="ipt"
              >
                <option value="">Sem categoria</option>
                {availableCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Lbl>
            <Lbl label="Forma de pagamento">
              <select value={pmId} onChange={(e) => setPmId(e.target.value)} className="ipt">
                <option value="">Não informado</option>
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Lbl>
          </div>

          <Lbl label="Status">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("paid")}
                className={
                  "rounded-lg py-2 text-sm font-bold border-2 " +
                  (status === "paid"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                    : "border-border bg-background text-muted-foreground")
                }
              >
                Pago
              </button>
              <button
                type="button"
                onClick={() => setStatus("pending")}
                className={
                  "rounded-lg py-2 text-sm font-bold border-2 " +
                  (status === "pending"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600"
                    : "border-border bg-background text-muted-foreground")
                }
              >
                Pendente
              </button>
            </div>
          </Lbl>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm font-bold hover:bg-muted/70"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </button>
        </DialogFooter>

        <style>{`
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
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

function Lbl({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}
