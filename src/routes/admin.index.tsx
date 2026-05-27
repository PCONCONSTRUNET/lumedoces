import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import adminBg from "@/assets/admin-bg.png";
import coxinhaIcon from "@/assets/coxinha-icon.png";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Se já logado e admin, vai direto pro painel
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roles) navigate({ to: "/admin/dashboard", replace: true });
    })();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error || !data.user) {
        toast.error("Credenciais inválidas");
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
        toast.error("Esta conta não tem permissão de admin.");
        return;
      }

      toast.success("Bem-vindo!");
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen grid place-items-center px-4"
      style={{
        backgroundColor: "#ff8a1f",
        backgroundImage: `url(${adminBg})`,
        backgroundRepeat: "repeat",
        backgroundSize: "520px 520px",

      }}
    >
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-sm rounded-3xl bg-card/95 backdrop-blur p-8 shadow-2xl ring-1 ring-white/40">

        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground shadow">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-3xl text-brand">ADMIN</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesso restrito — Mini Coxinhas
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground/80">
              E-mail
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder="voce@email.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground/80">
              Senha
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-60 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
              </>
            ) : (
              "ENTRAR"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
