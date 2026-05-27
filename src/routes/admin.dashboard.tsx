import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogOut,
  ShieldCheck,
  Loader2,
  ShoppingBag,
  CreditCard,
  Tags,
  Package,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardLayout,
});

const navItems = [
  { to: "/admin/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/dashboard/pagamentos", label: "Pagamentos", icon: CreditCard },
  { to: "/admin/dashboard/categorias", label: "Categorias", icon: Tags },
  { to: "/admin/dashboard/produtos", label: "Produtos", icon: Package },
  { to: "/admin/dashboard/horarios", label: "Horários", icon: Clock },
] as const;

function AdminDashboardLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // fechar drawer ao trocar rota
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate({ to: "/admin", replace: true });
        return;
      }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });
      if (!isAdmin) {
        await supabase.auth.signOut();
        navigate({ to: "/admin", replace: true });
        return;
      }
      setEmail(data.user.email ?? null);
      setChecking(false);

      // se entrou em /admin/dashboard sem aba, vai pra Pedidos
      if (pathname === "/admin/dashboard" || pathname === "/admin/dashboard/") {
        navigate({ to: "/admin/dashboard/pedidos", replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-card border-r border-border/60 flex flex-col">
        <div className="p-5 border-b border-border/60 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-lg text-brand leading-none">ADMIN</h1>
            <p className="text-[11px] text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "text-foreground/80 hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/60">
          <button
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/70 transition"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
