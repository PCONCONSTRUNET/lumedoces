import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, b as DialogFooter } from "./dialog-BeIewlnY.mjs";
import { ah as Tags, _ as Plus, K as LoaderCircle, G as GripVertical, aj as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function CategoriasPage() {
  const [rows, setRows] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [draggingId, setDraggingId] = reactExports.useState(null);
  const [dragOverId, setDragOverId] = reactExports.useState(null);
  const load = async () => {
    setTimeout(() => {
      setRows([{
        id: "doces",
        name: "Doces Saudáveis",
        sort_order: 1,
        is_active: true
      }, {
        id: "salgados",
        name: "Snacks Saudáveis",
        sort_order: 2,
        is_active: true
      }, {
        id: "bebidas",
        name: "Bebidas Naturais",
        sort_order: 3,
        is_active: true
      }]);
    }, 300);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const onCreate = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (name.length > 80) {
      toast.error("Nome muito longo");
      return;
    }
    setSaving(true);
    const {
      error
    } = await supabase.from("categories").insert({
      name,
      sort_order: (rows?.length ?? 0) + 1
    });
    setSaving(false);
    if (error) {
      toast.error("Não foi possível criar");
      return;
    }
    setNewName("");
    setOpen(false);
    toast.success("Categoria criada");
    load();
  };
  const onToggle = async (c) => {
    await supabase.from("categories").update({
      is_active: !c.is_active
    }).eq("id", c.id);
    load();
  };
  const onRename = async (c, name) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === c.name) return;
    await supabase.from("categories").update({
      name: trimmed
    }).eq("id", c.id);
    load();
  };
  const saveCategoryOrder = async (ordered) => {
    const normalized = ordered.map((c, i) => ({
      ...c,
      sort_order: i + 1
    }));
    setRows(normalized);
    const results = await Promise.all(normalized.map((c) => supabase.from("categories").update({
      sort_order: c.sort_order
    }).eq("id", c.id)));
    if (results.some((r) => r.error)) {
      toast.error("Não foi possível salvar a ordem");
      load();
      return;
    }
    toast.success("Ordem atualizada");
  };
  const reorderCategory = async (fromIndex, toIndex) => {
    if (!rows) return;
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const next = [...rows];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    await saveCategoryOrder(next);
  };
  const onDelete = async (c) => {
    if (!confirm(`Excluir "${c.name}"? Produtos ficarão sem categoria.`)) return;
    const {
      error
    } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) {
      toast.error("Não foi possível excluir");
      return;
    }
    toast.success("Categoria excluída");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tags, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-foreground", children: "Categorias" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Organize seus produtos por categoria." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Nova categoria"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60", children: !rows ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-brand" }) }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground py-8", children: 'Nenhuma categoria. Clique em "Nova categoria" para criar.' }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: rows.map((c, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { draggable: true, onDragStart: (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      setDraggingId(c.id);
    }, onDragOver: (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverId(c.id);
    }, onDrop: (e) => {
      e.preventDefault();
      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      setDraggingId(null);
      setDragOverId(null);
      void reorderCategory(fromIndex, index);
    }, onDragEnd: () => {
      setDraggingId(null);
      setDragOverId(null);
    }, className: `flex items-center gap-3 py-2 transition ${draggingId === c.id ? "opacity-45" : ""} ${dragOverId === c.id && draggingId !== c.id ? "bg-brand/5 ring-1 ring-inset ring-brand/20" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-8 w-8 cursor-grab place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing", "aria-label": "Arrastar categoria", title: "Arrastar para ordenar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: c.name, onBlur: (e) => onRename(c, e.target.value), className: "flex-1 bg-transparent px-2 py-1.5 text-sm rounded focus:bg-muted focus:outline-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs font-medium cursor-pointer select-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: c.is_active, onChange: () => onToggle(c), className: "h-4 w-4 accent-brand" }),
        "Ativa"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDelete(c), className: "grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50", "aria-label": "Excluir", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }, c.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "w-[calc(100vw-2rem)] sm:max-w-md p-4 sm:p-6 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nova categoria" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onCreate, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold text-foreground/80", children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, value: newName, onChange: (e) => setNewName(e.target.value), maxLength: 80, placeholder: "Ex: Salgados, Bebidas, Doces", className: "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOpen(false), className: "inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm font-bold hover:bg-muted/70 transition", children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: saving || !newName.trim(), className: "inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-50 transition", children: [
            saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            "Criar"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CategoriasPage as component
};
