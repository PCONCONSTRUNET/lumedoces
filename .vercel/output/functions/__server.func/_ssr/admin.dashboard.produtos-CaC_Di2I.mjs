import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, b as DialogFooter } from "./dialog-BeIewlnY.mjs";
import { U as Package, _ as Plus, K as LoaderCircle, I as ImagePlus, aj as Trash2, G as GripVertical, a3 as Save } from "../_libs/lucide-react.mjs";
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
const PRODUCT_IMAGES_BUCKET = "product-images";
function formatBRL(v) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
function parsePrice(s) {
  const n = Number(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function safeFileName(name) {
  const ext = name.split(".").pop()?.toLowerCase() || "png";
  return `${crypto.randomUUID()}.${ext.replace(/[^a-z0-9]/g, "") || "png"}`;
}
function ProdutosPage() {
  const [rows, setRows] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const load = async () => {
    setTimeout(() => {
      setRows([{
        id: "trufa-vegana",
        name: "Trufa Vegana de Chocolate",
        base_price: 8,
        is_active: true,
        category_id: "doces",
        categories: {
          name: "Doces Saudáveis"
        },
        image_url: "/src/assets/trufa_vegana.jpg"
      }, {
        id: "bolo-pote-vegano",
        name: "Bolo de Pote Cenoura e Cacau",
        base_price: 18,
        is_active: true,
        category_id: "doces",
        categories: {
          name: "Doces Saudáveis"
        },
        image_url: "/src/assets/bolo_pote_vegano.jpg"
      }, {
        id: "coxinha-vegana",
        name: "Mini Coxinhas Veganas",
        base_price: 24,
        is_active: true,
        category_id: "salgados",
        categories: {
          name: "Snacks Saudáveis"
        },
        image_url: "/src/assets/coxinha_vegana.jpg"
      }, {
        id: "kombucha-frutas",
        name: "Kombucha Frutas Vermelhas",
        base_price: 15,
        is_active: true,
        category_id: "bebidas",
        categories: {
          name: "Bebidas Naturais"
        },
        image_url: "/src/assets/kombucha.jpg"
      }]);
    }, 300);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const onToggle = async (p) => {
    toast.success("Status atualizado (Mock)");
    load();
  };
  const onDelete = async (p) => {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    toast.success("Produto excluído (Mock)");
    setRows((prev) => prev ? prev.filter((prod) => prod.id !== p.id) : null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-foreground", children: "Produtos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Cadastre e gerencie o cardápio." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Novo produto"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60", children: !rows ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-brand" }) }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground py-8", children: 'Nenhum produto cadastrado. Clique em "Novo produto" para começar.' }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: rows.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-4 py-4 px-2 hover:bg-gray-50 transition group rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-200", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-6 h-6" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground truncate", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
          p.categories?.name ?? "Sem categoria",
          " · ",
          formatBRL(Number(p.base_price))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs font-medium cursor-pointer select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: p.is_active, onChange: () => onToggle(), className: "h-4 w-4 accent-brand" }),
          "Ativo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          toast("Abrindo edição (Mock)");
        }, className: "flex items-center gap-1 h-8 px-3 rounded-md text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100", children: "Editar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDelete(p), className: "grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50", "aria-label": "Excluir", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }, p.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NovoProdutoDialog, { open, onOpenChange: setOpen, onCreated: () => {
      setOpen(false);
      load();
    } })
  ] });
}
function NovoProdutoDialog({
  open,
  onOpenChange,
  onCreated
}) {
  const [categories, setCategories] = reactExports.useState([]);
  const [saving, setSaving] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [basePrice, setBasePrice] = reactExports.useState("");
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState("");
  const [categoryId, setCategoryId] = reactExports.useState("");
  const [isActive, setIsActive] = reactExports.useState(true);
  const [variations, setVariations] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setBasePrice("");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setCategoryId("");
    setIsActive(true);
    setVariations([]);
    (async () => {
      const {
        data
      } = await supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order");
      setCategories(data ?? []);
    })();
  }, [open]);
  const onImageFileChange = (file) => {
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no maximo 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const uploadImage = async () => {
    if (!imageFile) return imageUrl.trim() || null;
    const path = `products/${safeFileName(imageFile.name)}`;
    const {
      error
    } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, imageFile, {
      cacheControl: "31536000",
      contentType: imageFile.type
    });
    if (error) throw error;
    const {
      data
    } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };
  const addVariation = () => setVariations((v) => [...v, {
    name: "",
    is_required: false,
    min_select: 0,
    max_select: 1,
    options: []
  }]);
  const updateVariation = (i, patch) => setVariations((v) => v.map((x, idx) => idx === i ? {
    ...x,
    ...patch
  } : x));
  const removeVariation = (i) => setVariations((v) => v.filter((_, idx) => idx !== i));
  const addOption = (vi) => updateVariation(vi, {
    options: [...variations[vi].options, {
      name: "",
      additional_price: "0,00"
    }]
  });
  const updateOption = (vi, oi, patch) => updateVariation(vi, {
    options: variations[vi].options.map((o, idx) => idx === oi ? {
      ...o,
      ...patch
    } : o)
  });
  const removeOption = (vi, oi) => updateVariation(vi, {
    options: variations[vi].options.filter((_, idx) => idx !== oi)
  });
  const onSave = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    for (const v of variations) {
      if (!v.name.trim()) return toast.error("Toda variação precisa de nome");
      if (v.options.length === 0) return toast.error(`Adicione opções para "${v.name}"`);
      for (const o of v.options) {
        if (!o.name.trim()) return toast.error(`Toda opção de "${v.name}" precisa de nome`);
      }
    }
    setSaving(true);
    try {
      const finalImageUrl = await uploadImage();
      const {
        data: product,
        error: prodErr
      } = await supabase.from("products").insert({
        name: name.trim(),
        description: description.trim() || null,
        base_price: parsePrice(basePrice),
        image_url: finalImageUrl,
        category_id: categoryId || null,
        is_active: isActive
      }).select("id").single();
      if (prodErr || !product) throw prodErr ?? new Error("Falha");
      for (let vi = 0; vi < variations.length; vi++) {
        const v = variations[vi];
        const {
          data: varRow,
          error: vErr
        } = await supabase.from("product_variations").insert({
          product_id: product.id,
          name: v.name.trim(),
          is_required: v.is_required,
          min_select: v.min_select,
          max_select: v.max_select,
          sort_order: vi
        }).select("id").single();
        if (vErr || !varRow) throw vErr ?? new Error("Falha");
        const optsPayload = v.options.map((o, oi) => ({
          variation_id: varRow.id,
          name: o.name.trim(),
          additional_price: parsePrice(o.additional_price),
          sort_order: oi
        }));
        const {
          error: oErr
        } = await supabase.from("product_variation_options").insert(optsPayload);
        if (oErr) throw oErr;
      }
      toast.success("Produto criado!");
      onCreated();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Novo produto" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome*", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), maxLength: 120, className: "ipt", placeholder: "Ex: Mini coxinha de frango", autoFocus: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Descrição", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), maxLength: 500, rows: 2, className: "ipt", placeholder: "Descrição curta" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Preço base (R$)*", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: basePrice, onChange: (e) => setBasePrice(e.target.value), inputMode: "decimal", className: "ipt", placeholder: "0,00" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Categoria", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: categoryId, onChange: (e) => setCategoryId(e.target.value), className: "ipt", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sem categoria" }),
            categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Imagem do produto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-background p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted ring-1 ring-border/60", children: imagePreview || imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imagePreview || imageUrl, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-8 w-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: (e) => onImageFileChange(e.target.files?.[0] ?? null), className: "block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-3 file:py-2 file:text-sm file:font-bold file:text-brand-foreground hover:file:opacity-95" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "PNG, JPG ou WebP ate 5MB. Se enviar arquivo, ele substitui a URL abaixo." }),
            imageFile && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onImageFileChange(null), className: "mt-2 text-xs font-bold text-red-600 hover:underline", children: "Remover imagem selecionada" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "URL da imagem (opcional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: imageUrl, onChange: (e) => setImageUrl(e.target.value), maxLength: 500, className: "ipt", placeholder: "https://..." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm font-medium cursor-pointer select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isActive, onChange: (e) => setIsActive(e.target.checked), className: "h-4 w-4 accent-brand" }),
          "Produto ativo"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Variações" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Ex: Tamanho, Recheio. Opções podem ter valor adicional." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addVariation, className: "inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-bold hover:bg-muted/70 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
            " Variação"
          ] })
        ] }),
        variations.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground py-3 text-center", children: "Sem variações — produto será vendido pelo preço base." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: variations.map((v, vi) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 p-3 bg-background/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground mt-2.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: v.name, onChange: (e) => updateVariation(vi, {
              name: e.target.value
            }), placeholder: "Nome da variação (ex: Tamanho)", maxLength: 60, className: "ipt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Mínimo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, value: v.min_select, onChange: (e) => updateVariation(vi, {
                  min_select: Number(e.target.value) || 0
                }), className: "ipt" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Máximo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: v.max_select, onChange: (e) => updateVariation(vi, {
                  max_select: Number(e.target.value) || 1
                }), className: "ipt" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 text-xs font-medium cursor-pointer select-none px-1 col-span-2 sm:col-span-1 sm:pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: v.is_required, onChange: (e) => updateVariation(vi, {
                  is_required: e.target.checked
                }), className: "h-4 w-4 accent-brand" }),
                "Obrigatório"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              v.options.map((o, oi) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_130px_auto] gap-2 items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: o.name, onChange: (e) => updateOption(vi, oi, {
                  name: e.target.value
                }), placeholder: "Opção (ex: Grande)", maxLength: 60, className: "ipt" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground", children: "+R$" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: o.additional_price, onChange: (e) => updateOption(vi, oi, {
                    additional_price: e.target.value
                  }), inputMode: "decimal", className: "ipt pl-12 text-right", placeholder: "0,00" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeOption(vi, oi), className: "grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50", "aria-label": "Remover opção", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
              ] }, oi)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => addOption(vi), className: "text-xs font-bold text-brand hover:underline inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                " Adicionar opção"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeVariation(vi), className: "grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50", "aria-label": "Remover variação", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }) }, vi)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onOpenChange(false), className: "inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm font-bold hover:bg-muted/70 transition", children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onSave, disabled: saving, className: "inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-60 transition", children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        "Salvar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
          .ipt {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
            background: var(--background);
            color: var(--foreground);
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
          }
          .ipt:focus {
            border-color: var(--brand);
            box-shadow: 0 0 0 2px color-mix(in oklab, var(--brand) 35%, transparent);
          }
        ` })
  ] }) });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold text-foreground/80", children: label }),
    children
  ] });
}
export {
  ProdutosPage as component
};
