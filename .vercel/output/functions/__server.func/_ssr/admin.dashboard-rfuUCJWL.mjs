import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, e as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { K as LoaderCircle, Q as Menu, aa as ShieldCheck, N as LogOut, ar as X, l as ChevronRight, k as ChevronLeft, f as ChartColumn, U as Package, ab as ShoppingBag, v as CreditCard, ao as Users, ai as TicketPercent, aq as Wallet, R as MessageCircle, ah as Tags, s as Clock, a7 as Settings, a5 as ScrollText } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const navItems = [{
  to: "/admin/dashboard/visao",
  label: "Dashboard",
  icon: ChartColumn
}, {
  to: "/admin/dashboard/cardapio",
  label: "Cardápio",
  icon: Package
}, {
  to: "/admin/dashboard/pedidos",
  label: "Pedidos",
  icon: ShoppingBag
}, {
  to: "/admin/dashboard/pagamentos",
  label: "Pagamentos",
  icon: CreditCard
}, {
  to: "/admin/dashboard/clientes",
  label: "Clientes",
  icon: Users
}, {
  to: "/admin/dashboard/cupons",
  label: "Cupom",
  icon: TicketPercent
}, {
  to: "/admin/dashboard/financeiro",
  label: "Financeiro",
  icon: Wallet
}, {
  to: "/admin/dashboard/gateways",
  label: "Gateways",
  icon: CreditCard
}, {
  to: "/admin/dashboard/whatsapp",
  label: "WhatsApp",
  icon: MessageCircle
}, {
  to: "/admin/dashboard/categorias",
  label: "Categorias",
  icon: Tags
}, {
  to: "/admin/dashboard/produtos",
  label: "Produtos (Antigo)",
  icon: Package
}, {
  to: "/admin/dashboard/horarios",
  label: "Horários",
  icon: Clock
}, {
  to: "/admin/dashboard/configuracoes",
  label: "Configurações",
  icon: Settings
}, {
  to: "/admin/dashboard/auditoria",
  label: "Auditoria",
  icon: ScrollText
}];
function AdminDashboardLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const [checking, setChecking] = reactExports.useState(true);
  const [email, setEmail] = reactExports.useState(null);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [collapsed, setCollapsed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data,
        error
      } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate({
          to: "/admin",
          replace: true
        });
        return;
      }
      const {
        data: isAdmin
      } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin"
      });
      if (!isAdmin) {
        await supabase.auth.signOut();
        navigate({
          to: "/admin",
          replace: true
        });
        return;
      }
      setEmail(data.user.email ?? null);
      setChecking(false);
      if (pathname === "/admin/dashboard" || pathname === "/admin/dashboard/") {
        navigate({
          to: "/admin/dashboard/visao",
          replace: true
        });
      }
    })();
  }, []);
  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/admin",
      replace: true
    });
  };
  if (checking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center bg-cream", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-brand" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream md:flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 bg-card border-b border-border/60 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(true), className: "grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground", "aria-label": "Abrir menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-8 w-8 place-items-center rounded-full bg-brand text-brand-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-base text-brand leading-none", children: "ADMIN" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onLogout, className: "grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground", "aria-label": "Sair", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
    ] }),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden fixed inset-0 z-40 bg-black/50", onClick: () => setMobileOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: cn("fixed md:static inset-y-0 left-0 z-50 shrink-0 bg-card border-r border-border/60 flex flex-col transition-all duration-200 md:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", collapsed ? "w-16 max-w-[85vw] md:w-16" : "w-72 max-w-[85vw] md:w-64"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border/60 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg text-brand leading-none", children: "ADMIN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(false), className: "md:hidden grid h-8 w-8 place-items-center rounded-lg hover:bg-muted shrink-0", "aria-label": "Fechar menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCollapsed((v) => !v), className: "hidden md:grid h-7 w-7 place-items-center rounded-lg hover:bg-muted shrink-0", "aria-label": collapsed ? "Expandir menu" : "Recolher menu", title: collapsed ? "Expandir menu" : "Recolher menu", children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-2 space-y-1 overflow-y-auto", children: navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-brand text-brand-foreground shadow-sm" : "text-foreground/80 hover:bg-muted"), title: collapsed ? item.label : void 0, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0" }),
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: item.label })
        ] }, item.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("border-t border-border/60", collapsed ? "p-2" : "p-3"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onLogout, className: cn("inline-flex items-center justify-center gap-2 rounded-xl bg-muted text-sm font-semibold text-foreground hover:bg-muted/70 transition", collapsed ? "w-full h-10 px-0" : "w-full px-4 py-2.5"), title: collapsed ? "Sair" : void 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 shrink-0" }),
        !collapsed && "Sair"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] });
}
export {
  AdminDashboardLayout as component
};
