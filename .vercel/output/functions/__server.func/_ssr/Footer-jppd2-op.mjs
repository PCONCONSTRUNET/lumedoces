import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { l as logoImage } from "./logo_lume-9BuO-Xgn.mjs";
import { W as WhatsAppIcon } from "./CartDrawer-BMuulltj.mjs";
import { u as useBusinessStatus } from "./useBusinessStatus-BBSRvrw0.mjs";
import { J as Instagram, Z as Phone, O as Mail, s as Clock, P as MapPin, y as FileText, a9 as Shield } from "../_libs/lucide-react.mjs";
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
function formatWeeklyHours(hours) {
  if (!hours || hours.length === 0) return ["Carregando..."];
  const groups = [];
  const sorted = [...hours].sort((a, b) => a.day_of_week - b.day_of_week);
  sorted.forEach((h) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.isClosed === h.is_closed && lastGroup.is24h === h.is_24h && lastGroup.open === h.open_time && lastGroup.close === h.close_time) {
      lastGroup.days.push(DAYS[h.day_of_week]);
    } else {
      groups.push({
        days: [DAYS[h.day_of_week]],
        open: h.open_time,
        close: h.close_time,
        isClosed: h.is_closed,
        is24h: !!h.is_24h
      });
    }
  });
  return groups.filter((g) => !g.isClosed).map((g) => {
    const daysStr = g.days.length > 2 ? `${g.days[0]} a ${g.days[g.days.length - 1]}` : g.days.join(" e ");
    if (g.is24h) return `${daysStr}: Aberto 24 horas`;
    return `${daysStr}: ${g.open.slice(0, 5)} às ${g.close.slice(0, 5)}`;
  });
}
function Footer() {
  const { allHours } = useBusinessStatus();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-brand text-white/90 py-12 px-4 sm:px-6 lg:px-8 mt-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 rounded-xl inline-block w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoImage, alt: "Lume Doces", className: "w-24 h-auto object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/80 mt-2 font-medium", children: "Lume Artesanais" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://www.instagram.com/lumeartesanaisc/", target: "_blank", rel: "noopener noreferrer", className: "bg-white/10 p-2 rounded-full text-white/80 hover:text-white hover:bg-[#E1306C] transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/5548996915303`, target: "_blank", rel: "noopener noreferrer", className: "bg-white/10 p-2 rounded-full text-white/80 hover:text-white hover:bg-[#25D366] transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "w-4 h-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-lg", children: "Contato" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:5548996915303", className: "flex items-center space-x-3 hover:text-white/80 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-amber-200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "(48) 99691-5303 (WhatsApp)" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:lumeartesanaisc@gmail.com", className: "flex items-center space-x-3 hover:text-white/80 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 text-amber-200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "lumeartesanaisc@gmail.com" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-lg", children: "Funcionamento e Entrega com Retirada no Local" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start space-x-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-amber-200 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", children: formatWeeklyHours(allHours).map((line, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: line }, idx)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start space-x-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-amber-200 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Entregamos em toda a região. Consulte as taxas no momento da compra." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-lg", children: "Links Úteis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/termos", className: "flex items-center space-x-3 hover:text-white/80 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-amber-200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Termos de Uso" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/privacidade", className: "flex items-center space-x-3 hover:text-white/80 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-amber-200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Política de Privacidade" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/funcionamento", className: "flex items-center space-x-3 hover:text-white/80 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-amber-200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Horários e Entrega com Retirada no Local" })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Lume Doces. Todos os direitos reservados."
    ] }) })
  ] });
}
export {
  Footer as F
};
