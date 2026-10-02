import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { K as LoaderCircle, z as Info, a8 as Settings2, am as Truck, ab as ShoppingBag, a3 as Save } from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function ConfiguracoesPage() {
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [settings, setSettings] = reactExports.useState({
    id: "",
    delivery_enabled: true,
    pickup_enabled: true,
    delivery_fee: 0
  });
  const [feeInput, setFeeInput] = reactExports.useState("0");
  reactExports.useEffect(() => {
    loadSettings();
  }, []);
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const {
        data,
        error: err
      } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
      if (err) {
        if (err.message.includes("Could not find the table")) {
          setError("A tabela 'store_settings' ainda não foi criada no banco de dados.");
        } else {
          throw err;
        }
      } else if (data) {
        setSettings(data);
        setFeeInput(data.delivery_fee.toString());
      } else {
        const {
          data: newData,
          error: insertErr
        } = await supabase.from("store_settings").insert({
          delivery_enabled: true,
          pickup_enabled: true,
          delivery_fee: 0
        }).select().single();
        if (!insertErr && newData) {
          setSettings(newData);
          setFeeInput("0");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedFee = parseFloat(feeInput.replace(",", "."));
      if (isNaN(parsedFee) || parsedFee < 0) {
        toast.error("Taxa de entrega inválida");
        setSaving(false);
        return;
      }
      const supabaseAny = supabase;
      let saveError = null;
      if (settings.id) {
        const {
          error: error2
        } = await supabaseAny.from("store_settings").update({
          delivery_enabled: settings.delivery_enabled,
          pickup_enabled: settings.pickup_enabled,
          delivery_fee: parsedFee,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", settings.id);
        saveError = error2;
      } else {
        const {
          data: newRow,
          error: error2
        } = await supabaseAny.from("store_settings").insert({
          delivery_enabled: settings.delivery_enabled,
          pickup_enabled: settings.pickup_enabled,
          delivery_fee: parsedFee
        }).select().single();
        if (newRow) setSettings((s) => ({
          ...s,
          id: newRow.id
        }));
        saveError = error2;
      }
      const err = saveError;
      if (err) throw err;
      setSettings((s) => ({
        ...s,
        delivery_fee: parsedFee
      }));
      toast.success("Configurações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-brand" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mx-auto mb-4 h-12 w-12 text-amber-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-xl font-bold text-amber-800", children: "Atenção!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-amber-700 max-w-lg mx-auto mb-6", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-amber-600", children: "Por favor, execute o script SQL de criação da tabela no Supabase para continuar." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Configurações da Loja" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Gerencie taxas, fretes e opções de retirada" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-gray-900 mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-brand" }),
          " Opções de Entrega e Retirada"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${settings.pickup_enabled ? "bg-brand/10 text-brand" : "bg-gray-100 text-gray-400"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900", children: "Retirada no Local" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Permitir que clientes busquem o pedido no estabelecimento" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex h-6 w-11 items-center rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "sr-only peer", checked: settings.pickup_enabled, onChange: (e) => setSettings({
                ...settings,
                pickup_enabled: e.target.checked
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${settings.delivery_enabled ? "bg-brand/10 text-brand" : "bg-gray-100 text-gray-400"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900", children: "Entrega Delivery" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Realizar entregas de pedidos no endereço do cliente" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex h-6 w-11 items-center rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "sr-only peer", checked: settings.delivery_enabled, onChange: (e) => setSettings({
                ...settings,
                delivery_enabled: e.target.checked
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand" })
            ] })
          ] }),
          settings.delivery_enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 pl-14 animate-in fade-in slide-in-from-top-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Taxa de Entrega Fixa" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-medium", children: "R$" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", min: "0", value: feeInput, onChange: (e) => setFeeInput(e.target.value), className: "w-32 rounded-xl border border-gray-200 bg-white px-3 py-2 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400 ml-2", children: "Ex: 5.00 ou 12.50" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 p-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saving, className: "flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand/90 disabled:opacity-50 shadow-sm", children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-5 w-5" }),
        saving ? "Salvando..." : "Salvar Configurações"
      ] }) })
    ] }) })
  ] });
}
export {
  ConfiguracoesPage as component
};
