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
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Wallet,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardLayout,
});

const navItems = [
  { to: "/admin/dashboard/visao", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/dashboard/financeiro", label: "Financeiro", icon: Wallet },
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
  const [collapsed, setCollapsed] = useState(false);

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
    <div className="min-h-screen bg-cream md:flex">
      {/* Topbar mobile */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 bg-card border-b border-border/60 px-4 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-brand-foreground">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <h1 className="font-display text-base text-brand leading-none">ADMIN</h1>
        </div>
        <button
          onClick={onLogout}
          className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground"
          aria-label="Sair"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 shrink-0 bg-card border-r border-border/60 flex flex-col transition-all duration-200 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-16 max-w-[85vw] md:w-16" : "w-72 max-w-[85vw] md:w-64"
        )}
      >
        <div className="p-3 border-b border-border/60 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-lg text-brand leading-none">ADMIN</h1>
              <p className="text-[11px] text-muted-foreground truncate">{email}</p>
            </div>
          )}
          {/* Fechar mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden grid h-8 w-8 place-items-center rounded-lg hover:bg-muted shrink-0"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
          {/* Colapsar desktop */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden md:grid h-7 w-7 place-items-center rounded-lg hover:bg-muted shrink-0"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "text-foreground/80 hover:bg-muted"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={cn("border-t border-border/60", collapsed ? "p-2" : "p-3")}>
          <button
            onClick={onLogout}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl bg-muted text-sm font-semibold text-foreground hover:bg-muted/70 transition",
              collapsed ? "w-full h-10 px-0" : "w-full px-4 py-2.5"
            )}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sair"}
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
