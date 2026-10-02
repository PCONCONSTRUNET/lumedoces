import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { H as Header, C as CartDrawer } from "./CartDrawer-BMuulltj.mjs";
import { F as Footer } from "./Footer-jppd2-op.mjs";
import { C as CartProvider } from "./cart-CsSEv74G.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { u as useBusinessStatus } from "./useBusinessStatus-BBSRvrw0.mjs";
import { A as ArrowLeft, s as Clock, P as MapPin, Z as Phone } from "../_libs/lucide-react.mjs";
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
import "./logo_lume-9BuO-Xgn.mjs";
import "./PaymentLabel-C4dSyJxL.mjs";
import "./client-c5Xru2R-.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./order-utils-DIKjTF50.mjs";
function FuncionamentoPage() {
  const {
    allHours,
    loading
  } = useBusinessStatus();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 max-w-4xl mx-auto w-full px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center text-amber-600 hover:text-amber-700 mb-8 font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        "Voltar para a página inicial"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-zinc-900 mb-8", children: "Funcionamento e Entrega com Retirada no Local" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-orange-50 p-6 rounded-xl border border-orange-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-4 text-orange-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-6 h-6 mr-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Horários" })
            ] }),
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 text-zinc-500", children: "Carregando horários..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 text-zinc-700", children: [1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
              const h = allHours.find((x) => x.day_of_week === dayNum);
              if (!h) return null;
              const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `flex justify-between ${dayNum !== 0 ? "border-b border-orange-200/50 pb-2" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: dayNames[dayNum] }),
                h.is_closed ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500", children: "Fechado" }) : h.is_24h ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand font-medium", children: "Aberto 24 horas" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  h.open_time.slice(0, 5),
                  " - ",
                  h.close_time.slice(0, 5)
                ] })
              ] }, dayNum);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-zinc-50 p-6 rounded-xl border border-zinc-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-4 text-emerald-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-6 h-6 mr-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Entrega com Retirada no Local" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-zinc-600 leading-relaxed", children: "Nós entregamos nossos doces e salgados em toda a região. As taxas de entrega variam de acordo com a distância e são calculadas automaticamente no momento de finalizar a sua compra." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-zinc-600 leading-relaxed mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Tempo estimado:" }),
                " Nossas entregas costumam levar entre 40 a 60 minutos, podendo variar de acordo com o clima e o trânsito da cidade."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-zinc-50 p-6 rounded-xl border border-zinc-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-4 text-blue-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-6 h-6 mr-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Contato" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-zinc-600", children: "Dúvidas sobre sua entrega?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-zinc-900 font-medium mt-1", children: "Chame no WhatsApp: (48) 99691-5303" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] }) });
}
export {
  FuncionamentoPage as component
};
