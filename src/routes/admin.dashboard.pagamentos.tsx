import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  CreditCard,
  Download,
  Loader2,
  ReceiptText,
  RotateCcw,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatBRL, formatDateBR } from "@/lib/finance-utils";
import { formatOrderCode } from "@/lib/order-utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import jsPDF from "jspdf";
import logoImage from "@/assets/logo_lume.png";
import { useConfirm } from "@/providers/ConfirmProvider";

export const Route = createFileRoute("/admin/dashboard/pagamentos")({
  component: PagamentosPage,
});

type FinanceTransaction = Tables<"finance_transactions">;
type OrderRow = Tables<"orders">;
type PaymentMethodRow = Tables<"payment_methods">;

type PaymentRow = {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone?: string | null;
  amount: number;
  status: PaymentStatus;
  occurredAt: string;
  paymentMethod: string;
  source: "finance" | "order";
};

type PeriodFilter = "all" | "today" | "week" | "month";
type StatusFilter = "all" | PaymentStatus;
type PaymentStatus = "paid" | "pending" | "cancelled" | "refunded";
type FinanceTransactionStatus = "paid" | "pending";

const PERIOD_FILTERS: Array<{ key: PeriodFilter; label: string }> = [
  { key: "all", label: "Todos" },
  { key: "today", label: "Hoje" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
];

const STATUS_FILTERS: Array<{ key: StatusFilter; label: string; icon: LucideIcon }> = [
  { key: "all", label: "Todos", icon: ReceiptText },
  { key: "pending", label: "Pendente", icon: Clock3 },
  { key: "paid", label: "Pago", icon: CheckCircle2 },
  { key: "cancelled", label: "Cancelado", icon: Ban },
  { key: "refunded", label: "Reembolsado", icon: RotateCcw },
];

function statusLabel(status: PaymentRow["status"]) {
  if (status === "paid") return "Pago";
  if (status === "cancelled") return "Cancelado";
  if (status === "refunded") return "Reembolsado";
  return "Pendente";
}

function statusIcon(status: PaymentStatus) {
  if (status === "paid") return CheckCircle2;
  if (status === "cancelled") return Ban;
  if (status === "refunded") return RotateCcw;
  return Clock3;
}

function formatDateTimeBR(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClasses(status: PaymentStatus) {
  if (status === "paid") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (status === "refunded") return "bg-sky-50 text-sky-700 ring-sky-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function cardClasses(status: PaymentStatus) {
  if (status === "paid") return "border-emerald-200 shadow-emerald-900/5 ring-emerald-100";
  if (status === "cancelled") return "border-rose-200 shadow-rose-900/5 ring-rose-100";
  if (status === "refunded") return "border-sky-200 shadow-sky-900/5 ring-sky-100";
  return "border-amber-200 shadow-amber-900/5 ring-amber-100";
}

function sideBarClass(status: PaymentStatus) {
  if (status === "paid") return "bg-emerald-500";
  if (status === "cancelled") return "bg-rose-500";
  if (status === "refunded") return "bg-sky-500";
  return "bg-amber-500";
}

function paymentStatusFromOrder(order: OrderRow | undefined, fallback: "paid" | "pending") {
  if (order?.status === "cancelled") return "cancelled";
  return fallback;
}

function isWithinPeriod(value: string, period: PeriodFilter) {
  if (period === "all") return true;

  const date = new Date(value);
  const now = new Date();
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
  const { confirm } = useConfirm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRow[]>([]);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [ordersRes, pmRes] = await Promise.all([
          supabase.from("orders").select("*"),
          supabase.from("payment_methods").select("*"),
        ]);
        
        if (ordersRes.error) throw ordersRes.error;
        if (pmRes.error) throw pmRes.error;

        if (cancelled) return;
        setTransactions([]);
        setOrders(ordersRes.data as any[]);
        setPaymentMethods(pmRes.data as any[]);
      } catch (err: any) {
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


  const paymentMethodNameById = useMemo(
    () => new Map(paymentMethods.map((method) => [method.id, method.name])),
    [paymentMethods],
  );

  const orderById = useMemo(() => new Map(orders.map((order) => [order.id, order])), [orders]);

  const payments = useMemo(() => {
    const rows: PaymentRow[] = transactions.map((transaction) => {
      const order = transaction.order_id ? orderById.get(transaction.order_id) : undefined;
      return {
        id: transaction.id,
        orderId: transaction.order_id ?? "",
        customerName: order?.customer_name ?? transaction.description,
        customerPhone: order?.customer_phone,
        amount: transaction.amount,
        status: paymentStatusFromOrder(order, transaction.status as "paid" | "pending") as "paid" | "pending",
        occurredAt: transaction.occurred_at,
        paymentMethod: transaction.payment_method_id
          ? (paymentMethodNameById.get(transaction.payment_method_id) ?? "Nao informado")
          : "Nao informado",
        source: "finance",
      };
    });

    const transactionOrderIds = new Set(
      transactions
        .map((transaction) => transaction.order_id)
        .filter((orderId): orderId is string => Boolean(orderId)),
    );

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
        paymentMethod: order.payment_method_id
          ? (paymentMethodNameById.get(order.payment_method_id) ?? "Nao informado")
          : "Nao informado",
        source: "order",
      });
    }

    return rows.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [orderById, orders, paymentMethodNameById, transactions]);

  const periodPayments = useMemo(
    () => payments.filter((payment) => isWithinPeriod(payment.occurredAt, periodFilter)),
    [payments, periodFilter],
  );

  const filteredPayments = useMemo(
    () =>
      periodPayments.filter((payment) =>
        statusFilter === "all" ? true : payment.status === statusFilter,
      ),
    [periodPayments, statusFilter],
  );

  const countByStatus = useMemo(() => {
    const counts = new Map<StatusFilter, number>([
      ["all", periodPayments.length],
      ["pending", 0],
      ["paid", 0],
      ["cancelled", 0],
      ["refunded", 0],
    ]);

    periodPayments.forEach((payment) => {
      counts.set(payment.status, (counts.get(payment.status) ?? 0) + 1);
    });

    return counts;
  }, [periodPayments]);

  const totals = useMemo(
    () => ({
      paid: periodPayments
        .filter((payment) => payment.status === "paid")
        .reduce((sum, payment) => sum + payment.amount, 0),
      pending: periodPayments
        .filter((payment) => payment.status === "pending")
        .reduce((sum, payment) => sum + payment.amount, 0),
    }),
    [periodPayments],
  );

  const updatePaymentStatus = async (id: string, newStatus: PaymentStatus) => {
    if (id.startsWith('order-')) {
      toast.error('Este pagamento é derivado de um pedido. Altere o status no próprio pedido.');
      return;
    }
    try {
      const { error } = await supabase.from('finance_transactions').update({ status: newStatus as any }).eq('id', id);
      if (error) throw error;
      setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, status: newStatus as any } : tx)));
      toast.success('Status atualizado!');
    } catch (err: any) {
      toast.error('Erro ao atualizar: ' + err.message);
    }
  };

  const deletePayment = async (id: string) => {
    if (id.startsWith('order-')) {
      toast.error('Este pagamento é derivado de um pedido. Cancele o pedido na aba Pedidos.');
      return;
    }
    if (await confirm('Tem certeza que deseja excluir este pagamento?')) {
      try {
        const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
        if (error) throw error;
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        toast.success('Pagamento excluído com sucesso!');
      } catch (err: any) {
        toast.error('Erro ao excluir: ' + err.message);
      }
    }
  };

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <CreditCard className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl text-foreground">Pagamentos</h1>
          <p className="text-sm text-muted-foreground">Historico e status dos pagamentos.</p>
        </div>
      </header>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <SummaryCard
          icon={ReceiptText}
          label="Pagamentos"
          value={String(periodPayments.length)}
          tone="bg-orange-50 text-brand ring-orange-100"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Recebido"
          value={formatBRL(totals.paid)}
          tone="bg-emerald-50 text-emerald-700 ring-emerald-100"
        />
        <SummaryCard
          icon={Clock3}
          label="Pendente"
          value={formatBRL(totals.pending)}
          tone="bg-amber-50 text-amber-700 ring-amber-100"
        />
      </div>

      <div className="mb-4 space-y-3 rounded-2xl border border-orange-100 bg-white p-3 shadow-sm ring-1 ring-orange-50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Periodo
          </span>
          {PERIOD_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setPeriodFilter(filter.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition",
                periodFilter === filter.key
                  ? "bg-brand text-brand-foreground ring-brand"
                  : "bg-orange-50 text-brand ring-orange-100 hover:bg-orange-100",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <ReceiptText className="h-4 w-4" />
            Status
          </span>
          {STATUS_FILTERS.map((filter) => {
            const active = statusFilter === filter.key;
            const Icon = filter.icon;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setStatusFilter(filter.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition",
                  active
                    ? "bg-brand text-brand-foreground ring-brand"
                    : "bg-white text-foreground ring-orange-100 hover:bg-orange-50",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    active ? "bg-white/20" : "bg-orange-50 text-brand",
                  )}
                >
                  {countByStatus.get(filter.key) ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center rounded-2xl bg-card p-10 shadow-sm ring-1 ring-border/60">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">
            Nenhum pagamento encontrado para este filtro.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              expanded={expandedPaymentId === payment.id}
              onToggle={() =>
                setExpandedPaymentId(expandedPaymentId === payment.id ? null : payment.id)
              }
              onStatusChange={(status) => updatePaymentStatus(payment.id, status)}
              onDelete={() => deletePayment(payment.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentCard({
  payment,
  expanded,
  onToggle,
  onStatusChange,
  onDelete,
}: {
  payment: PaymentRow;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: PaymentStatus) => void;
  onDelete: () => void;
}) {
  const StatusIcon = statusIcon(payment.status);

  const generateReceipt = async () => {
    try {
      const doc = new jsPDF();
      const W = 210;
      const BRAND: [number,number,number]     = [106, 13, 21];
      const HIGHLIGHT: [number,number,number] = [222, 27, 35];
      const CREAM: [number,number,number]     = [252, 244, 235];
      const GRAY: [number,number,number]      = [80, 80, 80];
      const LGRAY: [number,number,number]     = [160, 160, 160];
      const WHITE: [number,number,number]     = [255, 255, 255];

      try {
        const b64 = await new Promise<string>(async (resolve, reject) => {
          try {
            const r = await fetch(logoImage);
            const blob = await r.blob();
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          } catch (e) { reject(e); }
        });
        doc.addImage(b64, "PNG", 12, 8, 55, 18);
      } catch (_) { /* skip */ }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...BRAND);
      doc.text("COMPROVANTE", W - 12, 15, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text("DE PAGAMENTO", W - 12, 21, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...BRAND);
      const titleText = payment.orderId 
        ? `Pagamento de Pedido ${formatOrderCode(payment.orderId)}` 
        : `Pagamento #${payment.id.slice(0, 8)}`;
      doc.text(titleText, W - 12, 29, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...LGRAY);
      doc.text(formatDateTimeBR(payment.occurredAt), W - 12, 35.5, { align: "right" });

      const sLabel = statusLabel(payment.status);
      const sBg: Record<string,[number,number,number]> = {
        pending:   [245,158,11],
        paid:      [16,185,129],
        cancelled: [239,68,68],
        refunded:  [14,165,233],
      };
      const bC = sBg[payment.status] ?? [100,100,100] as [number,number,number];
      doc.setFillColor(...bC);
      doc.roundedRect(12, 44, 38, 7, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      doc.text(sLabel.toUpperCase(), 31, 49, { align: "center" });

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

      const pBadgeBg: [number,number,number] = payment.status === "paid" ? [16,185,129] : [245,158,11];
      const pBadgeW = payment.status === "paid" ? 22 : 30;
      doc.setFillColor(...pBadgeBg);
      doc.roundedRect(115, cTop + 18, pBadgeW, 7, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      doc.text(payment.status === "paid" ? "PAGO" : "PENDENTE", 115 + pBadgeW / 2, cTop + 23, { align: "center" });
      
      let ty = cTop + cH + 15;
      doc.setFillColor(...BRAND);
      doc.rect(118, ty - 1, 80, 9, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...WHITE);
      doc.text("TOTAL PAGO", 164, ty + 5.5, { align: "right" });
      doc.text(formatBRL(payment.amount), 194, ty + 5.5, { align: "right" });

      const pageH = doc.internal.pageSize.getHeight();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...BRAND);
      doc.text("Lume Artesanais", W / 2, pageH - 10, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      doc.text("Obrigada por fazer parte desse momento!", W / 2, pageH - 5, { align: "center" });

      const safeId = payment.orderId ? formatOrderCode(payment.orderId).replace("#", "") : payment.id.slice(0, 8);
      doc.save(`Comprovante_Pedido_${safeId}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar o PDF");
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 bg-gradient-to-r from-orange-50 via-white to-white p-4 shadow-md ring-1 transition",
        cardClasses(payment.status),
      )}
    >
      <span
        aria-hidden
        className={cn("absolute inset-y-0 left-0 w-1.5", sideBarClass(payment.status))}
      />
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-white/75 px-3 py-2 text-left ring-1 ring-white/90"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">{payment.customerName}</h3>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold ring-1",
                statusClasses(payment.status),
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {statusLabel(payment.status)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Pedido {formatOrderCode(payment.orderId)} | {formatDateBR(payment.occurredAt)} |{" "}
            {payment.paymentMethod}
          </p>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-lg font-extrabold text-brand">{formatBRL(payment.amount)}</p>
            {payment.source === "order" && (
              <p className="text-xs text-amber-700">Aguardando sync financeiro</p>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-4 rounded-xl border border-orange-100 bg-white/90 p-4 shadow-inner shadow-brand/5">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p>
              <span className="font-semibold">Status:</span> {statusLabel(payment.status)}
            </p>
            <p>
              <span className="font-semibold">Valor:</span> {formatBRL(payment.amount)}
            </p>
            <p>
              <span className="font-semibold">Data e horario:</span>{" "}
              {formatDateTimeBR(payment.occurredAt)}
            </p>
            <p>
              <span className="font-semibold">Metodo:</span> {payment.paymentMethod}
            </p>
            <p>
              <span className="font-semibold">Pedido:</span> {formatOrderCode(payment.orderId)}
            </p>
            <p>
              <span className="font-semibold">Origem:</span>{" "}
              {payment.source === "finance" ? "Financeiro" : "Pedido"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
            <span className="text-sm font-semibold text-muted-foreground">Alterar para:</span>
            {STATUS_FILTERS.filter(f => f.key !== "all").map((f) => {
              const Icon = f.icon;
              const isActive = payment.status === f.key;
              if (isActive) return null;
              
              return (
                <button
                  key={f.key}
                  onClick={() => onStatusChange(f.key as PaymentStatus)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ring-1 transition hover:bg-black/5",
                    f.key === "paid" && "ring-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100",
                    f.key === "pending" && "ring-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100",
                    f.key === "cancelled" && "ring-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100",
                    f.key === "refunded" && "ring-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {f.label}
                </button>
              );
            })}
            
            {/* Actions pushed to the right */}
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button
                onClick={generateReceipt}
                className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-50"
              >
                <Download className="h-3.5 w-3.5" />
                Comprovante
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border/60">
      <div className="flex items-center justify-between gap-3">
        <span className={cn("grid h-10 w-10 place-items-center rounded-full ring-1", tone)}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-right text-xl font-extrabold text-foreground">{value}</p>
      </div>
      <p className="mt-3 text-sm font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
