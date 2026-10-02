import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, ShoppingBag, Coins, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { formatBRL } from "@/store/cart";

export function ClientDetailsModal({ client, onClose, isOpen }: { client: any; onClose: () => void; isOpen: boolean }) {
  const queryClient = useQueryClient();
  const supabaseUntyped = supabase as any;
  const [pointsInput, setPointsInput] = useState("");
  const [pointsReason, setPointsReason] = useState("");

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["client-orders", client?.phone],
    queryFn: async () => {
      const { data } = await supabaseUntyped
        .from("orders")
        .select("*")
        .eq("customer_phone", client.phone)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isOpen && !!client,
  });

  const { data: pointsData, isLoading: loadingPoints } = useQuery({
    queryKey: ["client-points", client?.user_id],
    queryFn: async () => {
      if (!client?.user_id) return { balance: 0, adjustments: [] };
      const { data: balanceData } = await supabaseUntyped
        .from("customer_points_balance")
        .select("balance")
        .eq("user_id", client.user_id)
        .single();
        
      const { data: adjustments } = await supabaseUntyped
        .from("points_adjustments")
        .select("*")
        .eq("user_id", client.user_id)
        .order("created_at", { ascending: false });

      return {
        balance: balanceData?.balance || 0,
        adjustments: adjustments || []
      };
    },
    enabled: isOpen && !!client?.user_id,
  });

  const adjustPoints = useMutation({
    mutationFn: async () => {
      const points = parseInt(pointsInput);
      if (isNaN(points) || points === 0) throw new Error("Valor inválido");
      
      const { error } = await supabaseUntyped.from("points_adjustments").insert({
        user_id: client.user_id,
        points: points,
        reason: pointsReason || (points > 0 ? "Ajuste manual (Adição)" : "Ajuste manual (Remoção)")
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-points", client?.user_id] });
      setPointsInput("");
      setPointsReason("");
    }
  });

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{client.name}</h2>
            <p className="text-sm text-gray-500">{client.phone} • CPF: {client.cpf || "Não informado"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Col: Orders */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand" />
              Histórico de Compras
            </h3>
            {loadingOrders ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
            ) : orders?.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma compra encontrada.</p>
            ) : (
              <div className="space-y-4">
                {orders?.map((order: any) => (
                  <div key={order.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">Pedido #{order.order_number}</span>
                      <span className="text-sm font-bold text-emerald-600">{formatBRL(order.total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(order.created_at).toLocaleString('pt-BR')} • Status: {order.status}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.points_earned > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          +{order.points_earned} pts ganhos
                        </span>
                      )}
                      {order.points_used > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          -{order.points_used} pts usados
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Col: Points Wallet */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-brand" />
              Carteira de Pontos
            </h3>
            
            {client.user_id ? (
              <>
                <div className="bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-6 text-white mb-6 shadow-md">
                  <p className="text-brand-50 text-sm mb-1 font-medium">Saldo Atual</p>
                  {loadingPoints ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <h4 className="text-4xl font-extrabold">{pointsData?.balance || 0} pts</h4>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                  <h5 className="font-semibold text-gray-800 mb-3">Ajuste Manual</h5>
                  <div className="flex gap-3 mb-3">
                    <input 
                      type="number" 
                      placeholder="+ ou - pontos" 
                      value={pointsInput}
                      onChange={(e) => setPointsInput(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Motivo (Opcional)" 
                    value={pointsReason}
                    onChange={(e) => setPointsReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                  <button 
                    onClick={() => adjustPoints.mutate()}
                    disabled={!pointsInput || adjustPoints.isPending}
                    className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {adjustPoints.isPending ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Salvar Ajuste"}
                  </button>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 mb-3 text-sm">Histórico de Ajustes Manuais</h5>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {pointsData?.adjustments?.length === 0 ? (
                      <p className="text-xs text-gray-500">Nenhum ajuste manual encontrado.</p>
                    ) : (
                      pointsData?.adjustments?.map((adj: any) => (
                        <div key={adj.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50 text-sm">
                          <div>
                            <p className="font-medium text-gray-800">{adj.reason}</p>
                            <p className="text-xs text-gray-500">{new Date(adj.created_at).toLocaleString('pt-BR')}</p>
                          </div>
                          <span className={`font-bold ${adj.points > 0 ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
                            {adj.points > 0 ? <ArrowUp className="h-3 w-3"/> : <ArrowDown className="h-3 w-3"/>}
                            {Math.abs(adj.points)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 border border-amber-200 bg-amber-50 rounded-xl text-amber-800">
                <p className="font-semibold">Usuário não registrado no Auth</p>
                <p className="text-sm mt-1">Este cliente apenas fez pedidos pelo WhatsApp/PDV e não possui uma conta no sistema para gerenciar pontos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
