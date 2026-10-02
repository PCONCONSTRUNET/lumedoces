import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Header, W as WhatsAppIcon, C as CartDrawer } from "./CartDrawer-BMuulltj.mjs";
import { C as CartProvider } from "./cart-CsSEv74G.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { J as Instagram, P as MapPin, s as Clock } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./useBusinessStatus-BBSRvrw0.mjs";
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
const WPP = "5548996915303";
const WPP_LABEL = "48 99691-5303";
const IG = "nutrindomomentosc";
const ENDERECO = "Lauro Müller, Santa Catarina (KM1 ATRAS DO FUBICA CAR)";
const HORARIOS = [{
  dia: "Terça a Quinta",
  hora: "19:00 – 00:00"
}, {
  dia: "Sexta e Sábado",
  hora: "19:00 – 01:15"
}, {
  dia: "Domingo",
  hora: "19:00 – 00:00"
}, {
  dia: "Segunda-feira",
  hora: "Fechado"
}];
function ContatoPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-foreground tracking-tight", children: "Contato" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-foreground/70", children: "Fale com a gente ou venha nos visitar." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://wa.me/${WPP}`, target: "_blank", rel: "noreferrer", className: "group rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-foreground", children: "WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/70", children: WPP_LABEL })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-foreground/60", children: "Toque para abrir uma conversa." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://instagram.com/${IG}`, target: "_blank", rel: "noreferrer", className: "group rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full bg-pink-100 text-pink-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-foreground", children: "Instagram" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground/70", children: [
                "@",
                IG
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-foreground/60", children: "Veja novidades e cardápio." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.google.com/maps/place/28%C2%B024'22.9%22S+49%C2%B024'25.2%22W/@-28.4063492,-49.407153,20.75z/data=!4m4!3m3!8m2!3d-28.4063606!4d-49.4069977", target: "_blank", rel: "noreferrer", className: "sm:col-span-2 group rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-foreground", children: "Endereço" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/70", children: ENDERECO })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-foreground/60", children: "Toque para abrir no Google Maps." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 rounded-2xl border border-border bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-foreground", children: "Horário de atendimento" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid gap-1", children: HORARIOS.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: h.dia }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${h.hora === "Fechado" ? "text-red-500" : "text-foreground"}`, children: h.hora })
          ] }, h.dia)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] }) });
}
export {
  ContatoPage as component
};
