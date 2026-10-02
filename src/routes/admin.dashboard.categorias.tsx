import { createFileRoute } from "@tanstack/react-router";
import { Tags, Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useConfirm } from "@/providers/ConfirmProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const { confirm } = useConfirm();
  const [rows, setRows] = useState<Category[] | null>(null);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const load = async () => {
    // Supabase desconectado a pedido do usuário
    setTimeout(() => {
      setRows([
        { id: "doces", name: "Doces Saudáveis", sort_order: 1, is_active: true },
        { id: "salgados", name: "Snacks Saudáveis", sort_order: 2, is_active: true },
        { id: "bebidas", name: "Bebidas Naturais", sort_order: 3, is_active: true }
      ]);
    }, 300);
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
    setOpen(false);
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

  const saveCategoryOrder = async (ordered: Category[]) => {
    const normalized = ordered.map((c, i) => ({ ...c, sort_order: i + 1 }));
    setRows(normalized);

    const results = await Promise.all(
      normalized.map((c) =>
        supabase.from("categories").update({ sort_order: c.sort_order }).eq("id", c.id),
      ),
    );
    if (results.some((r) => r.error)) {
      toast.error("Não foi possível salvar a ordem");
      load();
      return;
    }
    toast.success("Ordem atualizada");
  };

  const reorderCategory = async (fromIndex: number, toIndex: number) => {
    if (!rows) return;
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    const next = [...rows];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    await saveCategoryOrder(next);
  };

  const onDelete = async (c: Category) => {
    if (!(await confirm(`Excluir "${c.name}"? Produtos ficarão sem categoria.`))) return;
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
        <div className="flex-1">
          <h1 className="font-display text-2xl text-foreground">Categorias</h1>
          <p className="text-sm text-muted-foreground">Organize seus produtos por categoria.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" /> Nova categoria
        </button>
      </header>

      <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/60">
        {!rows ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Nenhuma categoria. Clique em "Nova categoria" para criar.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {rows.map((c, index) => (
              <li
                key={c.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(index));
                  setDraggingId(c.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setDragOverId(c.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = Number(e.dataTransfer.getData("text/plain"));
                  setDraggingId(null);
                  setDragOverId(null);
                  void reorderCategory(fromIndex, index);
                }}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDragOverId(null);
                }}
                className={`flex items-center gap-3 py-2 transition ${
                  draggingId === c.id ? "opacity-45" : ""
                } ${
                  dragOverId === c.id && draggingId !== c.id
                    ? "bg-brand/5 ring-1 ring-inset ring-brand/20"
                    : ""
                }`}
              >
                <span
                  className="grid h-8 w-8 cursor-grab place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
                  aria-label="Arrastar categoria"
                  title="Arrastar para ordenar"
                >
                  <GripVertical className="h-4 w-4" />
                </span>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md p-4 sm:p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
          </DialogHeader>
          <form onSubmit={onCreate} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-foreground/80">
                Nome
              </span>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={80}
                placeholder="Ex: Salgados, Bebidas, Doces"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </label>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm font-bold hover:bg-muted/70 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !newName.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 disabled:opacity-50 transition"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Criar
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
