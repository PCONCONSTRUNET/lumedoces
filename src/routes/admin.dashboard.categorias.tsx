import { createFileRoute } from "@tanstack/react-router";
import { Tags, Plus, Trash2, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard/categorias")({
  component: CategoriasPage,
});

type Category = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

function CategoriasPage() {
  const [rows, setRows] = useState<Category[] | null>(null);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, sort_order, is_active")
      .order("sort_order")
      .order("name");
    if (error) {
      toast.error("Erro ao carregar categorias");
      return;
    }
    setRows((data as Category[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (name.length > 80) {
      toast.error("Nome muito longo");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("categories")
      .insert({ name, sort_order: (rows?.length ?? 0) + 1 });
    setSaving(false);
    if (error) {
      toast.error("Não foi possível criar");
      return;
    }
    setNewName("");
    toast.success("Categoria criada");
    load();
  };

  const onToggle = async (c: Category) => {
    await supabase.from("categories").update({ is_active: !c.is_active }).eq("id", c.id);
    load();
  };

  const onRename = async (c: Category, name: string) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === c.name) return;
    await supabase.from("categories").update({ name: trimmed }).eq("id", c.id);
    load();
  };

  const onDelete = async (c: Category) => {
    if (!confirm(`Excluir "${c.name}"? Produtos ficarão sem categoria.`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) {
      toast.error("Não foi possível excluir");
      return;
    }
    toast.success("Categoria excluída");
    load();
  };

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <Tags className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl text-foreground">Categorias</h1>
          <p className="text-sm text-muted-foreground">Organize seus produtos por categoria.</p>
        </div>
      </header>

      <form
        onSubmit={onCreate}
        className="mb-6 flex gap-2 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border/60"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={80}
          placeholder="Nova categoria (ex: Salgados, Bebidas, Doces)"
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <button
          type="submit"
          disabled={saving || !newName.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-50 transition"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Adicionar
        </button>
      </form>

      <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
        {!rows ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Nenhuma categoria. Crie a primeira acima.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {rows.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-2">
                <input
                  defaultValue={c.name}
                  onBlur={(e) => onRename(c, e.target.value)}
                  className="flex-1 bg-transparent px-2 py-1.5 text-sm rounded focus:bg-muted focus:outline-none"
                />
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={c.is_active}
                    onChange={() => onToggle(c)}
                    className="h-4 w-4 accent-brand"
                  />
                  Ativa
                </label>
                <button
                  onClick={() => onDelete(c)}
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
    </div>
  );
}
