import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { a5 as ScrollText, a1 as RefreshCw, w as Download, a6 as Search, K as LoaderCircle, x as Eye, aj as Trash2, Y as Pencil, _ as Plus, ar as X } from "../_libs/lucide-react.mjs";
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
const TABLE_LABELS = {
  products: "Produtos",
  categories: "Categorias",
  product_variations: "Variações",
  product_variation_options: "Opções de variação",
  orders: "Pedidos",
  order_items: "Itens de pedido",
  payment_methods: "Formas de pagamento",
  finance_categories: "Categorias financeiras",
  finance_transactions: "Lançamentos financeiros",
  business_hours: "Horários",
  user_roles: "Papéis de usuário",
  audit_logs: "Auditoria"
};
const PAGE_SIZE = 50;
function AuditoriaPage() {
  const [logs, setLogs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [tableFilter, setTableFilter] = reactExports.useState("");
  const [actionFilter, setActionFilter] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [selected, setSelected] = reactExports.useState(null);
  const tables = reactExports.useMemo(() => Object.keys(TABLE_LABELS).sort(), []);
  const load = async () => {
    setLoading(true);
    let q = supabase.from("audit_logs").select("*", {
      count: "exact"
    }).order("created_at", {
      ascending: false
    }).range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    if (tableFilter) q = q.eq("table_name", tableFilter);
    if (actionFilter) q = q.eq("action", actionFilter);
    if (dateFrom) q = q.gte("created_at", new Date(dateFrom).toISOString());
    if (dateTo) {
      const d = new Date(dateTo);
      d.setDate(d.getDate() + 1);
      q = q.lt("created_at", d.toISOString());
    }
    const {
      data,
      count,
      error
    } = await q;
    if (!error && data) {
      setLogs(data);
      setTotal(count ?? 0);
    }
    setLoading(false);
  };
  reactExports.useEffect(() => {
    void load();
  }, [tableFilter, actionFilter, dateFrom, dateTo, page]);
  const filtered = reactExports.useMemo(() => {
    if (!search.trim()) return logs;
    const s = search.toLowerCase();
    return logs.filter((l) => (l.user_email ?? "").toLowerCase().includes(s) || (l.ip_address ?? "").toLowerCase().includes(s) || getDeviceLabel(l.user_agent).toLowerCase().includes(s) || (l.record_id ?? "").toLowerCase().includes(s) || l.table_name.toLowerCase().includes(s) || JSON.stringify(l.new_data ?? l.old_data ?? {}).toLowerCase().includes(s));
  }, [logs, search]);
  const exportCSV = () => {
    const rows = filtered.map((l) => ({
      Data: new Date(l.created_at).toLocaleString("pt-BR"),
      Tabela: TABLE_LABELS[l.table_name] ?? l.table_name,
      Ação: l.action,
      "ID do registro": l.record_id ?? "",
      Usuário: l.user_email ?? "Sistema",
      IP: l.ip_address ?? "",
      Dispositivo: getDeviceLabel(l.user_agent),
      "Campos alterados": (l.changed_fields ?? []).join(", ")
    }));
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(";"), ...rows.map((r) => headers.map((h) => {
      const v = String(r[h] ?? "").replace(/"/g, '""');
      return `"${v}"`;
    }).join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl sm:text-2xl font-extrabold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "h-6 w-6 text-brand" }),
          " Auditoria"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Registro completo de todas as alterações do sistema." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void load(), className: "inline-flex items-center gap-2 rounded-full bg-card ring-1 ring-border px-3 py-2 text-xs font-bold hover:bg-muted transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
          " Atualizar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportCSV, className: "inline-flex items-center gap-2 rounded-full bg-brand text-brand-foreground px-3 py-2 text-xs font-bold hover:opacity-95 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
          " Exportar CSV"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card shadow-sm ring-1 ring-border/60 px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1", children: "Filtros" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1.5 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-muted-foreground uppercase tracking-wide", children: "Tabela:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: tableFilter, onChange: (e) => {
          setPage(0);
          setTableFilter(e.target.value);
        }, className: "rounded-md border border-border bg-background px-2 py-1 text-xs font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todas" }),
          tables.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: TABLE_LABELS[t] ?? t }, t))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1.5 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-muted-foreground uppercase tracking-wide", children: "Ação:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: actionFilter, onChange: (e) => {
          setPage(0);
          setActionFilter(e.target.value);
        }, className: "rounded-md border border-border bg-background px-2 py-1 text-xs font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "INSERT", children: "Criação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "UPDATE", children: "Edição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DELETE", children: "Exclusão" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1.5 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-muted-foreground uppercase tracking-wide", children: "De:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dateFrom, onChange: (e) => {
          setPage(0);
          setDateFrom(e.target.value);
        }, className: "rounded-md border border-border bg-background px-2 py-1 text-xs font-medium" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1.5 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-muted-foreground uppercase tracking-wide", children: "Até:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dateTo, onChange: (e) => {
          setPage(0);
          setDateTo(e.target.value);
        }, className: "rounded-md border border-border bg-background px-2 py-1 text-xs font-medium" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative ml-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Buscar por usuário, id, conteúdo...", className: "rounded-md border border-border bg-background pl-7 pr-2 py-1 text-xs w-64" })
      ] }),
      (tableFilter || actionFilter || dateFrom || dateTo || search) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
        setTableFilter("");
        setActionFilter("");
        setDateFrom("");
        setDateTo("");
        setSearch("");
        setPage(0);
      }, className: "text-xs font-semibold text-muted-foreground hover:text-foreground underline-offset-2 hover:underline", children: "Limpar" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card shadow-sm ring-1 ring-border/60 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border/60 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold", children: [
        "Registros",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
          "(",
          total.toLocaleString("pt-BR"),
          ")"
        ] })
      ] }) }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-sm text-muted-foreground", children: "Nenhum registro encontrado." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Ação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Tabela" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Usuário" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Origem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Campos alterados" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40 hover:bg-muted/30 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 whitespace-nowrap text-xs text-muted-foreground", children: new Date(l.created_at).toLocaleString("pt-BR") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBadge, { action: l.action }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-medium", children: TABLE_LABELS[l.table_name] ?? l.table_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs font-mono text-muted-foreground", children: l.record_id ? l.record_id.slice(0, 8) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs", children: l.user_email ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "Sistema" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono", children: l.ip_address ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: getDeviceLabel(l.user_agent) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs", children: l.changed_fields && l.changed_fields.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 max-w-md", children: [
              l.changed_fields.slice(0, 4).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono", children: f }, f)),
              l.changed_fields.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                "+",
                l.changed_fields.length - 4
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelected(l), className: "inline-flex items-center gap-1 rounded-md bg-muted hover:bg-muted/70 px-2 py-1 text-xs font-bold transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }),
              " Ver"
            ] }) })
          ] }, l.id)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border/40 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Página ",
            page + 1,
            " de ",
            pages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage((p) => Math.max(0, p - 1)), disabled: page === 0, className: "rounded-md bg-muted hover:bg-muted/70 px-3 py-1 font-bold disabled:opacity-40 disabled:cursor-not-allowed", children: "Anterior" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage((p) => Math.min(pages - 1, p + 1)), disabled: page >= pages - 1, className: "rounded-md bg-muted hover:bg-muted/70 px-3 py-1 font-bold disabled:opacity-40 disabled:cursor-not-allowed", children: "Próxima" })
          ] })
        ] })
      ] })
    ] }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailModal, { log: selected, onClose: () => setSelected(null) })
  ] });
}
function ActionBadge({
  action
}) {
  const map = {
    INSERT: {
      label: "Criação",
      icon: Plus,
      cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/30"
    },
    UPDATE: {
      label: "Edição",
      icon: Pencil,
      cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/30"
    },
    DELETE: {
      label: "Exclusão",
      icon: Trash2,
      cls: "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-500/30"
    }
  };
  const {
    label,
    icon: Icon,
    cls
  } = map[action];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1", cls), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
    " ",
    label
  ] });
}
function DetailModal({
  log,
  onClose
}) {
  const isUpdate = log.action === "UPDATE";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3 sm:p-6", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-border flex flex-col", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-extrabold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBadge, { action: log.action }),
          TABLE_LABELS[log.table_name] ?? log.table_name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          new Date(log.created_at).toLocaleString("pt-BR"),
          " •",
          " ",
          log.user_email ?? "Sistema"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-full p-2 hover:bg-muted transition", "aria-label": "Fechar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 overflow-y-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "ID do registro", value: log.record_id ?? "—", mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Tabela (técnico)", value: log.table_name, mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "IP", value: log.ip_address ?? "—", mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Dispositivo", value: getDeviceLabel(log.user_agent) })
      ] }),
      log.user_agent && /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "User agent completo", value: log.user_agent, mono: true }),
      isUpdate && log.changed_fields && log.changed_fields.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2", children: "Alterações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg ring-1 ring-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-1.5", children: "Campo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-1.5", children: "Antes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-1.5", children: "Depois" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: log.changed_fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-mono font-semibold", children: f }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-mono text-rose-600 dark:text-rose-400 break-all", children: fmt(log.old_data?.[f]) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-mono text-emerald-600 dark:text-emerald-400 break-all", children: fmt(log.new_data?.[f]) })
          ] }, f)) })
        ] }) })
      ] }),
      log.old_data && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "rounded-lg ring-1 ring-border overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer px-3 py-2 bg-muted/40 text-xs font-bold", children: "Dados anteriores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[11px] p-3 overflow-x-auto bg-background", children: JSON.stringify(log.old_data, null, 2) })
      ] }),
      log.new_data && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "rounded-lg ring-1 ring-border overflow-hidden", open: !isUpdate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer px-3 py-2 bg-muted/40 text-xs font-bold", children: "Dados novos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[11px] p-3 overflow-x-auto bg-background", children: JSON.stringify(log.new_data, null, 2) })
      ] })
    ] })
  ] }) });
}
function Info({
  label,
  value,
  mono = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/30 ring-1 ring-border/60 p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-xs mt-0.5 break-all", mono && "font-mono"), children: value })
  ] });
}
function getDeviceLabel(userAgent) {
  if (!userAgent) return "—";
  const ua = userAgent.toLowerCase();
  const device = /mobile|android|iphone|ipod/.test(ua) ? "Celular" : /ipad|tablet/.test(ua) ? "Tablet" : "Desktop";
  const browser = ua.includes("edg/") ? "Edge" : ua.includes("opr/") || ua.includes("opera") ? "Opera" : ua.includes("chrome/") ? "Chrome" : ua.includes("firefox/") ? "Firefox" : ua.includes("safari/") ? "Safari" : "Navegador";
  const os = ua.includes("windows") ? "Windows" : ua.includes("android") ? "Android" : ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios") ? "iOS" : ua.includes("mac os") || ua.includes("macintosh") ? "macOS" : ua.includes("linux") ? "Linux" : "";
  return [device, browser, os].filter(Boolean).join(" • ");
}
function fmt(v) {
  if (v === null || v === void 0) return "∅";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
export {
  AuditoriaPage as component
};
