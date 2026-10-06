import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Store, Gift, Star, CheckCircle2, Coins, ShoppingBag, AlertCircle, X, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import iconPoints from "@/assets/icon_points_lume.png";

export const Route = createFileRoute("/loja")({
  component: LojaPage,
});

type RewardItem = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  points_cost: number;
  stock: number | null;
  is_active: boolean;
  created_at: string;
};

function SuccessModal({ item, onClose }: { item: RewardItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top gradient banner */}
        <div className="bg-gradient-to-r from-brand to-highlight p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition">
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <PartyPopper className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold">Resgate feito!</h2>
            <p className="text-sm opacity-80">Seu prêmio foi solicitado com sucesso</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-center gap-4 bg-cream/50 rounded-2xl p-4 mb-5">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-xl object-cover shrink-0 shadow-sm" />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Gift className="h-8 w-8 text-brand/50" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-brand uppercase tracking-wider mb-0.5">Prêmio Resgatado</p>
              <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{item.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Coins className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold text-amber-700">{item.points_cost} pontos utilizados</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-5 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700 font-medium">
              Seu resgate foi registrado e será processado em breve. Acompanhe o status em <strong>Meus Resgates</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link to="/resgates" onClick={onClose} className="w-full flex items-center justify-center gap-2 bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-brand/90 transition shadow-sm">
              <Gift className="h-4 w-4" /> Ver Meus Resgates
            </Link>
            <button onClick={onClose} className="w-full py-3 text-gray-500 font-bold text-sm hover:text-gray-700 transition">
              Continuar na Loja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LojaPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<RewardItem[]>([]);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [successItem, setSuccessItem] = useState<RewardItem | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate({ to: "/perfil" }); return; }
      setSession(session);
      loadData(session);
    });
  }, [navigate]);

  async function loadData(activeSession: any) {
    try {
      const db = supabase as any;
      const [itemsRes, balanceRes] = await Promise.all([
        db.from("reward_store_items").select("*").eq("is_active", true).order("points_cost", { ascending: true }),
        db.from("customer_points_balance").select("balance").eq("user_id", activeSession.user.id).single(),
      ]);
      if (itemsRes.data) setItems(itemsRes.data);
      if (balanceRes.data) setPointsBalance(balanceRes.data.balance);
    } catch (e) { console.error("Erro ao carregar loja", e); }
    finally { setLoading(false); }
  }

  async function handleRedeem(item: RewardItem) {
    // Guard: prevent double-click or re-entry
    if (redeeming) return;
    if (!session || pointsBalance < item.points_cost) {
      toast.error("Pontos insuficientes para resgatar este prêmio.");
      return;
    }
    setRedeeming(item.id);
    try {
      const db = supabase as any;

      // 1. Deduct points transaction
      const { error: e1 } = await db.from("points_transactions").insert({
        user_id: session.user.id, amount: -item.points_cost, type: "redemption",
        description: `Resgate: ${item.name}`, reference_id: item.id,
      });
      if (e1) throw e1;

      // 2. Register redemption
      const { error: e2 } = await db.from("reward_redemptions").insert({
        user_id: session.user.id, reward_item_id: item.id,
        points_spent: item.points_cost, status: "pending",
      });
      if (e2) throw e2;

      // 3. Decrement stock if applicable
      if (item.stock !== null) {
        const { error: e3 } = await db
          .from("reward_store_items")
          .update({ stock: item.stock - 1 })
          .eq("id", item.id);
        if (e3) throw e3;
        // Update local state for stock
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, stock: (i.stock ?? 1) - 1 } : i));
      }

      // 4. Update local balance
      setPointsBalance((prev) => prev - item.points_cost);

      // 5. Show success popup
      setSuccessItem(item);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao resgatar premio. Tente novamente.");
    } finally { setRedeeming(null); }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-cream/30">
      <Loader2 className="h-10 w-10 animate-spin text-brand" />
    </div>
  );

  return (
    <main className="min-h-screen bg-cream/30 pb-24 pt-8 px-4 sm:px-8">
      {successItem && <SuccessModal item={successItem} onClose={() => setSuccessItem(null)} />}

      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/perfil" className="p-2 -ml-2 text-brand hover:bg-brand/10 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-3xl font-extrabold text-highlight">Loja de Premios</h1>
        </div>
        <p className="text-gray-500 mb-8 ml-1">Troque seus pontos por produtos e recompensas exclusivas.</p>

        <div className="bg-gradient-to-r from-brand to-highlight rounded-3xl shadow-md p-5 flex items-center justify-between text-white mb-8">
          <div className="flex items-center gap-4">
            <img src={iconPoints} alt="Moeda Lume" className="h-16 w-16 object-contain drop-shadow-md" />
            <div>
              <p className="text-sm opacity-80 font-medium">Meus Pontos</p>
              <p className="text-4xl font-extrabold leading-none">
                {pointsBalance}<span className="text-xl font-bold ml-1 opacity-80">pts</span>
              </p>
            </div>
          </div>
          <Star className="h-8 w-8 opacity-30 mr-2" />
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="h-20 w-20 bg-brand/10 rounded-full flex items-center justify-center mb-4">
              <Store className="h-10 w-10 text-brand/50" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Nenhum premio disponivel</h2>
            <p className="text-gray-400 mt-2 max-w-sm">Em breve novos premios serao adicionados. Continue acumulando pontos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => {
              const canRedeem = pointsBalance >= item.points_cost;
              const isRedeeming = redeeming === item.id;
              const isOutOfStock = item.stock === 0;
              return (
                <div key={item.id} className={`bg-white rounded-3xl shadow-sm border overflow-hidden flex flex-col transition-all duration-200 ${canRedeem && !isOutOfStock ? "border-brand/20 hover:shadow-md hover:-translate-y-0.5" : "border-gray-100 opacity-75"}`}>
                  <div className="relative h-48 bg-gradient-to-br from-cream to-brand/10 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift className="h-16 w-16 text-brand/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span className="font-extrabold text-gray-800 text-sm">{item.points_cost} pts</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{item.name}</h3>
                    {item.description && <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-3">{item.description}</p>}
                    {item.stock !== null && item.stock <= 5 && item.stock > 0 && (
                      <div className="flex items-center gap-1 text-amber-600 text-xs font-bold mb-2">
                        <AlertCircle className="h-3.5 w-3.5" />Restam {item.stock} unidades
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="flex items-center gap-1 text-rose-500 text-xs font-bold mb-2">
                        <AlertCircle className="h-3.5 w-3.5" />Esgotado
                      </div>
                    )}
                    <button
                      onClick={() => handleRedeem(item)}
                      disabled={!canRedeem || isRedeeming || isOutOfStock || !!redeeming}
                      className={`mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                        isRedeeming ? "bg-brand text-white opacity-80"
                        : canRedeem && !isOutOfStock ? "bg-brand text-white hover:bg-brand/90 shadow-sm active:scale-95"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isRedeeming ? <Loader2 className="h-4 w-4 animate-spin" />
                        : canRedeem && !isOutOfStock ? <><ShoppingBag className="h-4 w-4" /> Resgatar agora</>
                        : isOutOfStock ? "Esgotado"
                        : "Pontos insuficientes"}
                    </button>
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
