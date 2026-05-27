import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Plus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard/produtos")({
  component: ProdutosPage,
});

type Product = {
  id: string;
  name: string;
  base_price: number;
  is_active: boolean;
  category_id: string | null;
  categories: { name: string } | null;
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ProdutosPage() {
  const [rows, setRows] = useState<Product[] | null>(null);

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
        <Link
          to="/admin/dashboard/produtos/novo"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
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
                <Link
                  to="/admin/dashboard/produtos/$id"
                  params={{ id: p.id }}
                  className="grid h-8 w-8 place-items-center rounded-lg text-foreground/70 hover:bg-muted"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
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
    </div>
  );
}
