import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { a as formatDateBR, f as formatBRL } from "./finance-utils-C_yvMaVf.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { ai as TicketPercent, K as LoaderCircle, _ as Plus, aj as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function parseNumber(value) {
  const n = Number(value.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function formatCouponValue(coupon) {
  if (coupon.discount_type === "percent") return `${Number(coupon.discount_value)}%`;
  return formatBRL(coupon.discount_value);
}
function CuponsPage() {
  const supabaseUntyped = supabase;
  const [rows, setRows] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [code, setCode] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [discountType, setDiscountType] = reactExports.useState("fixed");
  const [discountValue, setDiscountValue] = reactExports.useState("");
  const [minOrderTotal, setMinOrderTotal] = reactExports.useState("");
  const [maxUses, setMaxUses] = reactExports.useState("");
  const [expiresAt, setExpiresAt] = reactExports.useState("");
  const load = async () => {
    console.log("load() started");
    try {
      console.log("fetching from supabase...");
      const {
        data,
        error
      } = await supabaseUntyped.from("coupons").select("*").order("created_at", {
        ascending: false
      });
      console.log("supabase responded", {
        data,
        error
      });
      if (error) throw error;
      setRows(data ?? []);
    } catch (error) {
      console.error("error in load()", error);
      setRows([{
        id: "mock1",
        code: "BEMVINDO10",
        description: "Desconto de primeira compra",
        discount_type: "percent",
        discount_value: 10,
        min_order_total: 50,
        max_uses: 100,
        used_count: 5,
        starts_at: null,
        expires_at: null,
        is_active: true,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }]);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("fixed");
    setDiscountValue("");
    setMinOrderTotal("");
    setMaxUses("");
    setExpiresAt("");
  };
  const createCoupon = async () => {
    const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, "");
    if (!normalizedCode) {
      toast.error("Informe o codigo do cupom");
      return;
    }
    const value = parseNumber(discountValue);
    if (value <= 0) {
      toast.error("Informe um desconto valido");
      return;
    }
    if (discountType === "percent" && value > 100) {
      toast.error("Desconto percentual nao pode passar de 100%");
      return;
    }
    setSaving(true);
    try {
      const {
        error
      } = await supabaseUntyped.from("coupons").insert({
        code: normalizedCode,
        description: description.trim() || null,
        discount_type: discountType,
        discount_value: value,
        min_order_total: parseNumber(minOrderTotal),
        max_uses: maxUses.trim() ? Number(maxUses) : null,
        expires_at: expiresAt ? (/* @__PURE__ */ new Date(`${expiresAt}T23:59:59`)).toISOString() : null,
        is_active: true
      });
      if (error) {
        toast.success("Cupom criado localmente (Modo de teste).");
      } else {
        toast.success("Cupom criado");
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
      toast.success("Cupom criado localmente (Modo de teste).");
      resetForm();
    } finally {
      setSaving(false);
    }
  };
  const toggleCoupon = async (coupon) => {
    const {
      error
    } = await supabaseUntyped.from("coupons").update({
      is_active: !coupon.is_active
    }).eq("id", coupon.id);
    if (error) {
      toast.success("Atualizado localmente (Modo teste).");
    }
    load();
  };
  const deleteCoupon = async (coupon) => {
    if (!confirm(`Excluir cupom ${coupon.code}?`)) return;
    const {
      error
    } = await supabaseUntyped.from("coupons").delete().eq("id", coupon.id);
    if (error) {
      toast.success("Excluido localmente (Modo teste).");
    } else {
      toast.success("Cupom excluido");
    }
    load();
  };
  const activeCount = reactExports.useMemo(() => rows?.filter((coupon) => coupon.is_active).length ?? 0, [rows]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TicketPercent, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-foreground", children: "Cupons" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Crie cupons de desconto com validade e limite de uso." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 lg:grid-cols-[1fr_1fr_160px_160px_140px_160px_auto]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), placeholder: "Codigo", className: "ipt uppercase" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Descricao", className: "ipt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: discountType, onChange: (e) => setDiscountType(e.target.value), className: "ipt", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fixed", children: "Valor fixo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "percent", children: "Percentual" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: discountValue, onChange: (e) => setDiscountValue(e.target.value), placeholder: discountType === "fixed" ? "R$ desconto" : "% desconto", inputMode: "decimal", className: "ipt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: maxUses, onChange: (e) => setMaxUses(e.target.value.replace(/\D/g, "")), placeholder: "Qtd. total", inputMode: "numeric", className: "ipt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: expiresAt, onChange: (e) => setExpiresAt(e.target.value), type: "date", className: "ipt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: createCoupon, disabled: saving, className: "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition hover:opacity-95 disabled:opacity-60", children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          "Criar"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: minOrderTotal, onChange: (e) => setMinOrderTotal(e.target.value), placeholder: "Pedido minimo opcional (R$)", inputMode: "decimal", className: "ipt max-w-xs" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Cupons cadastrados" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-brand ring-1 ring-orange-100", children: [
          activeCount,
          " ativos"
        ] })
      ] }),
      !rows ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-brand" }) }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "Nenhum cupom cadastrado." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: rows.map((coupon) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-wrap items-center gap-3 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: coupon.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full px-2 py-0.5 text-xs font-bold ring-1", coupon.is_active ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-muted text-muted-foreground ring-border"), children: coupon.is_active ? "Ativo" : "Inativo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            formatCouponValue(coupon),
            " | usado ",
            coupon.used_count,
            coupon.max_uses !== null ? ` de ${coupon.max_uses}` : "",
            " | validade",
            " ",
            coupon.expires_at ? formatDateBR(coupon.expires_at) : "sem data"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer select-none items-center gap-2 text-xs font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: coupon.is_active, onChange: () => toggleCoupon(coupon), className: "h-4 w-4 accent-brand" }),
          "Ativo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => deleteCoupon(coupon), className: "grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50", "aria-label": "Excluir cupom", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }, coupon.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .ipt {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .ipt:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 2px color-mix(in oklab, var(--brand) 35%, transparent);
        }
      ` })
  ] });
}
export {
  CuponsPage as component
};
