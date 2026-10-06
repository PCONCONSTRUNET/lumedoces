import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Gift, Download, Search, Check, X } from "lucide-react";
import { generateRedemptionReceipt } from "@/lib/receipt-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard/resgates")({
  component: AdminResgatesPage,
});

function AdminResgatesPage() {
  const [loading, setLoading] = useState(true);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRedemptions();
  }, []);

  async function loadRedemptions() {
    setLoading(true);
    try {
      const db = supabase as any;

      // 1. Fetch redemptions + reward item info
      const { data: redemptionsData, error: redemptionsError } = await db
        .from("reward_redemptions")
        .select(`
          id,
          user_id,
          points_spent,
          status,
          created_at,
          reward_store_items ( name, image_url )
        `)
        .order("created_at", { ascending: false });

      if (redemptionsError) throw redemptionsError;
      if (!redemptionsData || redemptionsData.length === 0) {
        setRedemptions([]);
        setLoading(false);
        return;
      }

      // 2. Get unique user_ids and fetch their profiles
      const userIds = [...new Set(redemptionsData.map((r: any) => r.user_id).filter(Boolean))];
      const { data: profiles } = await db
        .from("customer_profiles")
        .select("id, full_name, phone, cpf")
        .in("id", userIds);

      const profileMap: Record<string, any> = {};
      (profiles || []).forEach((p: any) => { profileMap[p.id] = p; });

      // 3. Merge data
      const merged = redemptionsData.map((r: any) => ({
        ...r,
        profile: profileMap[r.user_id] || null,
      }));

      setRedemptions(merged);
    } catch (e) {
      console.error("Erro ao carregar resgates", e);
      toast.error("Erro ao carregar resgates.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return redemptions;
    const s = search.toLowerCase().trim();
    return redemptions.filter((r) => {
      const name = (r.profile?.full_name || "").toLowerCase();
      const phone = (r.profile?.phone || "").toLowerCase().replace(/\D/g, "");
      const cpf = (r.profile?.cpf || "").toLowerCase().replace(/\D/g, "");
      const id = (r.id || "").toLowerCase();
      const searchDigits = s.replace(/\D/g, "");
      return (
        name.includes(s) ||
        id.includes(s) ||
        (searchDigits && phone.includes(searchDigits)) ||
        (searchDigits && cpf.includes(searchDigits))
      );
    });
  }, [redemptions, search]);

  const handleDownloadReceipt = (redemption: any) => {
    generateRedemptionReceipt({
      redemptionId: redemption.id,
      customerName: redemption.profile?.full_name || "Cliente",
      customerPhone: redemption.profile?.phone || null,
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
        customerName: redemption.profile?.full_name || "Cliente Lume",
        customerPhone: redemption.profile?.phone || null,
        itemName: redemption.reward_store_items?.name || "Prêmio",
        pointsSpent: redemption.points_spent,
        date: redemption.created_at,
        status: redemption.status,
      });
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const db = supabase as any;
      const { error } = await db
        .from("reward_redemptions")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      const labels: Record<string, string> = {
        approved: "Resgate aprovado!",
        completed: "Marcado como entregue!",
        rejected: "Resgate rejeitado.",
      };
      toast.success(labels[newStatus] ?? "Status atualizado!");
      setRedemptions((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: newStatus } : r)
      );
    } catch {
      toast.error("Erro ao atualizar o status do resgate.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand/10 rounded-xl text-brand">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico de Resgates</h1>
            <p className="text-sm text-muted-foreground">
              Monitore e baixe os comprovantes de prêmios resgatados pelos clientes.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone, CPF ou ID..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Count badge */}
      {!loading && redemptions.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-bold text-foreground">{filtered.length}</span> de{" "}
          <span className="font-bold text-foreground">{redemptions.length}</span> resgates
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border flex flex-col items-center">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="font-bold text-foreground text-lg">
            {search ? "Nenhum resultado encontrado" : "Nenhum resgate encontrado"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {search
              ? `Nenhum resgate corresponde a "${search}". Tente outro termo.`
              : "Os clientes ainda não fizeram resgates na loja."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((redemption) => {
            const profile = redemption.profile;
            const status = redemption.status;
            const shortId = redemption.id.split("-")[0].toUpperCase();

            const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
              pending:   { label: "Pendente",  cls: "bg-amber-100 text-amber-700" },
              approved:  { label: "Aprovado",  cls: "bg-blue-100 text-blue-700" },
              completed: { label: "Entregue",  cls: "bg-emerald-100 text-emerald-700" },
              rejected:  { label: "Rejeitado", cls: "bg-rose-100 text-rose-700" },
            };
            const statusCfg = STATUS_CONFIG[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };

            return (
              <div key={redemption.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden flex items-center justify-center shrink-0">
                    {redemption.reward_store_items?.image_url ? (
                      <img src={redemption.reward_store_items.image_url} alt="Prêmio" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <Gift className="h-8 w-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusCfg.cls)}>
                        {statusCfg.label}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        {new Date(redemption.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground mt-1 truncate">
                      {redemption.reward_store_items?.name || "Prêmio"}
                    </h3>
                    <p className="text-sm font-bold text-amber-600 mt-0.5">{redemption.points_spent} pts</p>
                  </div>
                </div>

                {/* Cliente info */}
                <div className="bg-muted rounded-xl p-3 space-y-0.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Cliente</p>
                  <p className="text-sm font-bold text-foreground">{profile?.full_name || "Sem Nome"}</p>
                  {profile?.phone && <p className="text-xs text-muted-foreground">{profile.phone}</p>}
                  {profile?.cpf && <p className="text-xs text-muted-foreground">CPF: {profile.cpf}</p>}
                  <p className="text-[10px] font-mono text-muted-foreground pt-1">ID: {shortId}</p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  {["pending", "approved", "completed"].map((s, i) => (
                    <>
                      <span key={s} className={cn(
                        "px-2 py-0.5 rounded-full",
                        status === s ? statusCfg.cls
                          : ["pending","approved","completed"].indexOf(status) > i ? "bg-emerald-100 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {i === 0 ? "Pendente" : i === 1 ? "Aprovado" : "Entregue"}
                      </span>
                      {i < 2 && <span className="text-muted-foreground">→</span>}
                    </>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {status === "pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(redemption.id, "approved")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm hover:bg-blue-100 transition"
                      >
                        <Check className="h-4 w-4" /> Aprovar
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(redemption.id, "rejected")}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {status === "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(redemption.id, "completed")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm hover:bg-emerald-100 transition"
                    >
                      <Check className="h-4 w-4" /> Marcar como Entregue
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadImage(redemption)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card text-foreground font-bold text-sm hover:bg-muted transition"
                  >
                    <Download className="h-4 w-4" /> Imagem
                  </button>
                  <button
                    onClick={() => handleDownloadReceipt(redemption)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-transparent bg-brand/10 text-brand font-bold text-sm hover:bg-brand/20 transition"
                  >
                    <Download className="h-4 w-4" /> PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
