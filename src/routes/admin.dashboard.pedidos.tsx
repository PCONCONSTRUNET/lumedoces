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
  Download,
  Layers3,
  Loader2,
  ShoppingBag,
  Trash2,
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImage from "@/assets/logo_vinho.png";

export const Route = createFileRoute("/admin/dashboard/pedidos")({
  component: PedidosPage,
});

type OrderStatus = Enums<"order_status">;
type FilterKey = OrderStatus | "all";

type OrderRow = Tables<"orders"> & {
  address_reference?: string | null;
  coupon_id?: string | null;
  coupon_code?: string | null;
};
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

      // Usando mock (Timeout) já que o Supabase local não está rodando
      setTimeout(() => {
        if (cancelled) return;
        setOrders([
          {
            id: "ord_001",
            status: "pending",
            customer_name: "Ana Laura",
            customer_phone: "(11) 99999-1111",
            customer_address: "Rua das Flores, 123",
            address_reference: "Perto da padaria",
            notes: "Sem cebola por favor",
            payment_method_id: "pix",
            subtotal: 45.00,
            delivery_fee: 5.00,
            discount: 0,
            total: 50.00,
            created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
            paid_at: null,
            business_id: "biz_1"
          },
          {
            id: "ord_002",
            status: "preparing",
            customer_name: "Carlos Eduardo",
            customer_phone: "(11) 98888-2222",
            customer_address: "Av Paulista, 1000, Apto 45",
            address_reference: "",
            notes: "",
            payment_method_id: "credit",
            subtotal: 80.00,
            delivery_fee: 0.00,
            discount: 10.00,
            total: 70.00,
            created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
            paid_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
            business_id: "biz_1"
          },
          {
            id: "ord_003",
            status: "delivered",
            customer_name: "Mariana Silva",
            customer_phone: "(11) 97777-3333",
            customer_address: "Rua Augusta, 500",
            address_reference: "Prédio comercial",
            notes: "Deixar na portaria",
            payment_method_id: "pix",
            subtotal: 32.00,
            delivery_fee: 5.00,
            discount: 0,
            total: 37.00,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            paid_at: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString(),
            business_id: "biz_1"
          }
        ] as any[]);

        setItems([
          {
            id: "item_1",
            order_id: "ord_001",
            product_id: "prod_1",
            product_name: "Bolo de Pote Cenoura e Cacau",
            quantity: 2,
            unit_price: 18.00,
            total_price: 36.00,
            variations_snapshot: null
          },
          {
            id: "item_2",
            order_id: "ord_001",
            product_id: "prod_2",
            product_name: "Trufa Vegana de Chocolate",
            quantity: 1,
            unit_price: 9.00,
            total_price: 9.00,
            variations_snapshot: null
          },
          {
            id: "item_3",
            order_id: "ord_002",
            product_id: "prod_3",
            product_name: "Mini Coxinhas Veganas (Porção)",
            quantity: 2,
            unit_price: 24.00,
            total_price: 48.00,
            variations_snapshot: null
          },
          {
            id: "item_4",
            order_id: "ord_002",
            product_id: "prod_4",
            product_name: "Kombucha Frutas Vermelhas",
            quantity: 2,
            unit_price: 16.00,
            total_price: 32.00,
            variations_snapshot: null
          },
          {
            id: "item_5",
            order_id: "ord_003",
            product_id: "prod_1",
            product_name: "Bolo de Pote Cenoura e Cacau",
            quantity: 1,
            unit_price: 18.00,
            total_price: 18.00,
            variations_snapshot: null
          },
          {
            id: "item_6",
            order_id: "ord_003",
            product_id: "prod_5",
            product_name: "Brownie Vegano",
            quantity: 1,
            unit_price: 14.00,
            total_price: 14.00,
            variations_snapshot: null
          }
        ] as any[]);

        setPaymentMethods([
          { id: "pix", name: "PIX", type: "pix", is_active: true, business_id: "biz_1", instructions: null, created_at: "" },
          { id: "credit", name: "Cartão de Crédito", type: "credit_card", is_active: true, business_id: "biz_1", instructions: null, created_at: "" }
        ] as any[]);
        setLoading(false);
      }, 300);
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

  const deleteOrder = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido e todos os seus itens?")) return;
    
    setUpdatingOrderId(id);
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      
      setOrders((current) => current.filter((o) => o.id !== id));
      toast.success("Pedido excluido com sucesso");
    } catch (err) {
      console.error(err);
      toast.error("Nao foi possivel excluir o pedido");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const generateReceipt = async (order: OrderRow, items: ItemRow[], paymentName: string) => {
    try {
      const doc = new jsPDF();
      const W = 210;
      const BRAND: [number,number,number]     = [106, 13, 21];
      const HIGHLIGHT: [number,number,number] = [222, 27, 35];
      const CREAM: [number,number,number]     = [252, 244, 235];
      const GRAY: [number,number,number]      = [80, 80, 80];
      const LGRAY: [number,number,number]     = [160, 160, 160];
      const WHITE: [number,number,number]     = [255, 255, 255];

      // ── HEADER BAND ─────────────────────────────────────────────────────
      // Background removed (white)

      // logo — no background needed, just image
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

      // title right
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...BRAND);
      doc.text("COMPROVANTE", W - 12, 15, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text("DE PEDIDO", W - 12, 21, { align: "right" });

      // order number — bigger and prominent
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...BRAND);
      doc.text(formatOrderCode(order.id), W - 12, 29, { align: "right" });

      // date smaller below
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...LGRAY);
      doc.text(formatDateTimeBR(order.created_at), W - 12, 35.5, { align: "right" });

      // ── STATUS BADGE ────────────────────────────────────────────────────
      const sLabel = STATUS_LABELS[order.status] ?? order.status;
      const sBg: Record<string,[number,number,number]> = {
        pending:   [245,158,11],  confirmed: [59,130,246],
        preparing: [139,92,246],  delivered: [6,182,212],
        paid:      [16,185,129],  cancelled: [239,68,68],
      };
      const bC = sBg[order.status] ?? [100,100,100] as [number,number,number];
      doc.setFillColor(...bC);
      doc.roundedRect(12, 44, 38, 7, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      doc.text(sLabel.toUpperCase(), 31, 49, { align: "center" });

      // ── INFO CARDS ──────────────────────────────────────────────────────
      const cTop = 55;
      const cH = 44;

      // LEFT — Cliente
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
      doc.text(order.customer_name || "—", 19, cTop + 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(order.customer_phone || "—", 19, cTop + 21);
      const aLines = doc.splitTextToSize(order.customer_address || "—", 82);
      doc.text(aLines, 19, cTop + 28);
      if (order.address_reference) {
        doc.setFontSize(7.5);
        doc.setTextColor(...LGRAY);
        doc.text(`Ref: ${order.address_reference}`, 19, cTop + 38);
      }

      // RIGHT — Pagamento
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
      doc.text(paymentName, 115, cTop + 14);

      const isPaid = order.status === "paid";
      const pBadgeBg: [number,number,number] = isPaid ? [16,185,129] : [245,158,11];
      const pBadgeW = isPaid ? 22 : 30;
      doc.setFillColor(...pBadgeBg);
      doc.roundedRect(115, cTop + 18, pBadgeW, 7, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      doc.text(isPaid ? "PAGO" : "PENDENTE", 115 + pBadgeW / 2, cTop + 23, { align: "center" });

      if (isPaid && order.paid_at) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...LGRAY);
        doc.text(`em ${formatDateTimeBR(order.paid_at)}`, 115, cTop + 33);
      }
      if (order.notes) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(...LGRAY);
        const nLines = doc.splitTextToSize(`Obs: ${order.notes}`, 82);
        doc.text(nLines, 115, cTop + (isPaid ? 39 : 29));
      }

      // ── ITEMS TABLE ─────────────────────────────────────────────────────
      autoTable(doc, {
        startY: cTop + cH + 8,
        margin: { left: 12, right: 12 },
        head: [["Produto", "Qtd", "Vlr Unit.", "Total"]],
        body: items.map(it => [
          it.product_name,
          `${it.quantity}×`,
          formatBRL(it.unit_price),
          formatBRL(it.total_price),
        ]),
        theme: "grid",
        headStyles: { fillColor: BRAND, textColor: WHITE, fontStyle: "bold", fontSize: 9, cellPadding: 3.5 },
        alternateRowStyles: { fillColor: [252, 246, 240] },
        bodyStyles: { textColor: GRAY, fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: 15, halign: "center" },
          2: { cellWidth: 30, halign: "right" },
          3: { cellWidth: 30, halign: "right", fontStyle: "bold" },
        },
      });

      // ── TOTALS ──────────────────────────────────────────────────────────
      let ty = (doc as any).lastAutoTable.finalY + 5;
      const boxH = order.discount > 0 ? 33 : 27;
      doc.setFillColor(...CREAM);
      doc.roundedRect(118, ty, 80, boxH, 3, 3, "F");
      doc.setDrawColor(...HIGHLIGHT);
      doc.setLineWidth(0.3);
      doc.roundedRect(118, ty, 80, boxH, 3, 3, "S");

      ty += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text("Subtotal:", 164, ty, { align: "right" });
      doc.text(formatBRL(order.subtotal), 194, ty, { align: "right" });
      ty += 6;
      doc.text("Entrega:", 164, ty, { align: "right" });
      doc.text(formatBRL(order.delivery_fee), 194, ty, { align: "right" });
      ty += 6;

      if (order.discount > 0) {
        doc.setTextColor(...HIGHLIGHT);
        doc.text("Desconto:", 164, ty, { align: "right" });
        doc.text(`-${formatBRL(order.discount)}`, 194, ty, { align: "right" });
        ty += 6;
      }

      doc.setFillColor(...BRAND);
      doc.rect(118, ty - 1, 80, 9, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...WHITE);
      doc.text("TOTAL", 164, ty + 5.5, { align: "right" });
      doc.text(formatBRL(order.total), 194, ty + 5.5, { align: "right" });

      // ── FOOTER (always at page bottom) ──────────────────────────────────
      const pageH = doc.internal.pageSize.getHeight(); // 297mm for A4
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...BRAND);
      doc.text("Nutrindo Momentos", W / 2, pageH - 10, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      doc.text("Obrigada por fazer parte desse momento!", W / 2, pageH - 5, { align: "center" });

      doc.save(`Pedido_${formatOrderCode(order.id)}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar o PDF");
    }
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

                      <div className="flex flex-col gap-2 items-end">
                        <button
                          type="button"
                          onClick={() => generateReceipt(order, detailsItems, paymentName)}
                          className="inline-flex min-w-36 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 transition bg-white text-orange-600 ring-orange-200 hover:bg-orange-50"
                        >
                          <Download className="h-4 w-4" />
                          Gerar PDF
                        </button>
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
                        <button
                          type="button"
                          disabled={updatingOrderId === order.id}
                          onClick={() => deleteOrder(order.id)}
                          className="inline-flex min-w-36 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 transition bg-white text-rose-600 ring-rose-200 hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
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
