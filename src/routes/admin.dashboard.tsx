import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate({ to: "/admin", replace: true });
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        await supabase.auth.signOut();
        navigate({ to: "/admin", replace: true });
        return;
      }
      setEmail(data.user.email ?? null);
      setChecking(false);
    })();
  }, [navigate]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-cream">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl text-brand">PAINEL ADMIN</h1>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/70 transition"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
          <h2 className="font-display text-2xl text-foreground">
            Bem-vindo ao painel!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Em breve você terá pedidos, produtos e relatórios aqui.
          </p>
        </div>
      </div>
    </div>
  );
}
