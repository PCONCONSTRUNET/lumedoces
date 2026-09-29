import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, ChefHat, Truck, CheckSquare, XCircle, ArrowLeft, PackageOpen, X } from "lucide-react";
import { formatBRL } from "@/store/cart";
import { formatOrderCode } from "@/lib/order-utils";
import type { Database } from "@/integrations/supabase/types";
import logo from "@/assets/logo_lume.png";

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

const TIMELINE_STEPS = [
  { id: 'pending', label: 'Pedido Recebido' },
  { id: 'confirmed', label: 'Confirmado' },
  { id: 'preparing', label: 'Em Preparo' },
  { id: 'dispatch', label: 'Saiu para Entrega / Retirada' },
  { id: 'delivered', label: 'Finalizado' },
];

const getStatusIndex = (status: string) => {
  if (status === 'cancelled') return -1;
  if (status === 'pending' || status === 'paid') return 0;
  if (status === 'confirmed') return 1;
  if (status === 'preparing') return 2;
  if (status === 'out_for_delivery' || status === 'ready_for_pickup') return 3;
  if (status === 'delivered') return 4;
  return 0;
};

function HistoricoPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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
                <div key={order.id} className="bg-white rounded-3xl shadow-md border-2 border-brand/20 overflow-hidden">
                  <div className="border-b border-gray-50 bg-gray-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400">
                          {formatOrderCode(order.id, order.order_number)}

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

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-4 border-t border-gray-100 gap-4">
                      <div className="flex flex-col">
                        <span className="text-gray-500 font-medium">Total do Pedido</span>
                        <span className="text-xl font-bold text-highlight">{formatBRL(order.total || 0)}</span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="w-full sm:w-auto px-6 py-3 bg-brand/10 text-brand font-bold rounded-xl hover:bg-brand/20 transition-colors flex justify-center items-center gap-2"
                      >
                        Acompanhar Pedido
                      </button>
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

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center mb-6 mt-2">
                <img src={logo} alt="Lume Artesanais" className="h-14 w-auto object-contain mb-2 drop-shadow-sm" />
                <h2 className="text-xl font-bold text-gray-800">Status do Pedido</h2>
              </div>
              
              {selectedOrder.status === 'cancelled' ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="h-8 w-8 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Pedido Cancelado</h3>
                  <p className="text-gray-500 mt-2">Infelizmente este pedido foi cancelado.</p>
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-gray-100 space-y-8 mt-4 ml-4 pb-4">
                  {TIMELINE_STEPS.map((step, index) => {
                    const currentIndex = getStatusIndex(selectedOrder.status);
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div key={step.id} className="relative flex items-center gap-4">
                        <div className={`absolute -left-[42px] flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-sm shrink-0 z-10 transition-colors duration-500
                          ${isCompleted ? 'bg-brand' : 
                            isCurrent ? 'bg-brand' : 
                            'bg-gray-200'}`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : 
                           isCurrent ? <Clock className="w-5 h-5 text-white animate-pulse" /> : 
                           null}
                        </div>
                        <div className={`font-bold transition-all duration-500 ${isCurrent ? 'text-brand text-lg translate-x-1' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
