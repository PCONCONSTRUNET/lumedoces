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
  ImageDown,
  FileText,
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
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const TABLE_LABELS: Record<string, string> = {
  products: "Produtos",
  categories: "Categorias",
  product_variations: "Variações de produto",
  product_variation_options: "Opções de variação",
  orders: "Pedidos",
  order_items: "Itens do pedido",
  payment_methods: "Formas de pagamento",
  finance_categories: "Categorias financeiras",
  finance_transactions: "Lançamentos financeiros",
  business_hours: "Horários de funcionamento",
  user_roles: "Papéis de usuário",
  audit_logs: "Auditoria",
  points_transactions: "Extrato de Pontos",
  reward_store_items: "Loja de Prêmios (itens)",
  reward_redemptions: "Resgates de Prêmios",
  customer_profiles: "Perfis de Clientes",
  addresses: "Endereços",
  coupons: "Cupons",
};

// Translates DB column names to human-readable Portuguese labels
const FIELD_LABELS: Record<string, string> = {
  // Common
  id: "ID",
  created_at: "Criado em",
  updated_at: "Atualizado em",
  user_id: "Usuário (ID)",
  status: "Status",
  // Orders
  total_amount: "Valor total",
  points_earned: "Pontos ganhos",
  points_used: "Pontos usados",
  delivery_address: "Endereço de entrega",
  payment_method: "Forma de pagamento",
  notes: "Observações",
  // Points
  amount: "Valor (pontos)",
  type: "Tipo",
  description: "Descrição",
  reference_id: "Referência",
  // Rewards
  reward_item_id: "Item do prêmio",
  points_spent: "Pontos gastos",
  // Store items
  name: "Nome",
  image_url: "Imagem",
  points_cost: "Custo em pontos",
  stock: "Estoque",
  is_active: "Ativo",
  // Finance
  value: "Valor",
  category_id: "Categoria",
  date: "Data",
  paid: "Pago",
  // Products
  price: "Preço",
  original_price: "Preço original",
  available: "Disponível",
  // Business hours
  day_of_week: "Dia da semana",
  open_time: "Abertura",
  close_time: "Fechamento",
  is_open: "Aberto",
  // User roles
  role: "Perfil",
  email: "E-mail",
};

const fieldLabel = (f: string) => FIELD_LABELS[f] ?? f;

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
  const [itemNames, setItemNames] = useState<Record<string, string>>({});

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
      const logs = data as AuditLog[];
      setLogs(logs);
      setTotal(count ?? 0);

      // Batch-fetch reward item names for any redemption logs
      const itemIds = [...new Set(
        logs
          .filter((l) => l.table_name === "reward_redemptions" && l.new_data?.reward_item_id)
          .map((l) => String(l.new_data!.reward_item_id))
      )];
      if (itemIds.length > 0) {
        const db = supabase as any;
        const { data: items } = await db
          .from("reward_store_items")
          .select("id, name")
          .in("id", itemIds);
        if (items) {
          const map: Record<string, string> = {};
          items.forEach((item: any) => { map[item.id] = item.name; });
          setItemNames(map);
        }
      }
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
        (l.ip_address ?? "").toLowerCase().includes(s) ||
        getDeviceLabel(l.user_agent).toLowerCase().includes(s) ||
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
      IP: l.ip_address ?? "",
      Dispositivo: getDeviceLabel(l.user_agent),
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
                    <th className="text-left px-4 py-2">Origem</th>
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
                        <div className="flex flex-col">
                          <span>{TABLE_LABELS[l.table_name] ?? l.table_name}</span>
                          {getBusinessContext(l, itemNames) && (
                            <span className="text-[10px] mt-0.5">{getBusinessContext(l, itemNames)}</span>
                          )}
                        </div>
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
                        <div className="space-y-0.5">
                          <div className="font-mono">{l.ip_address ?? "—"}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {getDeviceLabel(l.user_agent)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {l.changed_fields && l.changed_fields.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {l.changed_fields.slice(0, 4).map((f) => (
                              <span
                                key={f}
                                className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold"
                                title={f}
                              >
                                {fieldLabel(f)}
                              </span>
                            ))}
                            {l.changed_fields.length > 4 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{l.changed_fields.length - 4} campos
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

      {selected && <DetailModal log={selected} itemNames={itemNames} onClose={() => setSelected(null)} />}
    </div>
  );
}

function getBusinessContext(log: AuditLog, itemNames: Record<string, string> = {}) {
  try {
    if (log.table_name === "points_transactions" && log.action === "INSERT" && log.new_data) {
      const amount = Number(log.new_data.amount);
      const desc = log.new_data.description || "Sem descrição";
      if (amount > 0) return <span className="text-emerald-600 font-medium">Lançou +{amount} pts ({desc})</span>;
      if (amount < 0) return <span className="text-rose-600 font-medium">Removeu {amount} pts ({desc})</span>;
      return <span className="text-muted-foreground font-medium">{desc}</span>;
    }
    
    if (log.table_name === "reward_redemptions" && log.action === "INSERT" && log.new_data) {
      const itemId = String(log.new_data.reward_item_id ?? "");
      const itemName = itemNames[itemId] ?? null;
      return (
        <span className="text-brand font-medium">
          Resgate: {itemName ? <strong>{itemName}</strong> : "Prêmio"} ({log.new_data.points_spent} pts)
        </span>
      );
    }

    if (log.table_name === "reward_store_items" && log.action === "UPDATE" && log.changed_fields?.includes("stock")) {
      const oldStock = log.old_data?.stock ?? "?";
      const newStock = log.new_data?.stock ?? "?";
      const itemName = log.new_data?.name ? String(log.new_data.name) : null;
      return (
        <span className="text-amber-600 font-medium">
          Baixa de estoque{itemName ? ` (${itemName})` : ""}: {oldStock} → {newStock}
        </span>
      );
    }

    return null;
  } catch {
    return null;
  }
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


// ── Audit Receipt Generator (Canvas) ──────────────────────────────────────
function getBusinessContextStr(log: AuditLog, itemNames: Record<string, string> = {}): string | null {
  try {
    if (log.table_name === "points_transactions" && log.action === "INSERT" && log.new_data) {
      const amount = Number(log.new_data.amount);
      const desc = log.new_data.description || "Sem descrição";
      if (amount > 0) return `Lançou +${amount} pts (${desc})`;
      if (amount < 0) return `Removeu ${amount} pts (${desc})`;
      return String(desc);
    }
    if (log.table_name === "reward_redemptions" && log.action === "INSERT" && log.new_data) {
      const itemId = String(log.new_data.reward_item_id ?? "");
      const itemName = itemNames[itemId] ?? "Prêmio";
      return `Resgate: ${itemName} (${log.new_data.points_spent} pts)`;
    }
    if (log.table_name === "reward_store_items" && log.action === "UPDATE" && log.changed_fields?.includes("stock")) {
      const oldStock = log.old_data?.stock ?? "?";
      const newStock = log.new_data?.stock ?? "?";
      const itemName = log.new_data?.name ? String(log.new_data.name) : null;
      return `Baixa de estoque${itemName ? ` (${itemName})` : ""}: ${oldStock} → ${newStock}`;
    }
    return null;
  } catch {
    return null;
  }
}

async function generateAuditCanvas(log: AuditLog): Promise<HTMLCanvasElement> {
  const W = 560;
  const actionLabel = log.action === "INSERT" ? "Criação" : log.action === "UPDATE" ? "Edição" : "Exclusão";
  const actionColor = log.action === "INSERT" ? "#059669" : log.action === "UPDATE" ? "#d97706" : "#dc2626";
  const tableLabel = TABLE_LABELS[log.table_name] ?? log.table_name;
  const changedFields = log.changed_fields ?? [];
  const ROWS = changedFields.length > 0 ? changedFields.length : 0;
  const businessCtx = getBusinessContextStr(log, {});
  
  const ctxHeight = businessCtx ? 40 : 0;
  const H = 180 + ctxHeight + (ROWS > 0 ? 30 + ROWS * 28 + 20 : 0) + 80;

  const canvas = document.createElement("canvas");
  canvas.width = W * 2; canvas.height = H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  // Header
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#ad172b"); grad.addColorStop(1, "#7b1020");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 56);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Lume Artesanais — Comprovante de Auditoria", 20, 35);

  // Body bg
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 56, W, H - 56);

  let y = 80;
  const L = 20; const R = W - 20;

  // Action badge
  ctx.fillStyle = actionColor;
  ctx.beginPath(); ctx.roundRect(L, y - 14, 72, 20, 6); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(actionLabel, L + 8, y);

  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 18px system-ui, sans-serif";
  ctx.fillText(tableLabel, L + 82, y);
  y += 22;

  ctx.fillStyle = "#64748b";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText(new Date(log.created_at).toLocaleString("pt-BR") + " · " + (log.user_email ?? "Sistema"), L, y);
  y += 24;

  // Divider
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
  y += 16;
  
  if (businessCtx) {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(L, y, R - L, 30);
    ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1;
    ctx.strokeRect(L, y, R - L, 30);
    
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillText("Resumo: " + businessCtx, L + 10, y + 20);
    y += 46;
  }

  // Info rows
  const drawInfoRow = (label: string, value: string) => {
    ctx.fillStyle = "#64748b"; ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, L, y);
    ctx.fillStyle = "#1e293b"; ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(value, R, y);
    ctx.textAlign = "left";
    y += 20;
  };

  drawInfoRow("ID do registro:", log.record_id ? log.record_id.slice(0, 20) + "..." : "—");
  drawInfoRow("IP de origem:", log.ip_address ?? "—");
  drawInfoRow("Dispositivo:", getDeviceLabel(log.user_agent));
  y += 10;

  // Changed fields table
  if (changedFields.length > 0) {
    ctx.fillStyle = "#ad172b"; ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Campos Alterados", L, y);
    y += 8;
    ctx.strokeStyle = "#f0d8db"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
    y += 14;

    // Table header
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(L, y - 12, R - L, 22);
    ctx.fillStyle = "#64748b"; ctx.font = "bold 10px system-ui, sans-serif";
    const col1 = L + 8, col2 = L + 170, col3 = L + 360;
    ctx.fillText("CAMPO", col1, y + 2);
    ctx.fillText("ANTES", col2, y + 2);
    ctx.fillText("DEPOIS", col3, y + 2);
    y += 20;

    changedFields.forEach((f) => {
      ctx.fillStyle = "#1e293b"; ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText(fieldLabel(f), col1, y);
      ctx.fillStyle = "#dc2626"; ctx.font = "11px system-ui, sans-serif";
      const oldVal = fmt(log.old_data?.[f]);
      ctx.fillText(oldVal.slice(0, 20), col2, y);
      ctx.fillStyle = "#059669";
      const newVal = fmt(log.new_data?.[f]);
      ctx.fillText(newVal.slice(0, 20), col3, y);
      y += 24;
      ctx.strokeStyle = "#f1f5f9"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L, y - 8); ctx.lineTo(R, y - 8); ctx.stroke();
    });
    y += 10;
  }

  // Footer
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
  y += 16;
  ctx.fillStyle = "#94a3b8"; ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Documento gerado automaticamente pelo sistema de auditoria da Lume Artesanais.", W / 2, y);

  return canvas;
}

async function downloadAuditAsPDF(log: AuditLog) {
  const canvas = await generateAuditCanvas(log);
  const imgData = canvas.toDataURL("image/png");
  const { default: jsPDF } = await import("jspdf");
  const PX_TO_MM = 25.4 / 96;
  const W_MM = 560 * PX_TO_MM;
  const H_MM = (canvas.height / 2) * PX_TO_MM;
  const doc = new jsPDF({ unit: "mm", format: [W_MM, H_MM], orientation: "portrait" });
  doc.addImage(imgData, "PNG", 0, 0, W_MM, H_MM);
  doc.save(`auditoria_lume_${log.id.slice(0, 8)}.pdf`);
}

async function downloadAuditAsImage(log: AuditLog) {
  const canvas = await generateAuditCanvas(log);
  const link = document.createElement("a");
  link.download = `auditoria_lume_${log.id.slice(0, 8)}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
// ──────────────────────────────────────────────────────────────────────────

function DetailModal({ log, itemNames = {}, onClose }: { log: AuditLog; itemNames?: Record<string, string>; onClose: () => void }) {
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadAuditAsImage(log)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-muted hover:bg-muted/70 px-3 py-1.5 text-xs font-bold transition"
              title="Baixar como Imagem"
            >
              <ImageDown className="h-3.5 w-3.5" /> Imagem
            </button>
            <button
              onClick={() => downloadAuditAsPDF(log)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 px-3 py-1.5 text-xs font-bold transition"
              title="Baixar como PDF"
            >
              <FileText className="h-3.5 w-3.5" /> PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-muted transition ml-1"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="px-5 py-4 overflow-y-auto space-y-4">
          {getBusinessContext(log, itemNames) && (
            <div className="bg-brand/5 border border-brand/20 rounded-xl p-3 flex items-center gap-3">
              <span className="text-sm">{getBusinessContext(log, itemNames)}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs">
            <Info label="ID do registro" value={log.record_id ?? "—"} mono />
            <Info label="Tabela (técnico)" value={log.table_name} mono />
            <Info label="IP" value={log.ip_address ?? "—"} mono />
            <Info label="Dispositivo" value={getDeviceLabel(log.user_agent)} />
          </div>

          {log.user_agent && (
            <Info label="User agent completo" value={log.user_agent} mono />
          )}

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
                        <td className="px-3 py-1.5 font-semibold" title={f}>{fieldLabel(f)}</td>
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

function getDeviceLabel(userAgent: string | null): string {
  if (!userAgent) return "—";

  const ua = userAgent.toLowerCase();
  const device = /mobile|android|iphone|ipod/.test(ua)
    ? "Celular"
    : /ipad|tablet/.test(ua)
      ? "Tablet"
      : "Desktop";
  const browser = ua.includes("edg/")
    ? "Edge"
    : ua.includes("opr/") || ua.includes("opera")
      ? "Opera"
      : ua.includes("chrome/")
        ? "Chrome"
        : ua.includes("firefox/")
          ? "Firefox"
          : ua.includes("safari/")
            ? "Safari"
            : "Navegador";
  const os = ua.includes("windows")
    ? "Windows"
    : ua.includes("android")
      ? "Android"
      : ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")
        ? "iOS"
        : ua.includes("mac os") || ua.includes("macintosh")
          ? "macOS"
          : ua.includes("linux")
            ? "Linux"
            : "";

  return [device, browser, os].filter(Boolean).join(" • ");
}

function fmt(v: unknown): string {
  if (v === null || v === undefined) return "∅";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
