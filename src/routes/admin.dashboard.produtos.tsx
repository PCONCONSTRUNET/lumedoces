import { createFileRoute } from "@tanstack/react-router";
import { Package, Plus, Loader2, Trash2, GripVertical, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/dashboard/produtos")({
  component: ProdutosPage,
});

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  base_price: number;
  is_active: boolean;
  category_id: string | null;
  categories: { name: string } | null;
};

type DraftOption = { name: string; additional_price: string };
type DraftVariation = {
  name: string;
  is_required: boolean;
  min_select: number;
  max_select: number;
  options: DraftOption[];
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parsePrice(s: string): number {
  const n = Number(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function ProdutosPage() {
  const [rows, setRows] = useState<Product[] | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, base_price, is_active, category_id, categories(name)")
      .order("sort_order")
      .order("name");
    if (error) {
      toast.error("Erro ao carregar produtos");
      return;
    }
    setRows((data as unknown as Product[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const onToggle = async (p: Product) => {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    load();
  };

  const onDelete = async (p: Product) => {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      toast.error("Não foi possível excluir");
      return;
    }
    toast.success("Produto excluído");
    load();
  };

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <Package className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground">Cadastre e gerencie o cardápio.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </button>
      </header>

      <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
        {!rows ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Nenhum produto cadastrado. Clique em "Novo produto" para começar.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {rows.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.categories?.name ?? "Sem categoria"} · {formatBRL(Number(p.base_price))}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={p.is_active}
                    onChange={() => onToggle(p)}
                    className="h-4 w-4 accent-brand"
                  />
                  Ativo
                </label>
                <button
                  onClick={() => onDelete(p)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                  aria-label="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <NovoProdutoDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={() => {
          setOpen(false);
          load();
        }}
      />
    </div>
  );
}

function NovoProdutoDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [variations, setVariations] = useState<DraftVariation[]>([]);

  useEffect(() => {
    if (!open) return;
    // reset
    setName("");
    setDescription("");
    setBasePrice("");
    setImageUrl("");
    setCategoryId("");
    setIsActive(true);
    setVariations([]);
    (async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order");
      setCategories((data as Category[]) ?? []);
    })();
  }, [open]);

  const addVariation = () =>
    setVariations((v) => [
      ...v,
      { name: "", is_required: false, min_select: 0, max_select: 1, options: [] },
    ]);
  const updateVariation = (i: number, patch: Partial<DraftVariation>) =>
    setVariations((v) => v.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const removeVariation = (i: number) =>
    setVariations((v) => v.filter((_, idx) => idx !== i));
  const addOption = (vi: number) =>
    updateVariation(vi, {
      options: [...variations[vi].options, { name: "", additional_price: "0,00" }],
    });
  const updateOption = (vi: number, oi: number, patch: Partial<DraftOption>) =>
    updateVariation(vi, {
      options: variations[vi].options.map((o, idx) =>
        idx === oi ? { ...o, ...patch } : o,
      ),
    });
  const removeOption = (vi: number, oi: number) =>
    updateVariation(vi, {
      options: variations[vi].options.filter((_, idx) => idx !== oi),
    });

  const onSave = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    for (const v of variations) {
      if (!v.name.trim()) return toast.error("Toda variação precisa de nome");
      if (v.options.length === 0)
        return toast.error(`Adicione opções para "${v.name}"`);
      for (const o of v.options) {
        if (!o.name.trim())
          return toast.error(`Toda opção de "${v.name}" precisa de nome`);
      }
    }
    setSaving(true);
    try {
      const { data: product, error: prodErr } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          base_price: parsePrice(basePrice),
          image_url: imageUrl.trim() || null,
          category_id: categoryId || null,
          is_active: isActive,
        })
        .select("id")
        .single();
      if (prodErr || !product) throw prodErr ?? new Error("Falha");

      for (let vi = 0; vi < variations.length; vi++) {
        const v = variations[vi];
        const { data: varRow, error: vErr } = await supabase
          .from("product_variations")
          .insert({
            product_id: product.id,
            name: v.name.trim(),
            is_required: v.is_required,
            min_select: v.min_select,
            max_select: v.max_select,
            sort_order: vi,
          })
          .select("id")
          .single();
        if (vErr || !varRow) throw vErr ?? new Error("Falha");
        const optsPayload = v.options.map((o, oi) => ({
          variation_id: varRow.id,
          name: o.name.trim(),
          additional_price: parsePrice(o.additional_price),
          sort_order: oi,
        }));
        const { error: oErr } = await supabase
          .from("product_variation_options")
          .insert(optsPayload);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Dados básicos */}
          <div className="space-y-3">
            <Field label="Nome*">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                className="ipt"
                placeholder="Ex: Mini coxinha de frango"
                autoFocus
              />
            </Field>

            <Field label="Descrição">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={2}
                className="ipt"
                placeholder="Descrição curta"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Preço base (R$)*">
                <input
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  inputMode="decimal"
                  className="ipt"
                  placeholder="0,00"
                />
              </Field>
              <Field label="Categoria">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="ipt"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="URL da imagem">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                maxLength={500}
                className="ipt"
                placeholder="https://..."
              />
            </Field>

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              Produto ativo
            </label>
          </div>

          {/* Variações */}
          <div className="border-t border-border/60 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Variações</h3>
                <p className="text-xs text-muted-foreground">
                  Ex: Tamanho, Recheio. Opções podem ter valor adicional.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariation}
                className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-bold hover:bg-muted/70 transition"
              >
                <Plus className="h-3 w-3" /> Variação
              </button>
            </div>

            {variations.length === 0 && (
              <p className="text-xs text-muted-foreground py-3 text-center">
                Sem variações — produto será vendido pelo preço base.
              </p>
            )}

            <div className="space-y-3">
              {variations.map((v, vi) => (
                <div
                  key={vi}
                  className="rounded-xl border border-border/60 p-3 bg-background/50"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5" />
                    <div className="flex-1 space-y-2">
                      <input
                        value={v.name}
                        onChange={(e) => updateVariation(vi, { name: e.target.value })}
                        placeholder="Nome da variação (ex: Tamanho)"
                        maxLength={60}
                        className="ipt"
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Mínimo</span>
                          <input
                            type="number"
                            min={0}
                            value={v.min_select}
                            onChange={(e) =>
                              updateVariation(vi, { min_select: Number(e.target.value) || 0 })
                            }
                            className="ipt"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Máximo</span>
                          <input
                            type="number"
                            min={1}
                            value={v.max_select}
                            onChange={(e) =>
                              updateVariation(vi, { max_select: Number(e.target.value) || 1 })
                            }
                            className="ipt"
                          />
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer select-none px-1 col-span-2 sm:col-span-1 sm:pb-2">
                          <input
                            type="checkbox"
                            checked={v.is_required}
                            onChange={(e) =>
                              updateVariation(vi, { is_required: e.target.checked })
                            }
                            className="h-4 w-4 accent-brand"
                          />
                          Obrigatório
                        </label>
                      </div>

                      <div className="space-y-1.5">
                        {v.options.map((o, oi) => (
                          <div
                            key={oi}
                            className="grid grid-cols-[1fr_130px_auto] gap-2 items-center"
                          >
                            <input
                              value={o.name}
                              onChange={(e) =>
                                updateOption(vi, oi, { name: e.target.value })
                              }
                              placeholder="Opção (ex: Grande)"
                              maxLength={60}
                              className="ipt"
                            />
                            <div className="relative">
                              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                                +R$
                              </span>
                              <input
                                value={o.additional_price}
                                onChange={(e) =>
                                  updateOption(vi, oi, { additional_price: e.target.value })
                                }
                                inputMode="decimal"
                                className="ipt pl-12 text-right"
                                placeholder="0,00"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeOption(vi, oi)}
                              className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                              aria-label="Remover opção"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(vi)}
                          className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Adicionar opção
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariation(vi)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                      aria-label="Remover variação"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm font-bold hover:bg-muted/70 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-60 transition"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </button>
        </DialogFooter>

        <style>{`
          .ipt {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid hsl(var(--border));
            background: hsl(var(--background));
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
          }
          .ipt:focus {
            box-shadow: 0 0 0 2px color-mix(in oklab, hsl(var(--primary)) 35%, transparent);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}
