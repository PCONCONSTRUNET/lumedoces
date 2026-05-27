import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollText,
  Loader2,
  Search,
  RefreshCw,
  Eye,
  X,
  Plus,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard/auditoria")({
  component: AuditoriaPage,
});

type AuditAction = "INSERT" | "UPDATE" | "DELETE";

interface AuditLog {
  id: string;
  table_name: string;
  record_id: string | null;
  action: AuditAction;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  changed_fields: string[] | null;
  user_id: string | null;
  user_email: string | null;
  created_at: string;
}

const TABLE_LABELS: Record<string, string> = {
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
  audit_logs: "Auditoria",
};

const PAGE_SIZE = 50;

function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableFilter, setTableFilter] = useState("");
  const [actionFilter, setActionFilter] = useState<"" | AuditAction>("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const tables = useMemo(() => Object.keys(TABLE_LABELS).sort(), []);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (tableFilter) q = q.eq("table_name", tableFilter);
    if (actionFilter) q = q.eq("action", actionFilter);
    if (dateFrom) q = q.gte("created_at", new Date(dateFrom).toISOString());
    if (dateTo) {
      const d = new Date(dateTo);
      d.setDate(d.getDate() + 1);
      q = q.lt("created_at", d.toISOString());
    }

    const { data, count, error } = await q;
    if (!error && data) {
      setLogs(data as AuditLog[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFilter, actionFilter, dateFrom, dateTo, page]);

  const filtered = useMemo(() => {
    if (!search.trim()) return logs;
    const s = search.toLowerCase();
    return logs.filter(
      (l) =>
        (l.user_email ?? "").toLowerCase().includes(s) ||
        (l.record_id ?? "").toLowerCase().includes(s) ||
        l.table_name.toLowerCase().includes(s) ||
        JSON.stringify(l.new_data ?? l.old_data ?? {}).toLowerCase().includes(s),
    );
  }, [logs, search]);

  const exportCSV = () => {
    const rows = filtered.map((l) => ({
      Data: new Date(l.created_at).toLocaleString("pt-BR"),
      Tabela: TABLE_LABELS[l.table_name] ?? l.table_name,
      Ação: l.action,
      "ID do registro": l.record_id ?? "",
      Usuário: l.user_email ?? "Sistema",
      "Campos alterados": (l.changed_fields ?? []).join(", "),
    }));
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(";"),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = String(r[h as keyof typeof r] ?? "").replace(/"/g, '""');
            return `"${v}"`;
          })
          .join(";"),
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-brand" /> Auditoria
          </h2>
          <p className="text-sm text-muted-foreground">
            Registro completo de todas as alterações do sistema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-full bg-card ring-1 ring-border px-3 py-2 text-xs font-bold hover:bg-muted transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-full bg-brand text-brand-foreground px-3 py-2 text-xs font-bold hover:opacity-95 transition"
          >
            <Download className="h-3.5 w-3.5" /> Exportar CSV
          </button>
        </div>
      </header>

      {/* Filtros compactos */}
      <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border/60 px-3 py-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Filtros
          </span>
          <label className="inline-flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide">
              Tabela:
            </span>
            <select
              value={tableFilter}
              onChange={(e) => {
                setPage(0);
                setTableFilter(e.target.value);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium"
            >
              <option value="">Todas</option>
              {tables.map((t) => (
                <option key={t} value={t}>
                  {TABLE_LABELS[t] ?? t}
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide">
              Ação:
            </span>
            <select
              value={actionFilter}
              onChange={(e) => {
                setPage(0);
                setActionFilter(e.target.value as "" | AuditAction);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium"
            >
              <option value="">Todas</option>
              <option value="INSERT">Criação</option>
              <option value="UPDATE">Edição</option>
              <option value="DELETE">Exclusão</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide">
              De:
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setPage(0);
                setDateFrom(e.target.value);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium"
            />
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide">
              Até:
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setPage(0);
                setDateTo(e.target.value);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium"
            />
          </label>
          <div className="relative ml-auto">
            <Search className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por usuário, id, conteúdo..."
              className="rounded-md border border-border bg-background pl-7 pr-2 py-1 text-xs w-64"
            />
          </div>
          {(tableFilter || actionFilter || dateFrom || dateTo || search) && (
            <button
              type="button"
              onClick={() => {
                setTableFilter("");
                setActionFilter("");
                setDateFrom("");
                setDateTo("");
                setSearch("");
                setPage(0);
              }}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
          <h3 className="text-sm font-bold">
            Registros{" "}
            <span className="text-muted-foreground font-normal">
              ({total.toLocaleString("pt-BR")})
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhum registro encontrado.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2">Data</th>
                    <th className="text-left px-4 py-2">Ação</th>
                    <th className="text-left px-4 py-2">Tabela</th>
                    <th className="text-left px-4 py-2">ID</th>
                    <th className="text-left px-4 py-2">Usuário</th>
                    <th className="text-left px-4 py-2">Campos alterados</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr
                      key={l.id}
                      className="border-t border-border/40 hover:bg-muted/30 transition"
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(l.created_at).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-2">
                        <ActionBadge action={l.action} />
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {TABLE_LABELS[l.table_name] ?? l.table_name}
                      </td>
                      <td className="px-4 py-2 text-xs font-mono text-muted-foreground">
                        {l.record_id ? l.record_id.slice(0, 8) : "—"}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {l.user_email ?? (
                          <span className="text-muted-foreground italic">Sistema</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {l.changed_fields && l.changed_fields.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {l.changed_fields.slice(0, 4).map((f) => (
                              <span
                                key={f}
                                className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono"
                              >
                                {f}
                              </span>
                            ))}
                            {l.changed_fields.length > 4 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{l.changed_fields.length - 4}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => setSelected(l)}
                          className="inline-flex items-center gap-1 rounded-md bg-muted hover:bg-muted/70 px-2 py-1 text-xs font-bold transition"
                        >
                          <Eye className="h-3.5 w-3.5" /> Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 text-xs">
              <span className="text-muted-foreground">
                Página {page + 1} de {pages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-md bg-muted hover:bg-muted/70 px-3 py-1 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                  disabled={page >= pages - 1}
                  className="rounded-md bg-muted hover:bg-muted/70 px-3 py-1 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selected && <DetailModal log={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ActionBadge({ action }: { action: AuditAction }) {
  const map = {
    INSERT: {
      label: "Criação",
      icon: Plus,
      cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/30",
    },
    UPDATE: {
      label: "Edição",
      icon: Pencil,
      cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/30",
    },
    DELETE: {
      label: "Exclusão",
      icon: Trash2,
      cls: "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-500/30",
    },
  } as const;
  const { label, icon: Icon, cls } = map[action];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
        cls,
      )}
    >
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function DetailModal({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  const isUpdate = log.action === "UPDATE";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-border flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <ActionBadge action={log.action} />
              {TABLE_LABELS[log.table_name] ?? log.table_name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(log.created_at).toLocaleString("pt-BR")} •{" "}
              {log.user_email ?? "Sistema"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-5 py-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Info label="ID do registro" value={log.record_id ?? "—"} mono />
            <Info label="Tabela (técnico)" value={log.table_name} mono />
          </div>

          {isUpdate && log.changed_fields && log.changed_fields.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Alterações
              </h4>
              <div className="rounded-lg ring-1 ring-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-1.5">Campo</th>
                      <th className="text-left px-3 py-1.5">Antes</th>
                      <th className="text-left px-3 py-1.5">Depois</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.changed_fields.map((f) => (
                      <tr key={f} className="border-t border-border/40">
                        <td className="px-3 py-1.5 font-mono font-semibold">{f}</td>
                        <td className="px-3 py-1.5 font-mono text-rose-600 dark:text-rose-400 break-all">
                          {fmt(log.old_data?.[f])}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-emerald-600 dark:text-emerald-400 break-all">
                          {fmt(log.new_data?.[f])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {log.old_data && (
            <details className="rounded-lg ring-1 ring-border overflow-hidden">
              <summary className="cursor-pointer px-3 py-2 bg-muted/40 text-xs font-bold">
                Dados anteriores
              </summary>
              <pre className="text-[11px] p-3 overflow-x-auto bg-background">
                {JSON.stringify(log.old_data, null, 2)}
              </pre>
            </details>
          )}

          {log.new_data && (
            <details className="rounded-lg ring-1 ring-border overflow-hidden" open={!isUpdate}>
              <summary className="cursor-pointer px-3 py-2 bg-muted/40 text-xs font-bold">
                Dados novos
              </summary>
              <pre className="text-[11px] p-3 overflow-x-auto bg-background">
                {JSON.stringify(log.new_data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-muted/30 ring-1 ring-border/60 p-2">
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={cn("text-xs mt-0.5 break-all", mono && "font-mono")}>{value}</div>
    </div>
  );
}

function fmt(v: unknown): string {
  if (v === null || v === undefined) return "∅";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
