import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import banner from "@/assets/banner.png";
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
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });
      if (isAdmin) navigate({ to: "/admin/dashboard", replace: true });
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
        setLoading(false);
        return;
      }


      const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });

      if (roleErr) {
        console.error(roleErr);
        toast.error("Erro ao verificar permissão.");
        return;
      }

      if (!isAdmin) {
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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background with banner */}
      <div className="absolute inset-0 z-0">
        <img src={banner} className="w-full h-full object-cover opacity-30" alt="" />
        <div className="absolute inset-0 bg-cream/80 backdrop-blur-[2px]" />
      </div>

      <Toaster position="top-center" richColors />
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-border relative z-10 flex flex-col justify-center">

        <div className="text-center">
          <h1 className="font-display text-4xl text-brand">ADMIN</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Acesso restrito — Nutrindo Momentos
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-foreground/80">
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
                className="w-full rounded-full border border-border bg-white shadow-sm py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-highlight/40"
                placeholder="voce@email.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-foreground/80">
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
                className="w-full rounded-full border border-border bg-white shadow-sm py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-highlight/40"
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-highlight px-6 py-3.5 text-sm font-bold text-white shadow-md hover:opacity-95 disabled:opacity-60 transition tracking-wide"
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
