import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { R as MessageCircle, ad as Smartphone, o as CircleCheck, $ as QrCode, n as CircleAlert, h as Check, a3 as Save } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const DEFAULT_MESSAGES = {
  confirmed: {
    active: true,
    text: "*[Mensagem Automática]*\n\nOlá {{nome_cliente}}! 🥳\n\nSeu pedido *#{{numero_pedido}}* foi recebido e confirmado com sucesso.\nValor Total: *{{valor_total}}*\n\nQualquer dúvida, estamos à disposição!"
  },
  preparing: {
    active: false,
    text: "*[Mensagem Automática]*\n\nBoa notícia {{nome_cliente}}! 👩‍🍳\n\nSeu pedido *#{{numero_pedido}}* acabou de entrar na cozinha e começou a ser preparado."
  },
  ready_for_pickup: {
    active: true,
    text: "*[Mensagem Automática]*\n\nOba, {{nome_cliente}}! 🛵\n\nSeu pedido *#{{numero_pedido}}* já está pronto e aguardando retirada no nosso balcão.\n\nBom apetite!"
  },
  out_for_delivery: {
    active: true,
    text: "*[Mensagem Automática]*\n\nOba, {{nome_cliente}}! 🛵\n\nSeu pedido *#{{numero_pedido}}* acabou de sair para entrega. Fique de olho, em breve chegará aí!\n\nBom apetite!"
  },
  cancelled: {
    active: true,
    text: "*[Mensagem Automática]*\n\nPoxa {{nome_cliente}}, infelizmente seu pedido *#{{numero_pedido}}* precisou ser cancelado. 😔\n\nSe precisar de ajuda, mande uma mensagem pra gente."
  }
};
const TABS = [{
  id: "confirmed",
  label: "Confirmado"
}, {
  id: "preparing",
  label: "Em Preparo"
}, {
  id: "ready_for_pickup",
  label: "Aguardando Retirada"
}, {
  id: "out_for_delivery",
  label: "Saiu p/ Entrega"
}, {
  id: "cancelled",
  label: "Cancelado"
}];
function WhatsappPage() {
  const [loading, setLoading] = reactExports.useState(false);
  const [connected, setConnected] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("confirmed");
  const [messages, setMessages] = reactExports.useState(DEFAULT_MESSAGES);
  reactExports.useEffect(() => {
    const saved = localStorage.getItem("whatsapp_full_config");
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setConnected(config.connected || false);
        if (config.messages) {
          setMessages({
            ...DEFAULT_MESSAGES,
            ...config.messages
          });
        }
      } catch (e) {
      }
    }
  }, []);
  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const config = {
      connected,
      messages
    };
    localStorage.setItem("whatsapp_full_config", JSON.stringify(config));
    setLoading(false);
    toast.success("Configurações do WhatsApp salvas com sucesso!");
  };
  const handleConnect = () => {
    setConnected(true);
    toast.success("WhatsApp conectado com sucesso!");
  };
  const handleDisconnect = () => {
    setConnected(false);
    toast.info("WhatsApp desconectado.");
  };
  const updateCurrentMessage = (field, value) => {
    setMessages((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };
  const currentMsg = messages[activeTab];
  const getPreviewText = (text) => {
    return text.replace(/{{nome_cliente}}/g, "João Silva").replace(/{{numero_pedido}}/g, "1042").replace(/{{valor_total}}/g, "R$ 45,90").replace(/\*(.*?)\*/g, "<strong>$1</strong>").replace(/_(.*?)_/g, "<em>$1</em>").replace(/~(.*?)~/g, "<del>$1</del>");
  };
  const insertVariable = (variable) => {
    updateCurrentMessage("text", currentMsg.text + ` {{${variable}}}`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl p-4 md:p-6 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 md:h-14 md:w-14 place-items-center rounded-2xl bg-green-100 text-green-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-6 w-6 md:h-7 md:w-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-2xl md:text-3xl font-extrabold text-gray-900", children: "Integração WhatsApp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 md:mt-2 text-xs md:text-sm text-gray-600", children: "Conecte seu WhatsApp e configure os textos que os clientes receberão em cada etapa do pedido." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[300px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 bg-gray-50/50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-bold text-gray-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4 text-gray-500" }),
          "Aparelho e Conexão"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 flex flex-col items-center text-center", children: connected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-500 mb-3 ring-8 ring-green-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-900", children: "Conectado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Seu WhatsApp está pronto para enviar mensagens." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleDisconnect, className: "mt-5 w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors", children: "Desconectar" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-100 p-3 rounded-2xl mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-24 w-24 text-gray-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base text-gray-900", children: "Aguardando QR Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Abra o WhatsApp, vá em Aparelhos Conectados e escaneie." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-lg bg-amber-50 p-2 text-[10px] text-amber-800 flex items-start gap-1.5 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Em breve o QR code real será gerado pela API do gateway de WhatsApp. (Simulação no botão abaixo)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleConnect, className: "mt-5 w-full rounded-xl bg-green-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-green-700 transition-colors", children: "Simular Leitura do QR Code" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 flex flex-col min-h-[500px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-x-auto border-b border-gray-100 bg-gray-50/50 scrollbar-hide", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab(tab.id), className: cn("px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2", activeTab === tab.id ? "border-brand text-brand bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"), children: tab.label }, tab.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row flex-1 p-5 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-800 text-base", children: "Mensagem" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-gray-600", children: "Ativo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "sr-only peer", checked: currentMsg.active, onChange: (e) => updateCurrentMessage("active", e.target.checked) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-[200px] flex flex-col rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand/40 transition-shadow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-wrap gap-1.5 items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase mr-1", children: "Variáveis:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => insertVariable("nome_cliente"), className: "text-[11px] font-mono bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-100 text-brand", children: "nome_cliente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => insertVariable("numero_pedido"), className: "text-[11px] font-mono bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-100 text-brand", children: "numero_pedido" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => insertVariable("valor_total"), className: "text-[11px] font-mono bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-100 text-brand", children: "valor_total" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: currentMsg.text, onChange: (e) => updateCurrentMessage("text", e.target.value), disabled: !currentMsg.active, className: "w-full flex-1 p-3 text-sm resize-none focus:outline-none disabled:bg-gray-50 disabled:text-gray-400", placeholder: "Digite a mensagem aqui..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-500", children: "Dica: Use *texto* para negrito, _texto_ para itálico e ~texto~ para riscado." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[280px] shrink-0 flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }),
              " Pré-visualização"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-[#efeae2] rounded-2xl border-4 border-gray-800 overflow-hidden relative shadow-inner min-h-[350px] flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#005c4b] px-3 py-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-full bg-white/20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-bold", children: "C" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-xs font-bold truncate", children: "Cliente Lume" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70 text-[9px]", children: "online" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-[0.06] bg-[url('https://i.pinimg.com/originals/8f/ba/cb/8fbacbd464e996966eb9d4a6b7a9c21e.jpg')] bg-repeat z-0 pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-3 flex flex-col justify-end z-10", children: currentMsg.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#d9fdd3] text-[#111b21] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[90%] self-end relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] leading-relaxed whitespace-pre-wrap break-words", dangerouslySetInnerHTML: {
                  __html: getPreviewText(currentMsg.text)
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end items-center gap-1 mt-1 -mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-gray-500", children: "14:32" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-blue-500" })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/80 p-3 rounded-xl text-center text-xs text-gray-500 mb-4 backdrop-blur-sm shadow-sm", children: "Lembrete Desativado" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-gray-50 border-t border-gray-100 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, disabled: loading, className: "flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand/90 transition-colors disabled:opacity-50", children: loading ? "Salvando..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          "Salvar Preferências"
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  WhatsappPage as component
};
