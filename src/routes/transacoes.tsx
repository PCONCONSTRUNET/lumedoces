import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Receipt, Search, CreditCard, Banknote, QrCode } from "lucide-react";
import { formatBRL } from "@/store/cart";
import { formatOrderCode } from "@/lib/order-utils";

export const Route = createFileRoute("/transacoes")({
  component: TransacoesPage,
});

function TransacoesPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: "/perfil" });
        return;
      }
      setSession(session);
      loadTransactions(session);
    });
  }, [navigate]);

  async function loadTransactions(activeSession: any) {
    try {
      const userData = activeSession.user.user_metadata;
      
      // Fetch orders by user_id OR by phone (to get legacy orders)
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, total, created_at, status, payment_method_id")
        .or(`user_id.eq.${activeSession.user.id}${userData.phone ? `,customer_phone.eq.${userData.phone}` : ''}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (e) {
      console.error("Erro ao carregar transações", e);
    } finally {
      setLoading(false);
    }
  }

  const getPaymentIcon = (method: string) => {
    if (method === "pix") return <QrCode className="h-5 w-5 text-teal-600" />;
    if (method === "money") return <Banknote className="h-5 w-5 text-emerald-600" />;
    if (method === "card" || method?.includes("credit") || method?.includes("debit")) return <CreditCard className="h-5 w-5 text-blue-600" />;
    return <Receipt className="h-5 w-5 text-gray-500" />;
  };

  const getPaymentName = (method: string) => {
    if (method === "pix") return "PIX";
    if (method === "money") return "Dinheiro";
    if (method === "credit_card") return "Cartão de Crédito";
    if (method === "debit_card") return "Cartão de Débito";
    if (method === "card") return "Maquininha (Cartão)";
    return method || "Não especificado";
  };

  return (
    <main className="min-h-screen bg-cream/30 pb-20 pt-8 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/perfil" className="inline-flex items-center gap-2 text-brand font-bold hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Perfil
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-brand/10 rounded-xl text-brand">
            <Receipt className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-highlight">
            Minhas Transações
          </h1>
        </div>
        <p className="text-gray-600 mb-8">
          Histórico de pagamentos e valores de todos os seus pedidos.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Nenhuma transação</h2>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Você ainda não tem transações registradas no sistema.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderIdStr = formatOrderCode(order.id, order.order_number);
              return (
                <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-brand/30">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {getPaymentIcon(order.payment_method_id)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Pedido {orderIdStr}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(order.created_at).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                      </p>
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Forma: {getPaymentName(order.payment_method_id)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right flex flex-col justify-end">
                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">Valor Pago</p>
                    <p className="text-xl font-extrabold text-emerald-600">
                      {formatBRL(order.total)}
                    </p>
                    {order.status === 'cancelled' && (
                      <p className="text-xs text-rose-500 font-bold mt-1">Cancelado / Estornado</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  );
}
