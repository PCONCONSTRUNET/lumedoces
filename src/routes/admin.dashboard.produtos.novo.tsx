import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2, Loader2, Save, GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard/produtos/novo")({
  component: NovoProdutoPage,
});

type Category = { id: string; name: string };

type DraftOption = {
  name: string;
  additional_price: string; // string para input controlado
};

type DraftVariation = {
  name: string;
  is_required: boolean;
  min_select: number;
  max_select: number;
  options: DraftOption[];
};

function NovoProdutoPage() {
  const navigate = useNavigate();
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
    (async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order");
      setCategories((data as Category[]) ?? []);
    })();
  }, []);

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

  const parsePrice = (s: string): number => {
    const n = Number(s.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const onSave = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    // valida variações
    for (const v of variations) {
      if (!v.name.trim()) {
        toast.error("Toda variação precisa de um nome");
        return;
      }
      if (v.options.length === 0) {
        toast.error(`Adicione opções para "${v.name}"`);
        return;
      }
      for (const o of v.options) {
        if (!o.name.trim()) {
          toast.error(`Toda opção de "${v.name}" precisa de nome`);
          return;
        }
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

      if (prodErr || !product) throw prodErr ?? new Error("Falha ao criar produto");

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
        if (vErr || !varRow) throw vErr ?? new Error("Falha na variação");

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
      navigate({ to: "/admin/dashboard/produtos" });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar o produto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/admin/dashboard/produtos"
          className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-muted/70 transition"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-2xl text-foreground">Novo produto</h1>
      </div>

      {/* Dados básicos */}
      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60 space-y-4">
        <h2 className="font-semibold text-foreground">Informações</h2>

        <Field label="Nome*">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            className="input"
            placeholder="Ex: Mini coxinha de frango"
          />
        </Field>

        <Field label="Descrição">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="input"
            placeholder="Descrição curta do produto"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Preço base (R$)*">
            <input
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              inputMode="decimal"
              className="input"
              placeholder="0,00"
            />
          </Field>
          <Field label="Categoria">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input"
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
            className="input"
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
          Produto ativo (visível no cardápio)
        </label>
      </section>

      {/* Variações */}
      <section className="mt-6 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-foreground">Variações</h2>
            <p className="text-xs text-muted-foreground">
              Ex: Tamanho, Recheio, Adicionais. Cada opção pode ter valor adicional.
            </p>
          </div>
          <button
            onClick={addVariation}
            className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs font-bold hover:bg-muted/70 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar variação
          </button>
        </div>

        {variations.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Nenhuma variação. Produto será vendido apenas pelo preço base.
          </p>
        )}

        <div className="space-y-4">
          {variations.map((v, vi) => (
            <div key={vi} className="rounded-xl border border-border/60 p-4 bg-background/50">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_90px_90px_auto] gap-3">
                    <input
                      value={v.name}
                      onChange={(e) => updateVariation(vi, { name: e.target.value })}
                      placeholder="Nome (ex: Tamanho)"
                      maxLength={60}
                      className="input"
                    />
                    <input
                      type="number"
                      min={0}
                      value={v.min_select}
                      onChange={(e) =>
                        updateVariation(vi, { min_select: Number(e.target.value) || 0 })
                      }
                      title="Mínimo"
                      className="input"
                      placeholder="Mín"
                    />
                    <input
                      type="number"
                      min={1}
                      value={v.max_select}
                      onChange={(e) =>
                        updateVariation(vi, { max_select: Number(e.target.value) || 1 })
                      }
                      title="Máximo"
                      className="input"
                      placeholder="Máx"
                    />
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={v.is_required}
                        onChange={(e) =>
                          updateVariation(vi, { is_required: e.target.checked })
                        }
                        className="h-4 w-4 accent-brand"
                      />
                      Obrig.
                    </label>
                  </div>

                  <div className="space-y-2">
                    {v.options.map((o, oi) => (
                      <div
                        key={oi}
                        className="grid grid-cols-[1fr_120px_auto] gap-2 items-center"
                      >
                        <input
                          value={o.name}
                          onChange={(e) => updateOption(vi, oi, { name: e.target.value })}
                          placeholder="Opção (ex: Grande)"
                          maxLength={60}
                          className="input"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            +R$
                          </span>
                          <input
                            value={o.additional_price}
                            onChange={(e) =>
                              updateOption(vi, oi, { additional_price: e.target.value })
                            }
                            inputMode="decimal"
                            className="input pl-12"
                            placeholder="0,00"
                          />
                        </div>
                        <button
                          onClick={() => removeOption(vi, oi)}
                          className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                          aria-label="Remover opção"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(vi)}
                      className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Adicionar opção
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeVariation(vi)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                  aria-label="Remover variação"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 flex justify-end gap-2">
        <Link
          to="/admin/dashboard/produtos"
          className="inline-flex items-center gap-2 rounded-full bg-muted px-5 py-2.5 text-sm font-bold hover:bg-muted/70 transition"
        >
          Cancelar
        </Link>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-60 transition"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar produto
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.625rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow .15s;
        }
        .input:focus {
          box-shadow: 0 0 0 2px color-mix(in oklab, hsl(var(--primary)) 35%, transparent);
        }
      `}</style>
    </div>
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
