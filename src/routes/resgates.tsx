import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Gift, Download, Search, CheckCircle2, Clock, XCircle } from "lucide-react";
import { generateRedemptionReceipt } from "@/lib/receipt-utils";

export const Route = createFileRoute("/resgates")({
  component: ResgatesHistoryPage,
});

// Skeleton card for perceived-performance
function SkeletonCard() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 animate-pulse">
      <div className="h-16 w-16 rounded-xl bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/5" />
        <div className="h-3 bg-gray-100 rounded w-2/5" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-16 bg-gray-100 rounded-md" />
          <div className="h-6 w-20 bg-gray-100 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <div className="h-9 w-20 bg-gray-100 rounded-xl" />
        <div className="h-9 w-16 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

function ResgatesHistoryPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redemptions, setRedemptions] = useState<any[]>([]);

  useEffect(() => {
    // Immediately grab session from cache (sync-ish), no extra round-trip
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate({ to: "/perfil" }); return; }

      const meta = session.user.user_metadata;
      setUserData(meta);

      // Fire data fetch immediately without waiting for anything else
      const db = supabase as any;
      db.from("reward_redemptions")
        .select(`
          id,
          points_spent,
          status,
          created_at,
          reward_store_items ( name, image_url )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }: any) => {
          if (!error && data) setRedemptions(data);
          setLoading(false);
        });
    });
  }, [navigate]);

  const handleDownloadReceipt = (redemption: any) => {
    generateRedemptionReceipt({
      redemptionId: redemption.id,
      customerName: userData?.full_name || "Cliente Lume",
      customerPhone: userData?.phone || null,
      itemName: redemption.reward_store_items?.name || "Prêmio",
      pointsSpent: redemption.points_spent,
      date: redemption.created_at,
      status: redemption.status,
    });
  };

  const handleDownloadImage = (redemption: any) => {
    import("@/lib/receipt-utils").then(({ generateRedemptionReceiptImage }) => {
      generateRedemptionReceiptImage({
        redemptionId: redemption.id,
        customerName: userData?.full_name || "Cliente Lume",
        customerPhone: userData?.phone || null,
        itemName: redemption.reward_store_items?.name || "Prêmio",
        pointsSpent: redemption.points_spent,
        date: redemption.created_at,
        status: redemption.status,
      });
    });
  };

  return (
    <main className="min-h-screen bg-cream/30 pb-20 pt-8 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/perfil" className="inline-flex items-center gap-2 text-brand font-bold hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Perfil
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-brand/10 rounded-xl text-brand">
            <Gift className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-highlight">Meus Resgates</h1>
        </div>
        <p className="text-gray-600 mb-8">Histórico de prêmios que você resgatou com seus pontos.</p>

        {/* Show skeletons while loading */}
        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : redemptions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Nenhum resgate encontrado</h2>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Você ainda não resgatou prêmios. Acumule pontos e visite a Loja!
            </p>
            <Link to="/loja" className="mt-6 inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-xl hover:bg-brand/90 transition shadow-sm">
              <Gift className="h-4 w-4" /> Ir para a Loja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {redemptions.map((redemption) => (
              <div
                key={redemption.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-brand/30"
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                    {redemption.reward_store_items?.image_url ? (
                      <img
                        src={redemption.reward_store_items.image_url}
                        alt={redemption.reward_store_items.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Gift className="h-8 w-8 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {redemption.reward_store_items?.name || "Item Indisponível"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(redemption.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      {" · "}
                      {new Date(redemption.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20">
                        {redemption.points_spent} pts
                      </span>
                      {redemption.status === "completed" && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset bg-emerald-50 text-emerald-700 ring-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Entregue
                        </span>
                      )}
                      {redemption.status === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Aprovado — em preparo
                        </span>
                      )}
                      {redemption.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset bg-amber-50 text-amber-700 ring-amber-500/20">
                          <Clock className="h-3 w-3" /> Aguardando aprovação
                        </span>
                      )}
                      {redemption.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset bg-rose-50 text-rose-700 ring-rose-500/20">
                          <XCircle className="h-3 w-3" /> Não aprovado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleDownloadImage(redemption)}
                    className="flex items-center gap-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-xl text-sm font-bold transition border border-gray-200"
                    title="Baixar como Imagem"
                  >
                    <Download className="h-4 w-4" />
                    Imagem
                  </button>
                  <button
                    onClick={() => handleDownloadReceipt(redemption)}
                    className="flex items-center gap-1.5 bg-brand/10 text-brand hover:bg-brand/20 px-3 py-2 rounded-xl text-sm font-bold transition border border-transparent"
                    title="Baixar como PDF"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
