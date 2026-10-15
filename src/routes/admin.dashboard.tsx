import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
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
  ScrollText,
  TicketPercent,
  Users,
  MessageCircle,
  Settings,
  Truck,
  Gift,
  ExternalLink,
  Store,
  Layers,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo_lume.png";
import { Toaster } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardLayout,
});

type NavCategory = {
  title: string;
  items: Array<{
    to: string;
    label: string;
    icon: any;
    badgeKey?: "orders";
  }>;
};

const navCategories: NavCategory[] = [
  {
    title: "Operações e Vendas",
    items: [
      { to: "/admin/dashboard/visao", label: "Visão Geral", icon: BarChart3 },
      { to: "/admin/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag, badgeKey: "orders" },
      { to: "/admin/dashboard/cardapio", label: "Cardápio", icon: Package },
      { to: "/admin/dashboard/clientes", label: "Clientes", icon: Users },
    ],
  },
  {
    title: "Gestão Financeira",
    items: [
      { to: "/admin/dashboard/financeiro", label: "Financeiro", icon: Wallet },
      { to: "/admin/dashboard/pagamentos", label: "Pagamentos", icon: CreditCard },
      { to: "/admin/dashboard/cupons", label: "Cupons", icon: TicketPercent },
      { to: "/admin/dashboard/gateways", label: "Gateways", icon: CreditCard },
    ],
  },
  {
    title: "Catálogo e Prêmios",
    items: [
      { to: "/admin/dashboard/categorias", label: "Categorias", icon: Tags },
      { to: "/admin/dashboard/produtos", label: "Produtos", icon: Package },
      { to: "/admin/dashboard/loja-premios", label: "Loja de Prêmios", icon: Gift },
      { to: "/admin/dashboard/resgates", label: "Resgates", icon: Gift },
    ],
  },
  {
    title: "Configurações da Loja",
    items: [
      { to: "/admin/dashboard/entregas", label: "Entregas e Frete", icon: Truck },
      { to: "/admin/dashboard/horarios", label: "Horários de Abertura", icon: Clock },
      { to: "/admin/dashboard/whatsapp", label: "WhatsApp e Mensagens", icon: MessageCircle },
      { to: "/admin/dashboard/configuracoes", label: "Configurações Gerais", icon: Settings },
      { to: "/admin/dashboard/auditoria", label: "Auditoria", icon: ScrollText },
    ],
  },
];

const mobileBottomTabs = [
  { to: "/admin/dashboard/visao", label: "Visão", icon: BarChart3 },
  { to: "/admin/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag, badgeKey: "orders" },
  { to: "/admin/dashboard/cardapio", label: "Cardápio", icon: Package },
  { to: "/admin/dashboard/financeiro", label: "Financeiro", icon: Wallet },
] as const;

function AdminDashboardLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

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

      if (pathname === "/admin/dashboard" || pathname === "/admin/dashboard/") {
        navigate({ to: "/admin/dashboard/visao", replace: true });
      }
    })();
  }, [navigate, pathname]);

  const fetchPendingOrders = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      if (!error && count !== null) {
        setPendingOrdersCount(count);
      }
    } catch {
      // silencioso
    }
  }, []);

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 20000);
    return () => clearInterval(interval);
  }, [fetchPendingOrders]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  };

  const currentTitle = navCategories
    .flatMap((c) => c.items)
    .find((item) => pathname.startsWith(item.to))?.label || "Painel Admin";

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand text-brand-foreground shadow-lg shadow-brand/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
          <p className="text-xs font-semibold text-foreground/60 tracking-wider uppercase">Carregando Painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream md:flex text-foreground">
      {/* Topbar Mobile */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-2 bg-card/95 backdrop-blur-md border-b border-border/70 px-3 py-2.5 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted/80 text-foreground active:scale-95 transition-transform hover:bg-muted"
            aria-label="Abrir menu completo"
          >
            <Menu className="h-5 w-5" />
            {pendingOrdersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-card animate-pulse" />
            )}
          </button>
          <div className="min-w-0 flex items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="truncate">
              <h1 className="font-display text-sm font-black text-brand leading-none uppercase tracking-wide truncate">
                {currentTitle}
              </h1>
              <p className="text-[10px] text-muted-foreground truncate font-medium">
                Lume Artesanais
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-9 w-9 place-items-center rounded-xl bg-muted/70 text-foreground/80 hover:text-brand hover:bg-muted active:scale-95 transition"
            title="Ver loja online"
            aria-label="Ver loja"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            onClick={onLogout}
            className="grid h-9 w-9 place-items-center rounded-xl bg-muted/70 text-rose-600 hover:bg-rose-50 active:scale-95 transition"
            aria-label="Sair da conta"
            title="Sair da conta"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Overlay Mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={cn(
          "fixed md:sticky md:top-0 md:h-screen inset-y-0 left-0 z-50 shrink-0 bg-card border-r border-border/70 flex flex-col transition-all duration-300 md:translate-x-0 shadow-2xl md:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-20 md:w-20" : "w-[85vw] max-w-[320px] md:w-64"
        )}
      >
        <div className="p-4 border-b border-border/70 flex items-center justify-between gap-2.5 bg-gradient-to-r from-card via-card to-muted/30">
          <div className="flex items-center gap-3 min-w-0">
            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <img src={logo} alt="Lume Artesanais" className="h-8 w-auto object-contain object-left mb-1" />
                <p className="text-[11px] text-muted-foreground truncate font-medium">
                  {email || "Administrador"}
                </p>
              </div>
            ) : (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand text-brand-foreground shadow-md shadow-brand/20">
                <ShieldCheck className="h-5 w-5" />
              </span>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden grid h-9 w-9 place-items-center rounded-xl bg-muted text-foreground hover:bg-muted/80 active:scale-95 transition"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden md:grid h-8 w-8 place-items-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-brand/5 hover:bg-brand/10 text-brand border border-brand/15 text-xs font-semibold transition group"
            >
              <span className="flex items-center gap-2">
                <Store className="h-3.5 w-3.5" />
                <span>Ver Loja Online</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-brand/70 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}

        <nav className="flex-1 p-2 space-y-4 overflow-y-auto overscroll-contain select-none">
          {navCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 pt-1 text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80">
                  {cat.title}
                </p>
              )}
              {cat.items.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.to);
                const isOrders = item.badgeKey === "orders";

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all relative group",
                      active
                        ? "bg-brand text-brand-foreground shadow-sm shadow-brand/20 font-bold"
                        : "text-foreground/80 hover:bg-muted/70 hover:text-foreground active:scale-[0.98]"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", active ? "text-brand-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {isOrders && pendingOrdersCount > 0 && (
                      <span
                        className={cn(
                          "ml-auto px-1.5 py-0.5 text-[10px] font-extrabold rounded-full shrink-0 shadow-sm animate-pulse",
                          active
                            ? "bg-white text-brand"
                            : "bg-rose-500 text-white"
                        )}
                      >
                        {pendingOrdersCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={cn("border-t border-border/70 bg-card", collapsed ? "p-2" : "p-3")}>
          <button
            onClick={onLogout}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl bg-muted/80 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 active:scale-95 transition shadow-sm",
              collapsed ? "w-full h-10 px-0" : "w-full px-4 py-2.5"
            )}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sair da Conta"}
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 min-w-0 overflow-x-hidden p-3 sm:p-5 md:p-8 pb-28 md:pb-8 max-w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar Mobile */}
      <nav
        aria-label="Navegação rápida mobile"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border/80 px-2 pt-1.5 pb-2 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex items-center justify-around select-none"
      >
        {mobileBottomTabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.to);
          const isOrders = tab.badgeKey === "orders";

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-center min-w-[56px] transition active:scale-95 relative",
                active
                  ? "text-brand font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-xl transition-all",
                    active ? "bg-brand text-brand-foreground shadow-sm shadow-brand/25 scale-105" : "bg-transparent text-current"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {isOrders && pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 grid h-4 min-w-[16px] px-1 place-items-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm ring-2 ring-card">
                    {pendingOrdersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight tracking-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-center min-w-[56px] transition active:scale-95 relative text-muted-foreground hover:text-foreground font-medium"
        >
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-muted/60 text-foreground transition-all">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-[10px] leading-tight tracking-tight">
            Mais
          </span>
        </button>
      </nav>

      <Toaster position="top-center" richColors />
    </div>
  );
}
