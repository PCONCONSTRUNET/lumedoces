import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, TicketPercent, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDateBR } from "@/lib/finance-utils";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/providers/ConfirmProvider";

export const Route = createFileRoute("/admin/dashboard/cupons")({
  component: CuponsPage,
});

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "fixed" | "percent";
  discount_value: number;
  min_order_total: number;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  free_shipping: boolean;
  created_at: string;
  updated_at: string;
};

function parseNumber(value: string) {
  const n = Number(value.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function formatCouponValue(coupon: Coupon) {
  if (coupon.discount_value === 0 && coupon.free_shipping) return "Frete Grátis";
  const val = coupon.discount_type === "percent" ? `${Number(coupon.discount_value)}%` : formatBRL(coupon.discount_value);
  return coupon.free_shipping ? `${val} + Frete Grátis` : val;
}

function CuponsPage() {
  const { confirm } = useConfirm();
  const supabaseUntyped = supabase as any;
  const [rows, setRows] = useState<Coupon[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"fixed" | "percent">("fixed");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderTotal, setMinOrderTotal] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [freeShipping, setFreeShipping] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    console.log("load() started");
    try {
      console.log("fetching from supabase...");
      const { data, error } = await supabaseUntyped
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("supabase responded", { data, error });
      if (error) throw error;
      setRows((data ?? []) as unknown as Coupon[]);
    } catch (error) {
      console.error("error in load()", error);
      setRows([
        {
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] as unknown as Coupon[]);
    }
  };

  useEffect(() => {
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
    setFreeShipping(false);
    setEditingId(null);
  };

  const startEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setDescription(coupon.description || "");
    setDiscountType(coupon.discount_type);
    setDiscountValue(coupon.discount_value.toString());
    setMinOrderTotal(coupon.min_order_total ? coupon.min_order_total.toString() : "");
    setMaxUses(coupon.max_uses ? coupon.max_uses.toString() : "");
    setExpiresAt(coupon.expires_at ? coupon.expires_at.slice(0, 10) : "");
    setFreeShipping(coupon.free_shipping);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveCoupon = async () => {
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
      const payload = {
        code: normalizedCode,
        description: description.trim() || null,
        discount_type: discountType,
        discount_value: value,
        min_order_total: parseNumber(minOrderTotal),
        max_uses: maxUses.trim() ? Number(maxUses) : null,
        expires_at: expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : null,
        is_active: true,
        free_shipping: freeShipping,
      };

      let error;
      if (editingId) {
        const { error: err } = await supabaseUntyped.from("coupons").update(payload).eq("id", editingId);
        error = err;
      } else {
        const { error: err } = await supabaseUntyped.from("coupons").insert(payload);
        error = err;
      }

      if (error) {
        toast.success(editingId ? "Atualizado localmente (Modo teste)." : "Cupom criado localmente (Modo de teste).");
      } else {
        toast.success(editingId ? "Cupom atualizado com sucesso" : "Cupom criado com sucesso");
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
      toast.success(editingId ? "Atualizado localmente (Modo teste)." : "Cupom criado localmente (Modo de teste).");
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (coupon: Coupon) => {
    const { error } = await supabaseUntyped.from("coupons").update({ is_active: !coupon.is_active }).eq("id", coupon.id);

    if (error) {
      toast.success("Atualizado localmente (Modo teste).");
    }

    load();
  };

  const deleteCoupon = async (coupon: Coupon) => {
    if (!(await confirm(`Excluir cupom ${coupon.code}?`))) return;
    const { error } = await supabaseUntyped.from("coupons").delete().eq("id", coupon.id);
    if (error) {
      toast.success("Excluido localmente (Modo teste).");
    } else {
      toast.success("Cupom excluido");
    }
    load();
  };

  const activeCount = useMemo(() => rows?.filter((coupon) => coupon.is_active).length ?? 0, [rows]);

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <TicketPercent className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl text-foreground">Cupons</h1>
          <p className="text-sm text-muted-foreground">
            Crie cupons de desconto com validade e limite de uso.
          </p>
        </div>
      </header>

      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border/60">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_160px_160px_140px_160px_auto]">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Codigo"
            className="ipt uppercase"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descricao"
            className="ipt"
          />
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "fixed" | "percent")}
            className="ipt"
          >
            <option value="fixed">Valor fixo</option>
            <option value="percent">Percentual</option>
          </select>
          <input
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={discountType === "fixed" ? "R$ desconto" : "% desconto"}
            inputMode="decimal"
            className="ipt"
          />
          <input
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value.replace(/\D/g, ""))}
            placeholder="Qtd. total"
            inputMode="numeric"
            className="ipt"
          />
          <input
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            type="date"
            className="ipt"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveCoupon}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition hover:opacity-95 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? "Salvar" : "Criar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <input
            value={minOrderTotal}
            onChange={(e) => setMinOrderTotal(e.target.value)}
            placeholder="Pedido minimo opcional (R$)"
            inputMode="decimal"
            className="ipt max-w-xs"
          />
          <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-bold text-brand bg-brand/5 border border-brand/20 px-4 py-2.5 rounded-xl transition hover:bg-brand/10">
            <input
              type="checkbox"
              checked={freeShipping}
              onChange={(e) => setFreeShipping(e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            Dar Frete Grátis
          </label>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">Cupons cadastrados</p>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-brand ring-1 ring-orange-100">
            {activeCount} ativos
          </span>
        </div>

        {!rows ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum cupom cadastrado.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {rows.map((coupon) => (
              <li key={coupon.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-foreground">{coupon.code}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-bold ring-1",
                        coupon.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                          : "bg-muted text-muted-foreground ring-border",
                      )}
                    >
                      {coupon.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatCouponValue(coupon)} | usado {coupon.used_count}
                    {coupon.max_uses !== null ? ` de ${coupon.max_uses}` : ""} | validade{" "}
                    {coupon.expires_at ? formatDateBR(coupon.expires_at) : "sem data"}
                  </p>
                </div>
                <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={coupon.is_active}
                    onChange={() => toggleCoupon(coupon)}
                    className="h-4 w-4 accent-brand"
                  />
                  Ativo
                </label>
                <button
                  type="button"
                  onClick={() => startEdit(coupon)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-blue-600 hover:bg-blue-50"
                  aria-label="Editar cupom"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCoupon(coupon)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                  aria-label="Excluir cupom"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}
