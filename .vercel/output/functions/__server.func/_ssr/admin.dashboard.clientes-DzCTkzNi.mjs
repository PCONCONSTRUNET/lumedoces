import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { f as formatBRL } from "./cart-CsSEv74G.mjs";
import { K as LoaderCircle, ao as Users, a6 as Search, b as ArrowUpDown, Z as Phone, ab as ShoppingBag, C as Calendar } from "../_libs/lucide-react.mjs";
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
function ClientesPage() {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [sortBy, setSortBy] = reactExports.useState("last_order");
  const [sortOrder, setSortOrder] = reactExports.useState("desc");
  const {
    data: clients,
    isLoading
  } = useQuery({
    queryKey: ["admin-clientes"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("orders").select("customer_name, customer_phone, total, created_at, status").in("status", ["delivered", "paid"]);
      if (error) {
        console.error("Supabase error fetching clients:", error);
        return [];
      }
      if (!data) return [];
      const map = /* @__PURE__ */ new Map();
      data.forEach((order) => {
        const phone = order.customer_phone?.trim() || "Sem telefone";
        const name = order.customer_name?.trim() || "Cliente Desconhecido";
        if (!map.has(phone)) {
          map.set(phone, {
            phone,
            name,
            total_spent: order.total,
            order_count: 1,
            last_order: order.created_at,
            first_order: order.created_at
          });
        } else {
          const client = map.get(phone);
          client.total_spent += order.total;
          client.order_count += 1;
          if (new Date(order.created_at) > new Date(client.last_order)) {
            client.last_order = order.created_at;
            client.name = name;
          }
          if (new Date(order.created_at) < new Date(client.first_order)) {
            client.first_order = order.created_at;
          }
        }
      });
      return Array.from(map.values());
    }
  });
  const filteredAndSorted = reactExports.useMemo(() => {
    if (!clients) return [];
    let result = clients.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm));
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === "last_order") {
        aVal = new Date(a.last_order).getTime();
        bVal = new Date(b.last_order).getTime();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [clients, searchTerm, sortBy, sortOrder]);
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[50vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-brand" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 font-serif text-3xl font-extrabold text-gray-900", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-brand" }),
          "Clientes"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Base de dados gerada automaticamente a partir dos pedidos concretizados." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-72", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Buscar por nome ou telefone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-brand focus:border-brand shadow-sm text-sm" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm text-gray-600", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 cursor-pointer hover:bg-gray-100 transition", onClick: () => toggleSort("name"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          "Cliente ",
          sortBy === "name" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-3 w-3" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Telefone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 cursor-pointer hover:bg-gray-100 transition", onClick: () => toggleSort("order_count"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          "Nº Pedidos ",
          sortBy === "order_count" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-3 w-3" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 cursor-pointer hover:bg-gray-100 transition", onClick: () => toggleSort("total_spent"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          "Total Gasto ",
          sortBy === "total_spent" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-3 w-3" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 cursor-pointer hover:bg-gray-100 transition", onClick: () => toggleSort("last_order"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          "Último Pedido ",
          sortBy === "last_order" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-3 w-3" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100 bg-white", children: filteredAndSorted.length > 0 ? filteredAndSorted.map((client) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-bold text-gray-900", children: client.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
          " ",
          client.phone
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5" }),
          client.order_count
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-semibold text-emerald-600", children: formatBRL(client.total_spent) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
          new Date(client.last_order).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        ] }) })
      ] }, client.phone)) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-6 py-10 text-center text-gray-500", children: "Nenhum cliente encontrado." }) }) })
    ] }) }) })
  ] });
}
export {
  ClientesPage as component
};
