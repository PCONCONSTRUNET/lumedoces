import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Package, Clock3, UtensilsCrossed, Truck, CheckCircle2, Ban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatOrderCode } from "@/lib/order-utils";

export const Route = createFileRoute("/rastreio")({
  component: RastreioPage,
  head: () => ({
    meta: [
      { title: "Rastreio — Lume Artesanais" },
      { name: "description", content: "Acompanhe o status do seu pedido." },
    ],
  }),
});

type OrderRow = Tables<"orders">;

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock3 className="h-5 w-5" />,
  confirmed: <CheckCircle2 className="h-5 w-5" />,
  preparing: <UtensilsCrossed className="h-5 w-5" />,
  ready_for_pickup: <Package className="h-5 w-5" />,
  out_for_delivery: <Truck className="h-5 w-5" />,
  delivered: <CheckCircle2 className="h-5 w-5" />,
  cancelled: <Ban className="h-5 w-5" />,
  paid: <CheckCircle2 className="h-5 w-5" />,
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready_for_pickup: "Aguardando Retirada",
  out_for_delivery: "Saiu para Entrega",
  delivered: "Finalizado",
  cancelled: "Cancelado",
  paid: "Pago",
};

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered"
];

function RastreioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || searchQuery.trim().length < 3) {
      toast.error("Por favor, insira um código de pedido ou telefone válido.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5);
      
      const cleanSearch = searchQuery.trim();
      const isNumberOnly = /^\d+$/.test(cleanSearch.replace(/^#/, ""));
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSearch);
      
      if (isUUID) {
        query = query.eq("id", cleanSearch);
      } else if (isNumberOnly && cleanSearch.replace(/^#/, "").length <= 6) {
        query = query.eq("order_number", parseInt(cleanSearch.replace(/^#/, ""), 10));
      } else {
        query = query.ilike("customer_phone", `%${cleanSearch.replace(/\D/g, "")}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao buscar pedidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    if (status === 'ready_for_pickup') return 3; // Treat as out for delivery step
    if (status === 'paid') return 1; // Treat as confirmed
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream flex flex-col">
        <Header />
        
        <main className="flex-1 container max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-brand font-fredoka mb-3">
              Acompanhe seu Pedido
            </h1>
            <p className="text-lg text-brand/80 font-nunito">
              Digite seu número de telefone ou o código do pedido para acompanhar o status.
            </p>
          </div>

          <Card className="border-brand/20 shadow-lg mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Input
                    placeholder="Ex: 11999999999 ou #0012"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 h-12 text-lg border-brand/30 focus-visible:ring-highlight"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="h-12 px-8 bg-highlight hover:bg-highlight/90 text-white font-bold text-lg"
                >
                  {loading ? (
                    <Clock3 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searched && !loading && orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-brand/10 shadow-sm">
              <Package className="h-16 w-16 mx-auto text-brand/30 mb-4" />
              <h3 className="text-xl font-bold text-brand font-fredoka">Nenhum pedido encontrado</h3>
              <p className="text-brand/70 mt-2">
                Não localizamos pedidos recentes para o número informado.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIndex = getStepIndex(order.status || 'pending');
              const isCancelled = order.status === 'cancelled';

              return (
                <Card key={order.id} className="border-brand/20 shadow-md overflow-hidden">
                  <div className="bg-brand/5 px-6 py-4 border-b border-brand/10 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-brand/60 uppercase tracking-wider">
                        Pedido {formatOrderCode(order.id, order.order_number)}
                      </p>
                      <p className="text-xs text-brand/50 mt-1">
                        {new Date(order.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand text-lg">
                        R$ {Number(order.total).toFixed(2).replace('.', ',')}
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-brand/20 text-brand mt-1 shadow-sm">
                        {STATUS_ICONS[order.status || 'pending']}
                        {STATUS_LABELS[order.status || 'pending']}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    {isCancelled ? (
                      <div className="text-center py-6">
                        <Ban className="h-12 w-12 mx-auto text-red-500 mb-3 opacity-80" />
                        <h4 className="text-lg font-bold text-red-700">Pedido Cancelado</h4>
                        <p className="text-red-600/80 mt-1 text-sm">Este pedido foi cancelado e não será entregue.</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute top-1/2 left-4 right-4 h-1 bg-brand/10 -translate-y-1/2 rounded-full hidden sm:block"></div>
                        <div className="absolute top-1/2 left-4 h-1 bg-highlight -translate-y-1/2 rounded-full transition-all duration-500 hidden sm:block" style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}></div>
                        
                        <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                          {STATUS_STEPS.map((step, idx) => {
                            const isCompleted = currentStepIndex >= idx;
                            const isCurrent = currentStepIndex === idx;
                            
                            return (
                              <div key={step} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                                <div className={`flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 transition-all duration-300 ${
                                  isCompleted 
                                    ? "bg-highlight border-highlight text-white shadow-md shadow-highlight/30" 
                                    : "bg-white border-brand/20 text-brand/40"
                                } ${isCurrent ? "ring-4 ring-highlight/20 scale-110" : ""}`}>
                                  {STATUS_ICONS[step]}
                                </div>
                                <div className="sm:text-center">
                                  <p className={`text-sm font-bold ${isCompleted ? "text-brand" : "text-brand/50"}`}>
                                    {STATUS_LABELS[step]}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>

        <Footer />
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </div>
    </CartProvider>
  );
}
