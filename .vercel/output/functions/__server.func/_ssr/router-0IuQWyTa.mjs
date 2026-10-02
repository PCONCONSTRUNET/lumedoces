import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { b as createRouter, a as createRootRouteWithContext, d as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
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
const appCss = "/assets/styles-BjhSnXyR.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$r = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lume Artesanais — Peça já a sua!" },
      { name: "description", content: "As melhores e mais crocantes mini coxinhas da região! Salgados, combos para festas e muito mais. Faça seu pedido online." },
      { name: "author", content: "Lume Artesanais" },
      { property: "og:site_name", content: "Lume Artesanais" },
      { property: "og:title", content: "Lume Artesanais — Peça já a sua!" },
      { property: "og:description", content: "As melhores e mais crocantes mini coxinhas da região! Salgados e combos para festas com entrega rápida. Peça agora." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://minicoxinhas.vercel.app" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lume Artesanais — Peça já a sua!" },
      { name: "twitter:description", content: "As melhores e mais crocantes mini coxinhas da região! Salgados e combos. Peça agora." },
      {
        property: "og:image",
        content: "https://minicoxinhas.vercel.app/open.png"
      },
      {
        name: "twitter:image",
        content: "https://minicoxinhas.vercel.app/open.png"
      }
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800;900&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$r.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$q = () => import("./termos-Db3vUA_v.mjs");
const Route$q = createFileRoute("/termos")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./rastreio-BNpqJ22I.mjs");
const Route$p = createFileRoute("/rastreio")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component"),
  head: () => ({
    meta: [{
      title: "Rastreio — Lume Artesanais"
    }, {
      name: "description",
      content: "Acompanhe o status do seu pedido."
    }]
  })
});
const $$splitComponentImporter$o = () => import("./privacidade-C-e3Vb7d.mjs");
const Route$o = createFileRoute("/privacidade")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./perfil-DloDNe1J.mjs");
const Route$n = createFileRoute("/perfil")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./historico-tJu-H1G6.mjs");
const Route$m = createFileRoute("/historico")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./funcionamento-Cz575vMS.mjs");
const Route$l = createFileRoute("/funcionamento")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./enderecos-Dz2E95qz.mjs");
const Route$k = createFileRoute("/enderecos")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./contato-DNBM9N75.mjs");
const Route$j = createFileRoute("/contato")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component"),
  head: () => ({
    meta: [{
      title: "Contato — Lume Artesanais"
    }, {
      name: "description",
      content: "Endereço, WhatsApp e Instagram da Lume Artesanais."
    }, {
      property: "og:title",
      content: "Contato — Lume Artesanais"
    }, {
      property: "og:description",
      content: "Fale com a gente pelo WhatsApp, Instagram ou venha nos visitar."
    }]
  })
});
const $$splitComponentImporter$i = () => import("./admin-BFsOu0JM.mjs");
const Route$i = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin — Lume Artesanais"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./index-DhI40i7C.mjs");
const Route$h = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component"),
  head: () => ({
    meta: [{
      title: "Lume Artesanais"
    }, {
      name: "description",
      content: "Peça online as melhores mini coxinhas da região. Frango, catupiry, cheddar bacon e combos para festas com entrega rápida."
    }, {
      property: "og:title",
      content: "Lume Artesanais"
    }, {
      property: "og:description",
      content: "Mini coxinhas crocantes, combos e doces. Faça seu pedido!"
    }]
  })
});
const $$splitComponentImporter$g = () => import("./admin.index-zEe69F5_.mjs");
const Route$g = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./admin.dashboard-rfuUCJWL.mjs");
const Route$f = createFileRoute("/admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./admin.dashboard.whatsapp-jxjTK8OO.mjs");
const Route$e = createFileRoute("/admin/dashboard/whatsapp")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./admin.dashboard.visao-CMa5T185.mjs");
const Route$d = createFileRoute("/admin/dashboard/visao")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
function PeriodFilter({
  preset,
  setPreset,
  customFrom,
  customTo,
  setCustomFrom,
  setCustomTo
}) {
  const opts = [{
    k: "today",
    l: "Hoje"
  }, {
    k: "7d",
    l: "7 dias"
  }, {
    k: "30d",
    l: "30 dias"
  }, {
    k: "month",
    l: "Este mês"
  }, {
    k: "custom",
    l: "Personalizado"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 rounded-full bg-muted p-1", children: opts.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPreset(o.k), className: "rounded-full px-3 py-1.5 text-xs font-bold transition " + (preset === o.k ? "bg-brand text-brand-foreground shadow" : "text-foreground/70 hover:text-foreground"), children: o.l }, o.k)) }),
    preset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: customFrom, onChange: (e) => setCustomFrom(e.target.value), className: "rounded-lg border border-border bg-background px-2 py-1.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "até" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: customTo, onChange: (e) => setCustomTo(e.target.value), className: "rounded-lg border border-border bg-background px-2 py-1.5" })
    ] })
  ] });
}
const $$splitComponentImporter$c = () => import("./admin.dashboard.produtos-CaC_Di2I.mjs");
const Route$c = createFileRoute("/admin/dashboard/produtos")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin.dashboard.pedidos-V179fzc7.mjs");
const Route$b = createFileRoute("/admin/dashboard/pedidos")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./admin.dashboard.pagamentos-DLhA_dxY.mjs");
const Route$a = createFileRoute("/admin/dashboard/pagamentos")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.dashboard.horarios-Dg73jnEn.mjs");
const Route$9 = createFileRoute("/admin/dashboard/horarios")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.dashboard.gateways-DlDkkU4w.mjs");
const Route$8 = createFileRoute("/admin/dashboard/gateways")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin.dashboard.financeiro-6G3GGJ4J.mjs");
const Route$7 = createFileRoute("/admin/dashboard/financeiro")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.dashboard.cupons-ChvyaWbK.mjs");
const Route$6 = createFileRoute("/admin/dashboard/cupons")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./admin.dashboard.configuracoes-DyYMYKh9.mjs");
const Route$5 = createFileRoute("/admin/dashboard/configuracoes")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.dashboard.clientes-DzCTkzNi.mjs");
const Route$4 = createFileRoute("/admin/dashboard/clientes")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.dashboard.categorias-CTUdT2li.mjs");
const Route$3 = createFileRoute("/admin/dashboard/categorias")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.dashboard.cardapio-DwYADsIN.mjs");
const Route$2 = createFileRoute("/admin/dashboard/cardapio")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.dashboard.auditoria-fRzv6gL6.mjs");
const Route$1 = createFileRoute("/admin/dashboard/auditoria")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.dashboard.financeiro.dre-CTeuQ-yq.mjs");
const Route = createFileRoute("/admin/dashboard/financeiro/dre")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TermosRoute = Route$q.update({
  id: "/termos",
  path: "/termos",
  getParentRoute: () => Route$r
});
const RastreioRoute = Route$p.update({
  id: "/rastreio",
  path: "/rastreio",
  getParentRoute: () => Route$r
});
const PrivacidadeRoute = Route$o.update({
  id: "/privacidade",
  path: "/privacidade",
  getParentRoute: () => Route$r
});
const PerfilRoute = Route$n.update({
  id: "/perfil",
  path: "/perfil",
  getParentRoute: () => Route$r
});
const HistoricoRoute = Route$m.update({
  id: "/historico",
  path: "/historico",
  getParentRoute: () => Route$r
});
const FuncionamentoRoute = Route$l.update({
  id: "/funcionamento",
  path: "/funcionamento",
  getParentRoute: () => Route$r
});
const EnderecosRoute = Route$k.update({
  id: "/enderecos",
  path: "/enderecos",
  getParentRoute: () => Route$r
});
const ContatoRoute = Route$j.update({
  id: "/contato",
  path: "/contato",
  getParentRoute: () => Route$r
});
const AdminRoute = Route$i.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$r
});
const IndexRoute = Route$h.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$r
});
const AdminIndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const AdminDashboardRoute = Route$f.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AdminRoute
});
const AdminDashboardWhatsappRoute = Route$e.update({
  id: "/whatsapp",
  path: "/whatsapp",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardVisaoRoute = Route$d.update({
  id: "/visao",
  path: "/visao",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardProdutosRoute = Route$c.update({
  id: "/produtos",
  path: "/produtos",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardPedidosRoute = Route$b.update({
  id: "/pedidos",
  path: "/pedidos",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardPagamentosRoute = Route$a.update({
  id: "/pagamentos",
  path: "/pagamentos",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardHorariosRoute = Route$9.update({
  id: "/horarios",
  path: "/horarios",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardGatewaysRoute = Route$8.update({
  id: "/gateways",
  path: "/gateways",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardFinanceiroRoute = Route$7.update({
  id: "/financeiro",
  path: "/financeiro",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardCuponsRoute = Route$6.update({
  id: "/cupons",
  path: "/cupons",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardConfiguracoesRoute = Route$5.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardClientesRoute = Route$4.update({
  id: "/clientes",
  path: "/clientes",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardCategoriasRoute = Route$3.update({
  id: "/categorias",
  path: "/categorias",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardCardapioRoute = Route$2.update({
  id: "/cardapio",
  path: "/cardapio",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardAuditoriaRoute = Route$1.update({
  id: "/auditoria",
  path: "/auditoria",
  getParentRoute: () => AdminDashboardRoute
});
const AdminDashboardFinanceiroDreRoute = Route.update({
  id: "/dre",
  path: "/dre",
  getParentRoute: () => AdminDashboardFinanceiroRoute
});
const AdminDashboardFinanceiroRouteChildren = {
  AdminDashboardFinanceiroDreRoute
};
const AdminDashboardFinanceiroRouteWithChildren = AdminDashboardFinanceiroRoute._addFileChildren(
  AdminDashboardFinanceiroRouteChildren
);
const AdminDashboardRouteChildren = {
  AdminDashboardAuditoriaRoute,
  AdminDashboardCardapioRoute,
  AdminDashboardCategoriasRoute,
  AdminDashboardClientesRoute,
  AdminDashboardConfiguracoesRoute,
  AdminDashboardCuponsRoute,
  AdminDashboardFinanceiroRoute: AdminDashboardFinanceiroRouteWithChildren,
  AdminDashboardGatewaysRoute,
  AdminDashboardHorariosRoute,
  AdminDashboardPagamentosRoute,
  AdminDashboardPedidosRoute,
  AdminDashboardProdutosRoute,
  AdminDashboardVisaoRoute,
  AdminDashboardWhatsappRoute
};
const AdminDashboardRouteWithChildren = AdminDashboardRoute._addFileChildren(
  AdminDashboardRouteChildren
);
const AdminRouteChildren = {
  AdminDashboardRoute: AdminDashboardRouteWithChildren,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  ContatoRoute,
  EnderecosRoute,
  FuncionamentoRoute,
  HistoricoRoute,
  PerfilRoute,
  PrivacidadeRoute,
  RastreioRoute,
  TermosRoute
};
const routeTree = Route$r._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  PeriodFilter as P,
  router as r
};
