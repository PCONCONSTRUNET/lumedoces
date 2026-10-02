import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { l as logoImage } from "./logo_lume-9BuO-Xgn.mjs";
import { K as LoaderCircle, A as ArrowLeft, aa as ShieldCheck, an as User, ab as ShoppingBag, l as ChevronRight, P as MapPin, q as CircleQuestionMark, N as LogOut } from "../_libs/lucide-react.mjs";
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
function PerfilPage() {
  useNavigate();
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [cpfInput, setCpfInput] = reactExports.useState("");
  const [loggingIn, setLoggingIn] = reactExports.useState(false);
  const [userData, setUserData] = reactExports.useState(null);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session: session2
      }
    }) => {
      setSession(session2);
      if (session2) {
        setUserData(session2.user.user_metadata);
      }
      setLoading(false);
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session2) => {
      setSession(session2);
      if (session2) {
        setUserData(session2.user.user_metadata);
      } else {
        setUserData(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 14);
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }
    setCpfInput(value);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const cpfDigits = cpfInput.replace(/\D/g, "");
    if (cpfDigits.length !== 11 && cpfDigits.length !== 14) {
      toast.error("Por favor, informe um CPF ou CNPJ válido.");
      return;
    }
    setLoggingIn(true);
    const email = `${cpfDigits}@cliente.lumedoces.com`;
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password: cpfDigits
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Usuário não encontrado. Se você é novo, faça um pedido para criar seu perfil automaticamente!");
        } else {
          toast.error("Erro ao fazer login: " + error.message);
        }
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setLoggingIn(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center bg-cream/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-brand" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-cream/30 pb-20 pt-8 px-4 sm:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "p-2 -ml-2 text-brand hover:bg-brand/10 rounded-full transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl font-extrabold text-highlight", children: "Meu Perfil" })
    ] }),
    !session ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center max-w-md mx-auto mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoImage, alt: "Lume Artesanais", className: "h-16 w-auto mx-auto mb-6 drop-shadow-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Falta pouco!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mb-8", children: "Identifique-se para acessar seus pedidos e dados salvos." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-6 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "CPF / CNPJ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: cpfInput, onChange: handleCpfChange, className: "block w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-lg", placeholder: "000.000.000-00" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-3 flex items-start gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 shrink-0 text-brand" }),
            "Seu acesso é criado automaticamente na sua primeira compra."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loggingIn || cpfInput.length < 14, className: "w-full flex items-center justify-center gap-2 bg-brand text-white font-bold text-lg py-4 px-4 rounded-xl hover:bg-brand/90 transition shadow-md disabled:opacity-50", children: loggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin" }) : "Continuar" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 bg-brand/10 rounded-full flex items-center justify-center text-brand text-3xl font-bold border-4 border-white shadow-sm shrink-0", children: userData?.full_name?.charAt(0).toUpperCase() || /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-10 w-10 text-brand/50" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col text-center sm:text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900", children: userData?.full_name || "Cliente Lume" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-gray-500 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "CPF: ",
              userData?.cpf || "Não informado"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: userData?.phone || "Não informado" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/historico", className: "flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 border-b border-gray-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-brand/10 rounded-xl text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800 text-lg", children: "Meus Pedidos" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-gray-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/enderecos", className: "flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 border-b border-gray-50 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-gray-100 rounded-xl text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800 text-lg", children: "Meus Endereços" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-gray-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/contato", className: "flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-blue-50 rounded-xl text-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800 text-lg", children: "Ajuda e Suporte" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-gray-400" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLogout, className: "w-full flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-rose-50 rounded-xl text-rose-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-rose-600 text-lg", children: "Sair da conta" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-gray-400" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 font-bold", children: "Lume Artesanais • Versão 1.0.0" }) })
    ] })
  ] }) });
}
export {
  PerfilPage as component
};
