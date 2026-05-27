import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Trophy,
  Loader2,
} from "lucide-react";
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
import {
  formatBRL,
  formatDateBR,
  periodRange,
  toISODate,
  type PeriodPreset,
} from "@/lib/finance-utils";

export const Route = createFileRoute("/admin/dashboard/visao")({
  component: DashboardVisaoPage,
});

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  delivered: "Entregue",
  paid: "Pago",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#a855f7",
  delivered: "#06b6d4",
  paid: "#10b981",
  cancelled: "#ef4444",
};

type OrderRow = {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  payment_method_id: string | null;
  created_at: string;
};

type ItemRow = {
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  total_price: number;
};

function DashboardVisaoPage() {
  const [preset, setPreset] = useState<PeriodPreset>("30d");
  const [customFrom, setCustomFrom] = useState(toISODate(new Date()));
  const [customTo, setCustomTo] = useState(toISODate(new Date()));
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [methods, setMethods] = useState<Array<{ id: string; name: string }>>([]);

  const range = useMemo(
    () => periodRange(preset, customFrom, customTo),
    [preset, customFrom, customTo],
  );

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const fromISO = `${range.from}T00:00:00`;
      const toISO = `${range.to}T23:59:59`;
      const [{ data: ords }, { data: pms }] = await Promise.all([
        supabase
          .from("orders")
          .select("id, customer_name, total, status, payment_method_id, created_at")
          .gte("created_at", fromISO)
          .lte("created_at", toISO)
          .order("created_at", { ascending: false }),
        supabase.from("payment_methods").select("id, name").order("sort_order"),
      ]);
      const ids = (ords ?? []).map((o) => o.id);
      let its: ItemRow[] = [];
      if (ids.length) {
        const { data: rs } = await supabase
          .from("order_items")
          .select("order_id, product_id, product_name, quantity, total_price")
          .in("order_id", ids);
        its = (rs ?? []) as ItemRow[];
      }
      if (cancel) return;
      setOrders((ords ?? []) as OrderRow[]);
      setItems(its);
      setMethods((pms ?? []) as Array<{ id: string; name: string }>);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [range.from, range.to]);

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.status === "paid");
    const revenue = paid.reduce((s, o) => s + Number(o.total), 0);
    const count = orders.length;
    const avg = paid.length ? revenue / paid.length : 0;
    const today = toISODate(new Date());
    const todayCount = orders.filter((o) => o.created_at.slice(0, 10) === today).length;
    return { revenue, count, avg, todayCount, paidCount: paid.length };
  }, [orders]);

  const byDay = useMemo(() => {
    const map = new Map<string, { day: string; pedidos: number; receita: number }>();
    const from = new Date(range.from);
    const to = new Date(range.to);
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const k = toISODate(d);
      map.set(k, { day: k.slice(5), pedidos: 0, receita: 0 });
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

  const byStatus = useMemo(() => {
    const m = new Map<string, number>();
    orders.forEach((o) => m.set(o.status, (m.get(o.status) ?? 0) + 1));
    return Array.from(m.entries()).map(([k, v]) => ({
      name: STATUS_LABELS[k] ?? k,
      value: v,
      color: STATUS_COLORS[k] ?? "#94a3b8",
    }));
  }, [orders]);

  const byPayment = useMemo(() => {
    const nm = new Map(methods.map((m) => [m.id, m.name]));
    const m = new Map<string, number>();
    orders
      .filter((o) => o.status === "paid")
      .forEach((o) => {
        const k = o.payment_method_id ? nm.get(o.payment_method_id) ?? "Outros" : "Não informado";
        m.set(k, (m.get(k) ?? 0) + Number(o.total));
      });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [orders, methods]);

  const topProducts = useMemo(() => {
    const m = new Map<string, { name: string; qty: number; total: number }>();
    items.forEach((it) => {
      const key = it.product_name || "—";
      const e = m.get(key) ?? { name: key, qty: 0, total: 0 };
      e.qty += it.quantity;
      e.total += Number(it.total_price);
      m.set(key, e);
    });
    return Array.from(m.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [items]);

  const recent = orders.slice(0, 8);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <BarChart3 className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral de pedidos, faturamento e performance.
          </p>
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

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              label="Faturamento"
              value={formatBRL(stats.revenue)}
              accent="emerald"
            />
            <StatCard
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Pedidos no período"
              value={stats.count.toString()}
              sub={`${stats.paidCount} pagos`}
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4" />}
              label="Ticket médio"
              value={formatBRL(stats.avg)}
            />
            <StatCard
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Pedidos hoje"
              value={stats.todayCount.toString()}
              accent="brand"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card title="Pedidos & receita por dia">
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={byDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip
                      cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        color: "var(--foreground)",
                      }}
                      formatter={(v: number, name: string) =>
                        name === "receita" ? formatBRL(v) : v
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pedidos"
                      stroke="var(--brand)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="receita"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Status dos pedidos">
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={byStatus}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label={(e: { name: string; value: number }) => `${e.name}: ${e.value}`}
                    >
                      {byStatus.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      cursor={{ fill: "var(--card)", fillOpacity: 1 }}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Receita por forma de pagamento">
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={byPayment}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip
                      cursor={{ fill: "var(--card)", fillOpacity: 1 }}
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
            </Card>

            <Card title="Top 10 produtos">
              {topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">
                  Nenhuma venda no período.
                </p>
              ) : (
                <ol className="space-y-2">
                  {topProducts.map((p, i) => (
                    <li
                      key={p.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand/10 text-brand text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="truncate">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {p.qty}x
                        </span>
                        <span className="font-bold">{formatBRL(p.total)}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          </div>

          <Card title="Últimos pedidos">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Sem pedidos no período.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="text-left py-2">Data</th>
                      <th className="text-left">Cliente</th>
                      <th className="text-left">Status</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((o) => (
                      <tr key={o.id} className="border-b border-border/40">
                        <td className="py-2">{formatDateBR(o.created_at)}</td>
                        <td>{o.customer_name}</td>
                        <td>
                          <span
                            className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
                            style={{
                              background: `${STATUS_COLORS[o.status]}20`,
                              color: STATUS_COLORS[o.status],
                            }}
                          >
                            {STATUS_LABELS[o.status] ?? o.status}
                          </span>
                        </td>
                        <td className="text-right font-semibold">
                          {formatBRL(o.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export function PeriodFilter({
  preset,
  setPreset,
  customFrom,
  customTo,
  setCustomFrom,
  setCustomTo,
}: {
  preset: PeriodPreset;
  setPreset: (p: PeriodPreset) => void;
  customFrom: string;
  customTo: string;
  setCustomFrom: (s: string) => void;
  setCustomTo: (s: string) => void;
}) {
  const opts: Array<{ k: PeriodPreset; l: string }> = [
    { k: "today", l: "Hoje" },
    { k: "7d", l: "7 dias" },
    { k: "30d", l: "30 dias" },
    { k: "month", l: "Este mês" },
    { k: "custom", l: "Personalizado" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1.5 rounded-full bg-muted p-1">
        {opts.map((o) => (
          <button
            key={o.k}
            onClick={() => setPreset(o.k)}
            className={
              "rounded-full px-3 py-1.5 text-xs font-bold transition " +
              (preset === o.k
                ? "bg-brand text-brand-foreground shadow"
                : "text-foreground/70 hover:text-foreground")
            }
          >
            {o.l}
          </button>
        ))}
      </div>
      {preset === "custom" && (
        <div className="flex items-center gap-2 text-xs">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1.5"
          />
          <span className="text-muted-foreground">até</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1.5"
          />
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "brand" | "emerald";
}) {
  const accentClass =
    accent === "emerald"
      ? "bg-emerald-500/10 text-emerald-600"
      : accent === "brand"
        ? "bg-brand/10 text-brand"
        : "bg-muted text-foreground/70";
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-full ${accentClass}`}>
          {icon}
        </span>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="h-3.5 w-3.5 text-brand opacity-0" />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}
