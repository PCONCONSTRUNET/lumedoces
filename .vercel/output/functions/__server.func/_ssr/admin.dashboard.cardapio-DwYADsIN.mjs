import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { j as useSensors, i as useSensor, D as DndContext, c as closestCenter, a as KeyboardSensor, P as PointerSensor } from "../_libs/dnd-kit__core.mjs";
import { S as SortableContext, v as verticalListSortingStrategy, a as arrayMove, s as sortableKeyboardCoordinates, u as useSortable } from "../_libs/dnd-kit__sortable.mjs";
import { C as CSS } from "../_libs/dnd-kit__utilities.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { i as imageCompression } from "../_libs/browser-image-compression.mjs";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, b as DialogFooter } from "./dialog-BeIewlnY.mjs";
import { a7 as Settings, g as ChartNoAxesColumn, _ as Plus, X as Pen, W as Pause, aj as Trash2, ar as X, K as LoaderCircle, I as ImagePlus, k as ChevronLeft, H as Heart, af as Star, ac as ShoppingCart, G as GripVertical, ag as Tag, E as EllipsisVertical, u as Copy } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, n as numberType, a as arrayType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/dnd-kit__accessibility.mjs";
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
const formSchema = objectType({
  name: stringType().min(1, "O nome é obrigatório").max(80),
  description: stringType().max(1e3).optional(),
  base_price: numberType().min(0, "Preço inválido"),
  category_id: stringType().min(1, "Selecione uma categoria"),
  image_url: stringType().optional()
});
function ProdutoWizard({ onClose, onSuccess, categories, initialData }) {
  const [step, setStep] = reactExports.useState(initialData ? 2 : 1);
  const [tipo, setTipo] = reactExports.useState("preparado");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [uploadingImage, setUploadingImage] = reactExports.useState(false);
  const totalSteps = 5;
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      base_price: initialData?.base_price || 0,
      category_id: initialData?.category_id || "",
      image_url: initialData?.image_url || ""
    }
  });
  const nextStep = async () => {
    if (step === 2) {
      const valid = await form.trigger(["name", "description"]);
      if (!valid) return;
    }
    if (step === 3) {
      const valid = await form.trigger(["base_price"]);
      if (!valid) return;
    }
    if (step < totalSteps) setStep((s) => s + 1);
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, compressedFile);
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
      form.setValue("image_url", publicUrlData.publicUrl);
      toast.success("Imagem enviada com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploadingImage(false);
    }
  };
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        const { error } = await supabase.from("products").update({
          name: data.name,
          description: data.description,
          base_price: data.base_price,
          category_id: data.category_id,
          image_url: data.image_url
        }).eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({
          name: data.name,
          description: data.description,
          base_price: data.base_price,
          category_id: data.category_id,
          image_url: data.image_url,
          is_active: true
        });
        if (error) throw error;
      }
      toast.success(initialData ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar produto");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in zoom-in-95 duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-6 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[28px] font-bold text-gray-900", children: step === 1 ? initialData ? "Editar produto" : "Criar produto" : initialData ? `Editar produto ${tipo}` : `Criar produto ${tipo}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onClose, className: "flex items-center gap-2 text-sm font-bold text-[#ff0000] hover:bg-red-50 px-3 py-1.5 rounded-md", children: [
          "Fechar ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-2", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#ff0000]" : "bg-gray-200"}` }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-12 mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), children: [
          step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900 mb-6", children: "Escolha um tipo de produto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTipo("preparado"), className: `text-left p-4 rounded-lg border-2 ${tipo === "preparado" ? "border-[#ff0000]" : "border-gray-200 hover:border-gray-300"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 text-sm", children: "Preparado" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-4 h-4 rounded-full border-[5px] ${tipo === "preparado" ? "border-[#ff0000]" : "border-gray-300 bg-white"}` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Produtos produzidos pela sua loja, como marmitas, bolos, lanches e etc." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTipo("industrializado"), className: `text-left p-4 rounded-lg border-2 ${tipo === "industrializado" ? "border-[#ff0000]" : "border-gray-200 hover:border-gray-300"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 text-sm", children: "Industrializado" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-4 h-4 rounded-full border-[5px] ${tipo === "industrializado" ? "border-[#ff0000]" : "border-gray-300 bg-white"}` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Produtos prontos que sua loja não produz, como chocolates, refrigerantes e etc." })
              ] })
            ] })
          ] }),
          step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-left-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Principais informações" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-gray-700 mb-1", children: "Nome do Produto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...form.register("name"), placeholder: "Ex: Bolo de Cenoura", className: "w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 outline-none" }),
              form.formState.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-xs mt-1", children: form.formState.errors.name.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-gray-700 mb-1", children: "Descrição" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { ...form.register("description"), rows: 4, placeholder: "Ex: Bolo fofinho com cobertura de brigadeiro...", className: "w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 outline-none resize-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-gray-700 mb-2", children: "Imagem do produto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                form.watch("image_url") && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.watch("image_url"), alt: "Preview", className: "w-16 h-16 rounded-md object-cover border border-gray-200" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 border border-[#ff0000] text-[#ff0000] font-semibold text-sm rounded-md px-4 py-2 hover:bg-red-50 cursor-pointer", children: [
                  uploadingImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-4 h-4" }),
                  uploadingImage ? "Enviando..." : "Adicionar imagem",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden", disabled: uploadingImage })
                ] })
              ] })
            ] })
          ] }),
          step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-left-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Valores e estoque" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-gray-700 mb-1", children: "Preço (R$)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  ...form.register("base_price", { valueAsNumber: true }),
                  className: "w-40 border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 outline-none"
                }
              ),
              form.formState.errors.base_price && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-xs mt-1", children: form.formState.errors.base_price.message })
            ] })
          ] }),
          step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-left-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900 mb-1", children: "Variações e Adicionais (Em breve)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800", children: "🚧 O cadastro de grupos de variações (ex: Sabores, Tamanhos) será adicionado em breve. O produto já pode ser salvo sem variações." })
          ] }),
          step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-left-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900 mb-1", children: "Disponível em:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-6 bg-gray-50/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-2", children: "Selecione uma categoria existente:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { ...form.register("category_id"), className: "w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] outline-none bg-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sem categoria" }),
                categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
              ] }),
              form.formState.errors.category_id && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-xs mt-1", children: form.formState.errors.category_id.message })
            ] })
          ] })
        ] }) }),
        step >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[290px] shrink-0 hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📱" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Preview do cliente — tempo real" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative border-[7px] border-gray-900 rounded-[2.8rem] h-[580px] w-[272px] mx-auto bg-white overflow-hidden shadow-2xl flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 rounded-b-2xl z-20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-52 shrink-0 bg-gradient-to-br from-pink-100 to-amber-100 flex items-center justify-center overflow-hidden", children: [
              form.watch("image_url") ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.watch("image_url"), alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "🍰" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-7 left-3 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 text-gray-700" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-7 right-3 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 text-gray-500" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 text-sm leading-snug flex-1", children: form.watch("name") || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 font-normal italic", children: "Nome do produto" }) }),
                form.watch("base_price") > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-[#ff0000] shrink-0", children: [
                  "R$ ",
                  Number(form.watch("base_price")).toFixed(2).replace(".", ",")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-3 h-3 ${s <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"}` }, s)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-500 ml-1", children: "4.0 (27)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-500 leading-relaxed", children: form.watch("description") || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: "A descrição vai aparecer aqui..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-100 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-700 mb-1.5", children: "Variações" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: ["P", "M", "G", "GG"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] font-bold px-2.5 py-1 rounded-full border ${s === "M" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600"}`, children: s }, s)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-gray-100 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#ff0000] rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-red-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-4 h-4 text-white" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-bold", children: form.watch("base_price") > 0 ? `Adicionar · R$ ${Number(form.watch("base_price")).toFixed(2).replace(".", ",")}` : "Adicionar ao carrinho" })
            ] }) })
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-200 p-4 bg-white flex justify-end gap-3 absolute bottom-0 w-full left-0 z-50", children: [
      (initialData ? step > 2 : step > 1) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStep((s) => s - 1), className: "border border-[#ff0000] text-[#ff0000] font-bold text-sm rounded-md px-6 py-2.5 hover:bg-red-50", children: "Voltar" }),
      step < totalSteps ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: nextStep, className: "bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5", children: "Continuar" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: form.handleSubmit(onSubmit), disabled: isSubmitting, className: "bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5 flex items-center gap-2", children: [
        isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
        initialData ? "Salvar produto" : "Criar produto"
      ] })
    ] })
  ] });
}
const comboSchema = objectType({
  name: stringType().min(1, "Nome do combo obrigatório").max(80),
  description: stringType().max(1e3).optional(),
  maxSelect: numberType().min(1, "O limite mínimo é 1"),
  totalPrice: numberType().min(0),
  discount: numberType().min(0).max(100),
  selectedProductIds: arrayType(stringType()).min(1, "Selecione pelo menos um produto")
});
function ComboWizard({ onClose, onSuccess, products }) {
  const [step, setStep] = reactExports.useState(1);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const totalSteps = 2;
  const form = useForm({
    resolver: u(comboSchema),
    defaultValues: {
      name: "Novo Combo",
      description: "Monte o seu combo especial.",
      maxSelect: 2,
      totalPrice: 10,
      discount: 0,
      selectedProductIds: []
    }
  });
  const selectedProductIds = form.watch("selectedProductIds");
  const maxSelect = form.watch("maxSelect");
  const totalPrice = form.watch("totalPrice");
  const discount = form.watch("discount");
  const toggleProduct = (id) => {
    const current = form.getValues("selectedProductIds");
    if (current.includes(id)) {
      form.setValue("selectedProductIds", current.filter((x) => x !== id));
    } else {
      form.setValue("selectedProductIds", [...current, id]);
    }
  };
  const nextStep = async () => {
    if (step === 1) {
      if (selectedProductIds.length === 0) {
        return toast.error("Selecione pelo menos um produto para o combo");
      }
      form.setValue("totalPrice", selectedProductIds.reduce((acc, id) => {
        const p = products.find((x) => x.id === id);
        return acc + (p?.base_price || 0);
      }, 0));
    }
    if (step < totalSteps) setStep((s) => s + 1);
  };
  const finalPriceCalc = () => {
    const final = totalPrice - totalPrice * (discount / 100);
    return final.toFixed(2).replace(".", ",");
  };
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const finalPrice = data.totalPrice - data.totalPrice * (data.discount / 100);
      const { data: newProd, error } = await supabase.from("products").insert({
        name: data.name,
        description: data.description,
        base_price: finalPrice,
        is_active: true
      }).select().single();
      if (error) throw error;
      toast.success("Combo criado com sucesso!");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar combo");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 bg-white flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 border-b border-gray-200 flex items-center px-6 justify-between shrink-0 bg-white shadow-sm z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-gray-900 text-lg", children: [
        "Criar combo (Passo ",
        step,
        " de ",
        totalSteps,
        ")"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto bg-gray-50/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto py-8 px-6", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: "Adicionar produtos ao combo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Selecione os produtos que farão parte deste combo e defina o limite de escolha." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-1.5", children: "Nome do Combo:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ...form.register("name"),
                placeholder: "Ex: Combo Família",
                className: "w-full sm:w-96 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-gray-900 focus:ring-1 outline-none transition"
              }
            ),
            form.formState.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-xs mt-1", children: form.formState.errors.name.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-semibold text-gray-900 mb-1.5", children: "Quantidade máxima de itens que o cliente pode escolher:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                ...form.register("maxSelect", { valueAsNumber: true }),
                className: "w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-gray-900 focus:ring-1 outline-none transition"
              }
            ),
            form.formState.errors.maxSelect && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-xs mt-1", children: form.formState.errors.maxSelect.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 text-sm mb-3 mt-6", children: "Produtos disponíveis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedProductIds.includes(p.id) ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: selectedProductIds.includes(p.id),
                onChange: () => toggleProduct(p.id),
                className: "w-4 h-4 accent-gray-900"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded overflow-hidden bg-gray-200 shrink-0", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-4 h-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-gray-900 truncate", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-500", children: [
                "R$ ",
                p.base_price.toFixed(2).replace(".", ",")
              ] })
            ] })
          ] }, p.id)) })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Como irá ofertar seu combo?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Escolha a modalidade de oferta e aproveite pra revisar" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-red-500 bg-white p-5 rounded-lg shadow-sm relative cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 text-[15px]", children: "Preço no combo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-4 border-red-500 bg-white" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 leading-relaxed pr-6", children: [
            "Decida o ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900", children: "preço do combo" }),
            " e ofereça ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900", children: "um desconto" }),
            "."
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 text-[15px] mb-0.5", children: "Quanto vai custar esse combo?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Ofereça um desconto e revise os preços dos seus produtos" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-white space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-900 mb-1.5", children: "Preço total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center border border-gray-200 rounded-md bg-gray-50/50 overflow-hidden focus-within:border-gray-400 focus-within:bg-white transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pl-3 pr-1 text-sm font-semibold text-gray-400", children: "R$" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.01",
                      ...form.register("totalPrice", { valueAsNumber: true }),
                      className: "w-full py-2.5 px-2 bg-transparent text-sm font-semibold text-gray-900 outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-900 mb-1.5", children: "Desconto (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center border border-gray-200 rounded-md bg-white overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pl-3 pr-1 text-sm font-semibold text-gray-400", children: "%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "0",
                      max: "100",
                      ...form.register("discount", { valueAsNumber: true }),
                      className: "w-full py-2.5 px-2 bg-transparent text-sm font-semibold text-green-700 outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-900 mb-1.5", children: "Preço final" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center border border-gray-100 rounded-md bg-gray-100 overflow-hidden opacity-70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pl-3 pr-1 text-sm font-semibold text-gray-400", children: "R$" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      readOnly: true,
                      value: finalPriceCalc(),
                      className: "w-full py-2.5 px-2 bg-transparent text-sm font-semibold text-gray-900 outline-none cursor-not-allowed"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full", children: "Obrigatório" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
                  "O cliente poderá escolher até ",
                  maxSelect,
                  " opções"
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-100", children: selectedProductIds.map((id) => {
                const p = products.find((x) => x.id === id);
                if (!p) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded border border-gray-200 overflow-hidden shrink-0", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gray-100" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-gray-900", children: p.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md", children: [
                    "R$ ",
                    p.base_price.toFixed(2).replace(".", ",")
                  ] })
                ] }, id);
              }) })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[72px] border-t border-gray-200 bg-white flex justify-end items-center px-6 gap-3 shrink-0 relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]", children: [
      step > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setStep((s) => s - 1),
          className: "border border-gray-300 text-gray-700 font-bold text-sm rounded-md px-6 py-2.5 hover:bg-gray-50 transition",
          children: "Voltar"
        }
      ),
      step < totalSteps ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: nextStep,
          className: "bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5 transition",
          children: "Continuar"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          disabled: isSubmitting,
          onClick: form.handleSubmit(onSubmit),
          className: "bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5 transition flex items-center gap-2",
          children: [
            isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            "Criar combo"
          ]
        }
      )
    ] })
  ] });
}
function CardapioPage() {
  const [activeTab, setActiveTab] = reactExports.useState("Cardápio");
  const [wizardOpen, setWizardOpen] = reactExports.useState(false);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [comboWizardOpen, setComboWizardOpen] = reactExports.useState(false);
  const [addExistingProductModalOpen, setAddExistingProductModalOpen] = reactExports.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = reactExports.useState(null);
  const queryClient = useQueryClient();
  const {
    data: categories = [],
    isLoading: isLoadingCats
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("categories").select("*").order("sort_order", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const {
    data: products = [],
    isLoading: isLoadingProds
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("products").select("*").order("name", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const loading = isLoadingCats || isLoadingProds;
  const seedTestProducts = async () => {
    toast.info("A geração de dados de teste foi desativada na nova versão para não sujar o banco de dados.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-md shadow-sm border border-gray-200 min-h-[calc(100vh-6rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-gray-200 p-6 pb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Cardápio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Defina quais os itens seus clientes podem pedir pelo app" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: seedTestProducts, className: "bg-orange-100 text-orange-700 text-xs font-bold px-3 rounded-md hover:bg-orange-200", children: "Gerar Dados Teste" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "grid place-items-center h-10 w-10 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "grid place-items-center h-10 w-10 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-5 h-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 mt-6", children: [
        ["Cardápio", "Produtos", "Complementos", "PDV"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab(tab), className: `pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab ? "border-[#ff0000] text-[#ff0000]" : "border-transparent text-gray-500 hover:text-gray-900"}`, children: tab }, tab)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "pb-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-900 flex items-center gap-2", children: [
          "Otimizador de cardápio",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-[#ff0000]/10 text-[#ff0000] text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold", children: "Novo" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50/80 px-6 py-4 flex items-center justify-between border-b border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 bg-gray-200 rounded w-1/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-gray-200 rounded w-24" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-gray-200 rounded w-32" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex gap-4 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gray-200 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-gray-200 rounded w-1/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-gray-200 rounded w-1/6" })
        ] })
      ] })
    ] }, i)) }) : activeTab === "Cardápio" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CardapioTab, { categories, products, onAddExistingProduct: (catId) => {
      setSelectedCategoryId(catId);
      setAddExistingProductModalOpen(true);
    }, onEdit: (p) => {
      setEditingProduct(p);
      setWizardOpen(true);
    }, onOpenComboWizard: () => setComboWizardOpen(true) }) : activeTab === "Produtos" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProdutosTab, { products, categories, onOpenWizard: () => {
      setEditingProduct(null);
      setWizardOpen(true);
    }, onEdit: (p) => {
      setEditingProduct(p);
      setWizardOpen(true);
    } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-gray-500", children: "Em breve" }) }),
    wizardOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(ProdutoWizard, { onClose: () => setWizardOpen(false), categories, initialData: editingProduct, onSuccess: () => {
      setWizardOpen(false);
      setEditingProduct(null);
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      });
      queryClient.invalidateQueries({
        queryKey: ["products"]
      });
    } }),
    comboWizardOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(ComboWizard, { onClose: () => setComboWizardOpen(false), products, onSuccess: () => {
      setComboWizardOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      });
      queryClient.invalidateQueries({
        queryKey: ["products"]
      });
    } }),
    addExistingProductModalOpen && selectedCategoryId && /* @__PURE__ */ jsxRuntimeExports.jsx(AddExistingProductModal, { onClose: () => {
      setAddExistingProductModalOpen(false);
      setSelectedCategoryId(null);
    }, categoryId: selectedCategoryId, allProducts: products, onSelect: async (productId) => {
      try {
        const {
          error
        } = await supabase.from("products").update({
          category_id: selectedCategoryId
        }).eq("id", productId);
        if (error) throw error;
        setProducts((prev) => prev.map((p) => p.id === productId ? {
          ...p,
          category_id: selectedCategoryId
        } : p));
        toast.success("Produto vinculado à categoria!");
      } catch (err) {
        console.error(err);
        toast.error("Erro ao vincular produto");
      } finally {
        setAddExistingProductModalOpen(false);
        setSelectedCategoryId(null);
      }
    } })
  ] });
}
function SortableCategory({
  cat,
  catProducts,
  index,
  onAddExistingProduct,
  onEdit
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: cat.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: setNodeRef, style, className: "border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50/80 px-6 py-4 flex items-center justify-between border-b border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ...attributes, ...listeners, className: "text-gray-400 hover:text-gray-900 cursor-grab active:cursor-grabbing mr-2 px-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 text-lg", children: cat.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toast.success("Editar categoria em breve"), className: "w-7 h-7 rounded grid place-items-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity", title: "Editar categoria", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-500 ml-2", children: [
          "(",
          catProducts.length,
          " item",
          catProducts.length !== 1 ? "s" : "",
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-md px-3 py-1.5", children: "Criar combo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onAddExistingProduct(cat.id), className: "bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-md px-3 py-1.5", children: "Adicionar produto" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-100", children: catProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onAddExistingProduct(cat.id), className: "w-full max-w-xl py-3 border border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
      " Adicionar produto"
    ] }) }) : catProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductListItem, { p, onEdit: () => onEdit(p) }, p.id)) })
  ] });
}
function CardapioTab({
  categories,
  products,
  onOpenWizard,
  onAddExistingProduct,
  onEdit
}) {
  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  }), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const reorderCategories = useMutation({
    mutationFn: async (newOrder) => {
      const updates = newOrder.map((c, idx) => ({
        id: c.id,
        sort_order: idx
      }));
      const {
        error
      } = await supabase.from("categories").upsert(updates);
      if (error) throw error;
    },
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({
        queryKey: ["categories"]
      });
      const previous = queryClient.getQueryData(["categories"]);
      queryClient.setQueryData(["categories"], newOrder);
      return {
        previous
      };
    },
    onError: (err, newOrder, context) => {
      queryClient.setQueryData(["categories"], context.previous);
      toast.error("Erro ao salvar ordem das categorias.");
    }
  });
  const handleDragEnd = (event) => {
    const {
      active,
      over
    } = event;
    if (active.id !== over?.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      reorderCategories.mutate(newOrder);
    }
  };
  if (categories.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Seu cardápio está vazio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-2 mb-6", children: "Comece criando categorias e adicionando seus produtos." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onOpenWizard, className: "bg-[#ff0000] text-white font-bold rounded-md px-6 py-2", children: "Criar produto" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Buscar um item", className: "flex-1 h-10 border border-gray-300 rounded-md px-4 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "flex-1 h-10 border border-gray-300 rounded-md px-4 text-sm bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecionar categoria" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-10 border border-gray-300 rounded-md px-4 text-sm font-semibold hover:bg-gray-50", children: "Criar categoria" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: categories.map((c) => c.id), strategy: verticalListSortingStrategy, children: categories.map((cat, index) => {
      const catProducts = products.filter((p) => p.category_id === cat.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SortableCategory, { cat, catProducts, index, onAddExistingProduct, onEdit }, cat.id);
    }) }) })
  ] });
}
function ProductListItem({
  p,
  onEdit
}) {
  const [stockModal, setStockModal] = reactExports.useState(false);
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const [stock, setStock] = reactExports.useState(999);
  const [draftStock, setDraftStock] = reactExports.useState(999);
  const queryClient = useQueryClient();
  const updateStock = useMutation({
    mutationFn: async (newStock) => {
      const {
        error
      } = await supabase.from("products").update({
        stock: newStock
      }).eq("id", p.id);
      if (error) throw error;
      await supabase.from("product_audit_log").insert({
        product_id: p.id,
        product_name: p.name,
        field_changed: "stock",
        old_value: String(stock),
        new_value: String(newStock),
        changed_at: (/* @__PURE__ */ new Date()).toISOString()
      }).maybeSingle();
    },
    onMutate: async (newStock) => {
      const previous = stock;
      setStock(newStock);
      return {
        previous
      };
    },
    onError: (err, newStock, context) => {
      setStock(context.previous);
      toast.error("Erro ao atualizar estoque.");
    },
    onSuccess: (_, newStock) => {
      toast.success(`Estoque atualizado para ${newStock} unidades!`);
    }
  });
  const removeProduct = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("products").delete().eq("id", p.id);
      if (error) throw error;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["products"]
      });
      const previous = queryClient.getQueryData(["products"]);
      queryClient.setQueryData(["products"], (old) => old.filter((prod) => prod.id !== p.id));
      return {
        previous
      };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["products"], context.previous);
      toast.error("Erro ao remover produto.");
    },
    onSuccess: () => toast.success("Produto removido com sucesso!")
  });
  const onRemove = () => {
    if (confirm(`Tem certeza que deseja remover ${p.name}?`)) {
      removeProduct.mutate();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 px-6 flex items-center justify-between hover:bg-gray-50 group transition border-b border-gray-100 last:border-0 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-200", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: "Sem foto" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-gray-900 text-[15px]", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-900 border border-gray-200 px-2 py-0.5 rounded-full uppercase tracking-wider", children: "Oferta Simples" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setDraftStock(stock);
        setStockModal(true);
      }, className: "text-[13px] font-semibold text-gray-600 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Estoque" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-200 text-gray-800 rounded-md px-1.5 py-0.5 text-[11px] leading-none tabular-nums font-bold", children: stock !== "" ? stock : 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-gray-300 rounded-md bg-white overflow-hidden h-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1.5 text-[13px] font-semibold text-gray-900 tabular-nums border-r border-gray-300 flex items-center h-full", children: [
          "R$ ",
          p.base_price.toFixed(2).replace(".", ",")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-2 h-full hover:bg-gray-100 text-gray-500 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-8 h-8 rounded-md border border-gray-300 grid place-items-center hover:bg-gray-100 text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4 fill-current" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMenuOpen(!menuOpen), className: `w-8 h-8 rounded-md border border-gray-300 grid place-items-center text-gray-500 transition ${menuOpen ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-100"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "w-4 h-4" }) }),
        menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40", onClick: () => setMenuOpen(false) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-[calc(100%+8px)] w-48 bg-white border border-gray-200 shadow-xl rounded-lg py-2 z-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setMenuOpen(false);
              onEdit();
            }, className: "w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }),
              " Editar item"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMenuOpen(false), className: "w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
              " Duplicar item"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setMenuOpen(false);
              onRemove();
            }, className: "w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
              " Remover item"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1.5 right-2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45" })
          ] })
        ] })
      ] })
    ] }),
    stockModal && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: stockModal, onOpenChange: setStockModal, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Estoque — ",
        p.name
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Quantidade em estoque" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: draftStock, onChange: (e) => setDraftStock(e.target.value ? Number(e.target.value) : ""), className: "w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] outline-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 mt-2 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📋" }),
          " Salvo no banco + registrado no histórico de auditoria."
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStockModal(false), className: "bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-300 transition", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: updateStock.isPending, onClick: () => {
          if (draftStock !== "") {
            updateStock.mutate(Number(draftStock));
            setStockModal(false);
          }
        }, className: "bg-[#ff0000] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-red-700 transition flex items-center gap-2", children: [
          updateStock.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Salvar alterações"
        ] })
      ] })
    ] }) })
  ] });
}
function ProdutosTab({
  products,
  categories,
  onOpenWizard,
  onEdit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-10 px-4 border border-gray-900 rounded-full text-sm font-semibold text-gray-900 bg-white", children: "Todos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-10 px-4 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50", children: "Pausados" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-10 px-4 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50", children: "Ativos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Buscar produtos", className: "flex-1 h-10 border border-gray-300 rounded-full px-4 text-sm ml-4" })
    ] }),
    products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Sem produtos cadastrados" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-2 mb-6", children: "Que tal começar a criar os produtos para disponibilizá-los em ofertas no seu cardápio?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onOpenWizard, className: "bg-gray-900 text-white text-sm font-bold rounded-md px-6 py-2.5 flex items-center gap-2 mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Criar produto"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-xl bg-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_200px_200px_100px] gap-4 p-4 px-6 bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "w-4 h-4 rounded border-gray-300 accent-gray-900" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Produtos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Classificação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Disponível em" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: "Ações" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-100", children: products.map((p) => {
        const catName = categories.find((c) => c.id === p.category_id)?.name || "Sem categoria";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_200px_200px_100px] gap-4 p-4 px-6 items-center hover:bg-gray-50 transition group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "w-4 h-4 rounded border-gray-300 accent-gray-900" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-200", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: "Sem foto" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-gray-900 text-sm", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: catName })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Item principal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600 font-medium", children: catName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onEdit(p), className: "w-8 h-8 rounded-md border border-gray-300 grid place-items-center hover:bg-gray-100 text-gray-500", title: "Editar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-8 h-8 rounded-md border border-gray-300 grid place-items-center hover:bg-gray-100 text-gray-500", title: "Pausar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4 fill-current" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-8 h-8 rounded-md border border-gray-300 grid place-items-center hover:bg-red-50 text-red-500 hover:border-red-200 hover:text-red-600", title: "Excluir", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }, p.id);
      }) })
    ] })
  ] });
}
function AddExistingProductModal({
  onClose,
  categoryId,
  allProducts,
  onSelect
}) {
  const [search, setSearch] = reactExports.useState("");
  const available = allProducts.filter((p) => p.category_id !== categoryId);
  const filtered = available.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Adicionar produto existente" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Buscar produto...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 outline-none focus:border-brand focus:ring-1 focus:ring-brand" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[300px] overflow-y-auto space-y-2 pr-2", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "Nenhum produto encontrado." }) : filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSelect(p.id), className: "w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200 transition text-left", children: [
        p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, className: "w-10 h-10 rounded-md object-cover shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-gray-900 truncate", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: p.base_price ? `R$ ${Number(p.base_price).toFixed(2).replace(".", ",")}` : "Sem preço" })
        ] })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-200 transition", children: "Cancelar" }) })
  ] }) });
}
export {
  CardapioPage as component
};
