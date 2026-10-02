import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Header, C as CartDrawer } from "./CartDrawer-BMuulltj.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as CartProvider, u as useCart, f as formatBRL } from "./cart-CsSEv74G.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { c as categories, p as products } from "./menu-D9sMzlT2.mjs";
import { F as Footer } from "./Footer-jppd2-op.mjs";
import { a6 as Search, ac as ShoppingCart, k as ChevronLeft, l as ChevronRight, af as Star } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./logo_lume-9BuO-Xgn.mjs";
import "./PaymentLabel-C4dSyJxL.mjs";
import "./useBusinessStatus-BBSRvrw0.mjs";
import "./order-utils-DIKjTF50.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const bannerMobile01 = "/assets/banner_mobile_01-Cl4NFz12.png";
const bannerMobile02 = "/assets/banner_mobile_02_fds-D0hZfER9.png";
const bannerPc01 = "/assets/banner_pc_01-DeczLAaZ.png";
const bannerPc02 = "/assets/banner_pc_02-WeRLVQcD.png";
function Hero({ onOrder }) {
  const [currentSlide, setCurrentSlide] = reactExports.useState(0);
  const mobileBanners = [bannerMobile01, bannerMobile02];
  const desktopBanners = [bannerPc01, bannerPc02];
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4e3);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "top", className: "relative w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:grid grid-cols-1 grid-rows-1 w-full", children: desktopBanners.map((src, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src,
        alt: `Banner PC ${index + 1}`,
        className: `col-start-1 row-start-1 w-full h-auto object-contain transition-opacity duration-1000 ${index === currentSlide % desktopBanners.length ? "opacity-100 relative z-10" : "opacity-0 absolute z-0"}`
      },
      src
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:hidden grid-cols-1 grid-rows-1 w-full", children: mobileBanners.map((src, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src,
        alt: `Banner mobile ${index + 1}`,
        className: `col-start-1 row-start-1 w-full h-auto object-contain transition-opacity duration-1000 ${index === currentSlide % mobileBanners.length ? "opacity-100 relative z-10" : "opacity-0 absolute z-0"}`
      },
      src
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-full z-20 pointer-events-none flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "sr-only", children: "Lume Artesanais" }) })
  ] });
}
function ProductCard({ product, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-md ring-1 ring-border/50 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square w-full shrink-0 overflow-hidden bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.image,
              alt: product.name,
              loading: "lazy",
              className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/5" })
        ] }),
        product.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-highlight text-white shadow-lg sm:h-8 sm:w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col justify-between gap-2 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-[15px] sm:text-lg font-bold leading-[1.15] text-foreground line-clamp-2", children: product.name }),
            product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-[11px] sm:text-xs text-muted-foreground leading-snug", children: product.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[14px] sm:text-base font-extrabold text-highlight whitespace-nowrap", children: formatBRL(product.price) }) })
        ] })
      ]
    }
  );
}
function ProductModal({
  product,
  onClose
}) {
  const { add } = useCart();
  const [addonQuantities, setAddonQuantities] = reactExports.useState({});
  const [selectedOptions, setSelectedOptions] = reactExports.useState({});
  const [quantity, setQuantity] = reactExports.useState(1);
  const [notes, setNotes] = reactExports.useState("");
  reactExports.useEffect(() => {
    setAddonQuantities({});
    setSelectedOptions({});
    setQuantity(1);
    setNotes("");
    if (product) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [product?.id]);
  const addonTotal = reactExports.useMemo(() => {
    if (!product?.addons) return 0;
    let total = 0;
    Object.entries(addonQuantities).forEach(([name, qty]) => {
      const addon = product.addons?.find((a) => a.name === name);
      if (addon) total += addon.price * qty;
    });
    return total;
  }, [product, addonQuantities]);
  const optionsTotal = reactExports.useMemo(() => {
    let total = 0;
    Object.entries(selectedOptions).forEach(([groupName, selectedNames]) => {
      const group = product?.options?.find((g) => g.name === groupName);
      if (group) {
        selectedNames.forEach((name) => {
          const item = group.items.find((i) => i.name === name);
          if (item) total += item.price;
        });
      }
    });
    return total;
  }, [product, selectedOptions]);
  const isValid = reactExports.useMemo(() => {
    if (!product?.options) return true;
    for (const group of product.options) {
      if (group.min > 0) {
        const selected = selectedOptions[group.name]?.length || 0;
        if (selected < group.min) return false;
      }
    }
    return true;
  }, [product, selectedOptions]);
  if (!product) return null;
  const unit = product.price + addonTotal + optionsTotal;
  const finalTotal = unit * quantity;
  const toggleOption = (groupName, itemName, max) => {
    setSelectedOptions((prev) => {
      const current = prev[groupName] || [];
      if (current.includes(itemName)) {
        return { ...prev, [groupName]: current.filter((n) => n !== itemName) };
      }
      if (current.length >= max) {
        if (max === 1) return { ...prev, [groupName]: [itemName] };
        toast.error(`Máximo de ${max} opções permitidas.`);
        return prev;
      }
      return { ...prev, [groupName]: [...current, itemName] };
    });
  };
  const updateAddon = (name, delta) => {
    setAddonQuantities((prev) => {
      const next = { ...prev };
      const current = next[name] || 0;
      const newVal = Math.max(0, current + delta);
      if (newVal === 0) delete next[name];
      else next[name] = newVal;
      return next;
    });
  };
  const handleAdd = () => {
    const chosen = [];
    Object.entries(addonQuantities).forEach(([name, qty]) => {
      const addon = product.addons?.find((a) => a.name === name);
      if (addon) {
        for (let i = 0; i < qty; i++) chosen.push(addon);
      }
    });
    const chosenOptions = [];
    Object.entries(selectedOptions).forEach(([groupName, items]) => {
      const group = product.options?.find((g) => g.name === groupName);
      if (group) {
        items.forEach((itemName) => {
          const item = group.items.find((i) => i.name === itemName);
          if (item) chosenOptions.push({ group: groupName, name: item.name, price: item.price });
        });
      }
    });
    add({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: unit,
      quantity,
      addons: chosen,
      selectedOptions: chosenOptions,
      notes: notes || void 0
    });
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho`);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex flex-col bg-white sm:items-center sm:justify-center sm:bg-black/70 sm:p-6 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-full w-full flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-3xl sm:shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative shrink-0 bg-white p-4 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-64 sm:h-72 w-full overflow-hidden rounded-[2rem]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.image,
            alt: product.name,
            className: "h-full w-full object-cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            "aria-label": "Voltar",
            className: "absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700",
            children: "< VOLTAR"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-6 pt-5 pb-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[22px] font-extrabold text-gray-900 leading-tight", children: product.name }),
        product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-gray-600 leading-snug", children: product.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-[13px] text-gray-500", children: "a partir de" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[26px] font-black text-green-700", children: formatBRL(product.price) })
      ] }),
      product.options && product.options.map((group) => {
        const currentSelected = selectedOptions[group.name] || [];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#D9D9D9]/50 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-gray-900 text-sm", children: group.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-600 mt-0.5", children: group.min > 0 ? `Escolha de ${group.min} a ${group.max} opções` : `Escolha até ${group.max} opções` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded px-2 py-1 text-[9px] font-black tracking-wider text-white ${group.min > 0 ? "bg-red-600" : "bg-black"}`, children: group.min > 0 ? "OBRIGATÓRIO" : "OPCIONAL" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-dashed divide-gray-300", children: group.items.map((item) => {
            const isSelected = currentSelected.includes(item.name);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "flex items-center justify-between bg-white p-4 cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: group.max === 1 ? "radio" : "checkbox",
                  name: `option_${group.name}`,
                  checked: isSelected,
                  onChange: () => toggleOption(group.name, item.name, group.max),
                  className: "w-4 h-4 accent-red-600"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800 text-[15px]", children: item.name }),
                item.price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-1 text-[13px] font-bold text-green-700", children: [
                  "+ ",
                  formatBRL(item.price)
                ] })
              ] })
            ] }) }, item.name);
          }) })
        ] }, group.name);
      }),
      product.addons && product.addons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#D9D9D9]/50 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-gray-900 text-sm", children: "Adicionais" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-600 mt-0.5", children: "Escolha os itens desejados" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-black px-2 py-1 text-[9px] font-black tracking-wider text-white", children: "OPCIONAL" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-dashed divide-gray-300", children: product.addons.map((a) => {
          const qty = addonQuantities[a.name] || 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800 text-[15px]", children: a.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-1 text-[13px] font-bold text-green-700", children: [
                "+ ",
                formatBRL(a.price)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 shrink-0 items-center rounded-full border border-gray-300 bg-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => updateAddon(a.name, -1),
                  className: "flex h-full w-10 items-center justify-center text-lg text-gray-500 hover:text-black",
                  children: "−"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 text-center text-[15px] font-bold text-gray-800", children: qty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => updateAddon(a.name, 1),
                  className: "flex h-full w-10 items-center justify-center text-lg text-gray-500 hover:text-black",
                  children: "+"
                }
              )
            ] })
          ] }, a.name);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 px-4 pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 mb-2", children: "Adicionar algum detalhe?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            placeholder: "Excreva o detalhe aqui...",
            rows: 3,
            className: "w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 text-[15px] placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-4 pb-6 sm:pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[46px] shrink-0 items-center rounded-full border border-gray-300 bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setQuantity((q) => Math.max(1, q - 1)),
            className: "flex h-full w-11 items-center justify-center text-xl text-gray-500 hover:text-black",
            children: "−"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 text-center text-base font-bold text-gray-900", children: quantity }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setQuantity((q) => q + 1),
            className: "flex h-full w-11 items-center justify-center text-xl text-gray-500 hover:text-black",
            children: "+"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-center whitespace-nowrap px-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[17px] font-black text-green-700", children: formatBRL(finalTotal) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAdd,
          disabled: !isValid,
          className: "flex h-[46px] shrink-0 items-center justify-center rounded-full bg-[#ff0000] px-6 text-[13px] font-bold tracking-wide text-white shadow-md active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed",
          children: "ADICIONAR"
        }
      )
    ] }) })
  ] }) });
}
class ErrorBoundary extends reactExports.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.error) return this.props.fallback(this.state.error);
    return this.props.children;
  }
}
function CategoryRow({ category, products: products2, onSelect }) {
  const rowRef = reactExports.useRef(null);
  const [scrollProgress, setScrollProgress] = reactExports.useState(0);
  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const progress = scrollLeft / maxScroll * 100;
      setScrollProgress(progress);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl font-extrabold tracking-tight text-foreground", children: category.name }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => scroll("left"), className: "grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-foreground hover:bg-muted transition", "aria-label": "Anterior", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => scroll("right"), className: "grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-foreground hover:bg-muted transition", "aria-label": "Próximo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: rowRef,
        onScroll: handleScroll,
        className: "no-scrollbar grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:overflow-x-auto sm:snap-x sm:snap-mandatory sm:pb-4",
        children: products2.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:snap-start sm:shrink-0 sm:w-[280px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, onClick: () => onSelect(p) }) }, p.id))
      }
    )
  ] });
}
function Menu({ menuRef }) {
  const [query, setQuery] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(null);
  const { count, total, setOpen } = useCart();
  const { data, isLoading } = useQuery({
    queryKey: ["menu-data"],
    queryFn: async () => {
      const [cats, prods] = await Promise.all([
        supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("products").select("*").eq("is_active", true).order("sort_order")
      ]);
      if (cats.error || prods.error) {
        console.error(cats.error ?? prods.error);
        return { categories: [], products: [] };
      }
      return { categories: cats.data ?? [], products: prods.data ?? [] };
    }
  });
  const categories$1 = reactExports.useMemo(() => {
    let sortedCats = [...categories];
    if (typeof window !== "undefined") {
      const savedOrder = localStorage.getItem("categoryOrder");
      if (savedOrder) {
        try {
          const orderArr = JSON.parse(savedOrder);
          sortedCats.sort((a, b) => {
            let indexA = orderArr.indexOf(a.id);
            let indexB = orderArr.indexOf(b.id);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
          });
        } catch (e) {
        }
      }
    }
    return sortedCats;
  }, []);
  const products$1 = reactExports.useMemo(() => products, []);
  const filtered = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products$1;
    return products$1.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q));
  }, [products$1, query]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { ref: menuRef, id: "menu", className: "relative bg-[#FAF9F6] dark:bg-background pb-32 pt-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-4xl sm:text-5xl text-foreground font-extrabold tracking-tight", children: "Nosso Cardápio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-md text-base text-muted-foreground", children: "Explore nossa variedade de doces e salgados artesanais, além de opções saudáveis e veganas feitas com muito carinho para você." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto mt-6 max-w-xl mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Buscar por sabor...",
            className: "w-full rounded-full border border-border bg-white py-4 pl-12 pr-6 text-base shadow-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-highlight/50 transition-all dark:bg-card"
          }
        )
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 py-10 text-center text-sm text-muted-foreground", children: "Nenhum produto encontrado." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5", children: categories$1.map((c) => {
        const items = filtered.filter((p) => p.category === c.id);
        if (items.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryRow, { category: c, products: items, onSelect: setSelected }, c.id);
      }) })
    ] }),
    count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen(true),
        className: "flex w-full items-center justify-between gap-3 rounded-full bg-highlight px-5 py-4 text-white shadow-2xl hover:opacity-95 transition-all",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-8 w-8 place-items-center rounded-full bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-lg", children: [
              count,
              " · Ver Carrinho"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-white px-4 py-1 text-sm font-bold text-highlight shadow-sm", children: formatBRL(total) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { fallback: (err) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white p-10 overflow-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-red-500 font-bold text-2xl", children: "Erro no ProductModal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-bold", children: err.toString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-4 text-xs whitespace-pre-wrap", children: err.stack }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelected(null), className: "mt-6 bg-black text-white px-4 py-2 rounded", children: "Fechar" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductModal, { product: selected, onClose: () => setSelected(null) }) })
  ] });
}
function Index() {
  const menuRef = reactExports.useRef(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { menuRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] }) });
}
export {
  Index as component
};
