import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { n as CircleAlert, a3 as Save } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function GatewaysPage() {
  const [loading, setLoading] = reactExports.useState(false);
  const [mpActive, setMpActive] = reactExports.useState(false);
  const [mpPublicKey, setMpPublicKey] = reactExports.useState("APP_USR-1d786b23-acce-4857-ad97-418949e7feda");
  const [mpAccessToken, setMpAccessToken] = reactExports.useState("APP_USR-4237224829653865-092216-8e53ce9edb6626294e6063076c652336-3700302220");
  const [mpClientId, setMpClientId] = reactExports.useState("4237224829653865");
  const [mpClientSecret, setMpClientSecret] = reactExports.useState("BI42nLRuxYddLfjVI9RxiEoGpO3kgT8V");
  reactExports.useEffect(() => {
    const load = async () => {
      try {
        const {
          data
        } = await supabase.from("app_config").select("value").eq("key", "mp_gateway_config").maybeSingle();
        if (data?.value) {
          const config = data.value;
          setMpActive(config.active || false);
          if (config.publicKey) setMpPublicKey(config.publicKey);
          if (config.accessToken) setMpAccessToken(config.accessToken);
          if (config.clientId) setMpClientId(config.clientId);
          if (config.clientSecret) setMpClientSecret(config.clientSecret);
          localStorage.setItem("mp_gateway_config", JSON.stringify(config));
          return;
        }
      } catch (e) {
      }
      const saved = localStorage.getItem("mp_gateway_config");
      if (saved) {
        try {
          const config = JSON.parse(saved);
          setMpActive(config.active || false);
          if (config.publicKey) setMpPublicKey(config.publicKey);
          if (config.accessToken) setMpAccessToken(config.accessToken);
          if (config.clientId) setMpClientId(config.clientId);
          if (config.clientSecret) setMpClientSecret(config.clientSecret);
        } catch (e) {
        }
      }
    };
    load();
  }, []);
  const handleSave = async () => {
    setLoading(true);
    const config = {
      active: mpActive,
      publicKey: mpPublicKey,
      accessToken: mpAccessToken,
      clientId: mpClientId,
      clientSecret: mpClientSecret
    };
    try {
      await supabase.from("app_config").upsert({
        key: "mp_gateway_config",
        value: config,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      localStorage.setItem("mp_gateway_config", JSON.stringify(config));
      toast.success("Configurações do Mercado Pago salvas com sucesso!");
    } catch (e) {
      localStorage.setItem("mp_gateway_config", JSON.stringify(config));
      toast.success("Configurações salvas localmente!");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl font-extrabold text-gray-900", children: "Gateways de Pagamento" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Configure os meios de pagamento para receber dos seus clientes automaticamente." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-gray-100 bg-gray-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#009EE3]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#009EE3] font-black text-xl", children: "mp" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Mercado Pago" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Aceite Pix, Cartões e Boleto" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-700", children: "Ativar no Checkout" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "sr-only peer", checked: mpActive, onChange: (e) => setMpActive(e.target.checked) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-blue-50 p-4 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-blue-600 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-blue-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold mb-1", children: "Como conseguir as credenciais?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: 'Acesse o painel de desenvolvedores do Mercado Pago, vá em "Suas integrações" e copie a Public Key e Access Token (Credenciais de Produção).' })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700", children: "Public Key" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: mpPublicKey, onChange: (e) => setMpPublicKey(e.target.value), placeholder: "APP_USR-...", className: "w-full rounded-xl border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm px-4 py-2 border" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700", children: "Access Token" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: mpAccessToken, onChange: (e) => setMpAccessToken(e.target.value), placeholder: "APP_USR-...", className: "w-full rounded-xl border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm px-4 py-2 border" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700", children: "Client ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: mpClientId, onChange: (e) => setMpClientId(e.target.value), placeholder: "Ex: 4237224829653865", className: "w-full rounded-xl border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm px-4 py-2 border" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700", children: "Client Secret" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: mpClientSecret, onChange: (e) => setMpClientSecret(e.target.value), placeholder: "Ex: BI42nLRuxYddLfjVI9RxiEoGpO3kgT8V", className: "w-full rounded-xl border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm px-4 py-2 border" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-gray-100 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, disabled: loading, className: "flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand/90 transition-colors disabled:opacity-50", children: loading ? "Salvando..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          "Salvar Configurações"
        ] }) }) })
      ] })
    ] }) })
  ] });
}
export {
  GatewaysPage as component
};
