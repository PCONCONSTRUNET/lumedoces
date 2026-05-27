import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Clock3,
  Layers3,
  Loader2,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Enums, Tables } from "@/integrations/supabase/types";
import { formatBRL } from "@/lib/finance-utils";
import { formatOrderCode } from "@/lib/order-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard/pedidos")({
  component: PedidosPage,
});

type OrderStatus = Enums<"order_status">;
type FilterKey = OrderStatus | "all";

type OrderRow = Tables<"orders">;
type ItemRow = Tables<"order_items">;
type PaymentMethodRow = Tables<"payment_methods">;

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "paid",
  "cancelled",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  delivered: "Entregue",
  paid: "Pago",
  cancelled: "Cancelado",
};

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 ring-amber-500/25",
  confirmed: "bg-blue-500/15 text-blue-700 ring-blue-500/25",
  preparing: "bg-violet-500/15 text-violet-700 ring-violet-500/25",
  delivered: "bg-cyan-500/15 text-cyan-700 ring-cyan-500/25",
  paid: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25",
  cancelled: "bg-rose-500/15 text-rose-700 ring-rose-500/25",
};

const STATUS_ACTIONS: Array<{ status: OrderStatus; label: string }> = [
  { status: "pending", label: "Pendente" },
  { status: "confirmed", label: "Confirmar" },
  { status: "preparing", label: "Preparar" },
  { status: "delivered", label: "Entregar" },
  { status: "cancelled", label: "Cancelar" },
];

const FILTER_CARDS: Array<{
  key: FilterKey;
  label: string;
  icon: LucideIcon;
  tone: string;
  toneActive: string;
  line: string;
}> = [
  {
    key: "all",
    label: "Todos",
    icon: Layers3,
    tone: "bg-card ring-border/60 text-foreground",
    toneActive: "bg-gradient-to-br from-amber-100 to-orange-100 ring-amber-200 text-amber-900",
    line: "bg-amber-500",
  },
  {
    key: "pending",
    label: "Pendentes",
    icon: Clock3,
    tone: "bg-card ring-border/60 text-foreground",
    toneActive: "bg-gradient-to-br from-amber-100 to-yellow-100 ring-amber-200 text-amber-900",
    line: "bg-amber-500",
  },
  {
    key: "confirmed",
    label: "Confirmados",
    icon: BadgeCheck,
    tone: "bg-card ring-border/60 text-foreground",
    toneActive: "bg-gradient-to-br from-sky-100 to-blue-100 ring-sky-200 text-sky-900",
    line: "bg-blue-500",
  },
  {
    key: "preparing",
    label: "Preparando",
    icon: UtensilsCrossed,
    tone: "bg-card ring-border/60 text-foreground",
    toneActive: "bg-gradient-to-br from-indigo-100 to-slate-100 ring-indigo-200 text-indigo-900",
    line: "bg-indigo-500",
  },
  {
    key: "delivered",
    label: "Entregues",
    icon: Truck,
    tone: "bg-card ring-border/60 text-foreground",
    toneActive: "bg-gradient-to-br from-cyan-100 to-teal-100 ring-cyan-200 text-cyan-900",
    line: "bg-cyan-500",
  },
  {
    key: "paid",
    label: "Pagos",
    icon: CircleDollarSign,
    tone: "bg-card ring-border/60 text-foreground",
    toneActive: "bg-gradient-to-br from-emerald-100 to-green-100 ring-emerald-200 text-emerald-900",
    line: "bg-emerald-500",
  },
  {
    key: "cancelled",
    label: "Cancelados",
    icon: Ban,
    tone: "bg-card ring-border/60 text-foreground",
    toneActive: "bg-gradient-to-br from-rose-100 to-red-100 ring-rose-200 text-rose-900",
    line: "bg-rose-500",
  },
];

function formatDateTimeBR(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PedidosPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<FilterKey>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      const [{ data: ordersData, error: ordersError }, { data: methodsData, error: methodsError }] =
        await Promise.all([
          supabase.from("orders").select("*").order("created_at", { ascending: false }),
          supabase.from("payment_methods").select("*").order("sort_order", { ascending: true }),
        ]);

      if (ordersError || methodsError) {
        if (cancelled) return;
        setError("Nao foi possivel carregar os pedidos.");
        setLoading(false);
        return;
      }

      const orderIds = (ordersData ?? []).map((o) => o.id);
      let itemsData: ItemRow[] = [];

      if (orderIds.length > 0) {
        const { data, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        if (itemsError) {
          if (cancelled) return;
          setError("Nao foi possivel carregar os itens dos pedidos.");
          setLoading(false);
          return;
        }

        itemsData = (data ?? []) as ItemRow[];
      }

      if (cancelled) return;
      setOrders((ordersData ?? []) as OrderRow[]);
      setItems(itemsData);
      setPaymentMethods((methodsData ?? []) as PaymentMethodRow[]);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const paymentMethodNameById = useMemo(
    () => new Map(paymentMethods.map((m) => [m.id, m.name])),
    [paymentMethods],
  );

  const itemsByOrderId = useMemo(() => {
    const map = new Map<string, ItemRow[]>();
    items.forEach((item) => {
      const list = map.get(item.order_id) ?? [];
      list.push(item);
      map.set(item.order_id, list);
    });
    return map;
  }, [items]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const countByStatus = useMemo(() => {
    const counts = new Map<OrderStatus, number>();
    for (const option of STATUS_OPTIONS) counts.set(option, 0);
    orders.forEach((order) => counts.set(order.status, (counts.get(order.status) ?? 0) + 1));
    return counts;
  }, [orders]);

  const updateOrderStatus = async (order: OrderRow, status: OrderStatus) => {
    if (updatingOrderId) return;

    const nextPaidAt =
      status === "paid" ? (order.paid_at ?? new Date().toISOString()) : null;

    setUpdatingOrderId(order.id);
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status,
          paid_at: nextPaidAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)
        .select("*")
        .single();

      if (error) throw error;

      setOrders((current) =>
        current.map((currentOrder) =>
          currentOrder.id === order.id ? (data as OrderRow) : currentOrder,
        ),
      );
      toast.success("Pedido atualizado");
    } catch (err) {
      console.error(err);
      toast.error("Nao foi possivel atualizar o pedido");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleOrderPaid = (order: OrderRow) => {
    const nextStatus: OrderStatus = order.status === "paid" ? "pending" : "paid";
    void updateOrderStatus(order, nextStatus);
  };

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl text-foreground">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Acompanhe os pedidos recebidos.</p>
        </div>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-7">
        {FILTER_CARDS.map((filterCard) => {
          const selected = statusFilter === filterCard.key;
          const count =
            filterCard.key === "all"
              ? orders.length
              : (countByStatus.get(filterCard.key) ?? 0);

          return (
            <button
              key={filterCard.key}
              type="button"
              onClick={() => setStatusFilter(filterCard.key)}
              className={cn(
                "relative min-h-[96px] overflow-hidden rounded-2xl p-3 text-left ring-1 transition",
                selected
                  ? cn(filterCard.toneActive, "shadow-sm")
                  : cn(filterCard.tone, "hover:shadow-sm"),
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-opacity",
                  filterCard.line,
                  selected ? "opacity-100" : "opacity-55",
                )}
              />
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg ring-1",
                    selected
                      ? "bg-white/70 ring-black/5"
                      : "bg-muted text-muted-foreground ring-border/70",
                  )}
                >
                  <filterCard.icon className="h-4 w-4" />
                </span>
                <span className="text-2xl font-bold leading-none">{count}</span>
              </div>
              <p className="mt-3 text-sm font-semibold">{filterCard.label}</p>
              <p className="mt-0.5 text-xs opacity-70">
                {selected ? "Filtro ativo" : "Toque para filtrar"}
              </p>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid place-items-center rounded-2xl bg-card p-10 shadow-sm ring-1 ring-border/60">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">
            Nenhum pedido encontrado para este filtro.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isOpen = expandedOrderId === order.id;
            const detailsItems = itemsByOrderId.get(order.id) ?? [];
            const paymentName = order.payment_method_id
              ? (paymentMethodNameById.get(order.payment_method_id) ?? "Nao informado")
              : "Nao informado";

            return (
              <div
                key={order.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl p-4 ring-1 transition",
                  isOpen
                    ? "bg-[#fff8ed] shadow-lg shadow-brand/10 ring-brand/25"
                    : "border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-white shadow-md shadow-brand/5 ring-orange-100 hover:border-orange-200 hover:shadow-lg hover:shadow-brand/10",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 w-1.5",
                    order.status === "pending" && "bg-amber-400",
                    order.status === "confirmed" && "bg-blue-400",
                    order.status === "preparing" && "bg-indigo-400",
                    order.status === "delivered" && "bg-cyan-400",
                    order.status === "paid" && "bg-emerald-400",
                    order.status === "cancelled" && "bg-rose-400",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setExpandedOrderId(isOpen ? null : order.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 text-left ring-1 ring-white/80"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-bold text-foreground">
                        {order.customer_name || "Cliente sem nome"}
                      </h3>
                      <span
                        className={
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 " +
                          STATUS_BADGE_CLASSES[order.status]
                        }
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatOrderCode(order.id)} | {formatDateTimeBR(order.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <p className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-brand ring-1 ring-orange-100">
                      {formatBRL(order.total)}
                    </p>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-4 rounded-2xl border border-brand/15 bg-white/90 p-4 shadow-inner shadow-brand/5">
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <p>
                        <span className="font-semibold">Telefone:</span>{" "}
                        {order.customer_phone || "Nao informado"}
                      </p>
                      <p>
                        <span className="font-semibold">Pagamento:</span> {paymentName}
                      </p>
                      <p className="sm:col-span-2">
                        <span className="font-semibold">Situacao do pagamento:</span>{" "}
                        {order.status === "paid"
                          ? `Pago em ${formatDateTimeBR(order.paid_at)}`
                          : "Nao pago"}
                      </p>
                      <p className="sm:col-span-2">
                        <span className="font-semibold">Endereco:</span>{" "}
                        {order.customer_address || "Nao informado"}
                      </p>
                      <p className="sm:col-span-2">
                        <span className="font-semibold">Referencia:</span>{" "}
                        {order.address_reference || "Nao informado"}
                      </p>
                      <p className="sm:col-span-2">
                        <span className="font-semibold">Observacoes:</span>{" "}
                        {order.notes || "Sem observacoes"}
                      </p>
                    </div>

                    <div className="grid gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-3 lg:grid-cols-[1fr_auto]">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-brand">
                          Status do pedido
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {STATUS_ACTIONS.map((action) => {
                            const active = order.status === action.status;
                            return (
                              <button
                                key={action.status}
                                type="button"
                                disabled={updatingOrderId === order.id}
                                onClick={() => updateOrderStatus(order, action.status)}
                                className={cn(
                                  "rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition disabled:cursor-wait disabled:opacity-60",
                                  active
                                    ? "bg-brand text-brand-foreground ring-brand"
                                    : "bg-white text-foreground ring-orange-100 hover:bg-orange-100",
                                )}
                              >
                                {action.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          disabled={updatingOrderId === order.id}
                          onClick={() => toggleOrderPaid(order)}
                          className={cn(
                            "inline-flex min-w-36 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 transition disabled:cursor-wait disabled:opacity-60",
                            order.status === "paid"
                              ? "bg-emerald-600 text-white ring-emerald-600 hover:bg-emerald-700"
                              : "bg-white text-emerald-700 ring-emerald-200 hover:bg-emerald-50",
                          )}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {order.status === "paid" ? "Pago" : "Marcar pago"}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-orange-100 bg-orange-50/80 p-3">
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-brand">
                        Itens do pedido
                      </h4>
                      {detailsItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sem itens registrados.</p>
                      ) : (
                        <ul className="space-y-1.5 text-sm">
                          {detailsItems.map((item) => (
                            <li key={item.id} className="flex items-center justify-between gap-3">
                              <span>
                                {item.quantity}x {item.product_name}
                              </span>
                              <span className="font-semibold">{formatBRL(item.total_price)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="grid gap-2 rounded-xl border border-border/70 bg-background p-3 text-sm sm:grid-cols-2">
                      <p>
                        <span className="font-semibold">Subtotal:</span> {formatBRL(order.subtotal)}
                      </p>
                      <p>
                        <span className="font-semibold">Taxa de entrega:</span>{" "}
                        {formatBRL(order.delivery_fee)}
                      </p>
                      <p>
                        <span className="font-semibold">Desconto:</span> {formatBRL(order.discount)}
                      </p>
                      <p className="font-bold text-brand">
                        <span className="font-semibold">Total:</span> {formatBRL(order.total)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
