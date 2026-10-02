import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
import { O as Mail, M as Lock, K as LoaderCircle } from "../_libs/lucide-react.mjs";
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
const banner = "/assets/banner-BZAmTEwK.png";
function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.auth.getUser();
      if (!data.user) return;
      const {
        data: isAdmin
      } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin"
      });
      if (isAdmin) navigate({
        to: "/admin/dashboard",
        replace: true
      });
    })();
  }, [navigate]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (error || !data.user) {
        toast.error("Credenciais inválidas");
        setLoading(false);
        return;
      }
      const {
        data: isAdmin,
        error: roleErr
      } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin"
      });
      if (roleErr) {
        console.error(roleErr);
        toast.error("Erro ao verificar permissão.");
        return;
      }
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast.error("Esta conta não tem permissão de admin.");
        return;
      }
      toast.success("Bem-vindo!");
      navigate({
        to: "/admin/dashboard",
        replace: true
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex items-center justify-center px-4 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: banner, className: "w-full h-full object-cover opacity-30", alt: "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-cream/80 backdrop-blur-[2px]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-border relative z-10 flex flex-col justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl text-brand", children: "ADMIN" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/70", children: "Acesso restrito — Lume Artesanais" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-bold text-foreground/80", children: "E-mail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full rounded-full border border-border bg-white shadow-sm py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-highlight/40", placeholder: "voce@email.com" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-bold text-foreground/80", children: "Senha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full rounded-full border border-border bg-white shadow-sm py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-highlight/40", placeholder: "••••••••" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-highlight px-6 py-3.5 text-sm font-bold text-white shadow-md hover:opacity-95 disabled:opacity-60 transition tracking-wide", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          " Entrando..."
        ] }) : "ENTRAR" })
      ] })
    ] })
  ] });
}
export {
  AdminLogin as component
};
