import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, ChefHat, Truck, CheckSquare, XCircle, ArrowLeft, PackageOpen } from "lucide-react";
import { formatBRL } from "@/store/cart";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/historico")({
  component: HistoricoPage,
});

type OrderStatus = Database["public"]["Enums"]["order_status"];

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: any; color: string; bgColor: string }> = {
  pending: { label: "Aguardando Confirmação", icon: Clock, color: "text-amber-600", bgColor: "bg-amber-100" },
  confirmed: { label: "Confirmado", icon: CheckCircle2, color: "text-blue-600", bgColor: "bg-blue-100" },
  preparing: { label: "Em Preparo", icon: ChefHat, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  ready_for_pickup: { label: "Aguardando Retirada", icon: CheckSquare, color: "text-fuchsia-600", bgColor: "bg-fuchsia-100" },
  out_for_delivery: { label: "Saiu para Entrega", icon: Truck, color: "text-sky-600", bgColor: "bg-sky-100" },
  delivered: { label: "Finalizado", icon: CheckSquare, color: "text-cyan-600", bgColor: "bg-cyan-100" },
  paid: { label: "Pago", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-rose-600", bgColor: "bg-rose-100" },
};

function HistoricoPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const savedIds = JSON.parse(localStorage.getItem("customer_order_ids") || "[]");
        if (!savedIds || savedIds.length === 0) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .in("id", savedIds)
          .order("created_at", { ascending: false });

        if (data) {
          setOrders(data);
        }
      } catch (e) {
        console.error("Erro ao carregar histórico", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-cream/30 pb-20 pt-8 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-brand font-bold hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Cardápio
        </Link>
        
        <h1 className="font-serif text-3xl font-extrabold text-highlight mb-2">
          Meus Pedidos
        </h1>
        <p className="text-gray-600 mb-8">
          Acompanhe o andamento dos pedidos que você fez neste dispositivo.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <PackageOpen className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Nenhum pedido encontrado</h2>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Você ainda não fez nenhum pedido neste aparelho ou eles foram apagados do histórico.
            </p>
            <Link to="/" className="mt-6 rounded-full bg-brand px-6 py-3 font-bold text-white shadow-md hover:scale-105 transition">
              Ver Cardápio
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status as OrderStatus] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const isPix = order.payment_method_id === "pix";
              const isPendingPayment = isPix && order.status === "pending";

              return (
                <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="border-b border-gray-50 bg-gray-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">{order.customer_name}</h3>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${statusConfig.bgColor} border-white shadow-sm shrink-0`}>
                      <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                      <span className={`font-bold text-sm ${statusConfig.color}`}>
                        {isPendingPayment ? "Aguardando PIX" : statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <ul className="space-y-3 mb-6">
                      {order.order_items?.map((item: any) => (
                        <li key={item.id} className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <span className="font-bold text-gray-700">{item.quantity}x</span>
                            <span className="text-gray-600">{item.product_name}</span>
                          </div>
                          <span className="font-medium text-gray-800">{formatBRL(item.total_price || 0)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-gray-500 font-medium">Total do Pedido</span>
                      <span className="text-xl font-bold text-highlight">{formatBRL(order.total || 0)}</span>
                    </div>
                    
                    {isPendingPayment && (
                      <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-sm text-amber-800 font-bold mb-1">Pagamento Pendente</p>
                        <p className="text-xs text-amber-700">Seu pedido foi registrado e está aguardando a confirmação do pagamento PIX.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
