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
import { cn } from "@/lib/utils";

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
      try {
        const isoFrom = range.from + "T00:00:00.000Z";
        const isoTo = range.to + "T23:59:59.999Z";

        const [ordersRes, itemsRes, pmRes] = await Promise.all([
          supabase
            .from("orders")
            .select("id, customer_name, total, status, payment_method_id, created_at")
            .gte("created_at", isoFrom)
            .lte("created_at", isoTo),
          supabase.from("order_items").select("order_id, product_id, product_name, quantity, total_price"),
          supabase.from("payment_methods").select("id, name"),
        ]);

        if (cancel) return;

        if (ordersRes.data) setOrders(ordersRes.data as any[]);
        if (itemsRes.data) setItems(itemsRes.data as any[]);
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

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Sales Chart (takes 2 columns on large screens) */}
            <div className="xl:col-span-2 space-y-6">
              <Card title="Faturamento por dia" className="border-none shadow-xl shadow-brand/5 bg-white/70 backdrop-blur-sm">
                <div className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={byDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip
                        cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                        contentStyle={{
                          background: "#fff",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          color: "var(--foreground)",
                          fontWeight: 500,
                        }}
                        formatter={(v: number, name: string) => [formatBRL(v), "Receita"]}
                        labelStyle={{ color: "var(--muted-foreground)", marginBottom: "4px" }}
                      />
                      <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Status and Payment split into two simple cards side by side */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card title="Formas de Pagamento" className="border-none shadow-xl shadow-brand/5 bg-white/70 backdrop-blur-sm">
                  <div className="space-y-4 pt-2">
                    {byPayment.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Sem dados</p>}
                    {byPayment.map(p => {
                      const totalRevenue = byPayment.reduce((acc, curr) => acc + curr.value, 0);
                      const pct = totalRevenue > 0 ? (p.value / totalRevenue) * 100 : 0;
                      return (
                        <div key={p.name} className="space-y-1.5">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-foreground/80">{p.name}</span>
                            <span className="font-bold">{formatBRL(p.value)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card title="Status dos Pedidos" className="border-none shadow-xl shadow-brand/5 bg-white/70 backdrop-blur-sm">
                  <div className="space-y-4 pt-2">
                    {byStatus.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Sem dados</p>}
                    {byStatus.map(s => {
                      const totalOrders = byStatus.reduce((acc, curr) => acc + curr.value, 0);
                      const pct = totalOrders > 0 ? (s.value / totalOrders) * 100 : 0;
                      return (
                        <div key={s.name} className="space-y-1.5">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-foreground/80">{s.name}</span>
                            <span className="font-bold text-muted-foreground">{s.value} ped.</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>

            {/* Top Products (takes 1 column) */}
            <div className="xl:col-span-1 space-y-6">
              <Card title="Mais Vendidos" className="border-none shadow-xl shadow-brand/5 bg-gradient-to-br from-brand/5 to-transparent h-full">
                {topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-10 text-center">Nenhuma venda no período.</p>
                ) : (
                  <ol className="space-y-3 pt-2">
                    {topProducts.map((p, i) => (
                      <li key={p.name} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/60 hover:bg-white transition-colors shadow-sm ring-1 ring-white/60">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={cn(
                            "grid h-8 w-8 place-items-center rounded-xl text-xs font-black shrink-0 shadow-sm",
                            i === 0 ? "bg-amber-400 text-amber-950" :
                            i === 1 ? "bg-slate-300 text-slate-800" :
                            i === 2 ? "bg-amber-700/40 text-amber-950" : "bg-muted text-muted-foreground"
                          )}>
                            {i + 1}
                          </span>
                          <div className="flex flex-col truncate">
                            <span className="truncate font-semibold text-foreground/90 text-sm">{p.name}</span>
                            <span className="text-xs text-muted-foreground">{p.qty} unidades</span>
                          </div>
                        </div>
                        <div className="shrink-0 font-bold text-sm text-emerald-600">
                          {formatBRL(p.total)}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </Card>
            </div>
          </div>
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
      ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-200"
      : accent === "brand"
        ? "bg-gradient-to-br from-brand to-brand-foreground text-white shadow-brand/20"
        : "bg-white text-brand shadow-orange-100 ring-1 ring-border/50";
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-xl shadow-brand/5 border border-border/40 transition hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <span className={cn("grid h-10 w-10 place-items-center rounded-2xl shadow-lg", accentClass)}>
          {icon}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
        {sub && <p className="text-xs font-semibold text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl bg-white p-6 shadow-sm border border-border/40", className)}>
      <h3 className="text-lg font-black text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}
