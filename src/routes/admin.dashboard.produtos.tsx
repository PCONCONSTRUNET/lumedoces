import { createFileRoute } from "@tanstack/react-router";
import { Package, Plus, Loader2, Trash2, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProdutoWizard } from "@/components/cardapio/ProdutoWizard";
import { useConfirm } from "@/providers/ConfirmProvider";

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
  image_url: string | null;
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ProdutosPage() {
  const { confirm } = useConfirm();
  const [rows, setRows] = useState<Product[] | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<any>(null);

  const load = async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('name'),
      supabase.from('categories').select('*').order('sort_order')
    ]);
    if (!prodRes.error && prodRes.data) setRows(prodRes.data as any[]);
    else setRows([]);
    if (!catRes.error && catRes.data) setCats(catRes.data as any[]);
  };

  useEffect(() => {
    load();
  }, []);

  const onToggle = async (p: Product) => {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    toast.success("Status atualizado");
    load();
  };

  const onDelete = async (p: Product) => {
    if (!(await confirm(`Excluir "${p.name}"?`))) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (!error) {
      toast.success("Produto excluído");
      setRows(prev => prev ? prev.filter(prod => prod.id !== p.id) : null);
    } else {
      toast.error("Erro ao excluir");
    }
  };

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <Package className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground">Cadastre e gerencie o cardápio (Visão Tabela).</p>
        </div>
        <button
          onClick={() => {
            setEditingProd(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Produto</span>
        </button>
      </header>

      {rows === null ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">Nenhum produto cadastrado ainda.</p>
          <button onClick={() => setOpen(true)} className="text-brand font-bold hover:underline">
            Adicionar o primeiro produto
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Preço Base</th>
                <th className="px-4 py-3 font-semibold text-center w-24">Status</th>
                <th className="px-4 py-3 text-right w-32">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 font-medium text-foreground flex items-center gap-3">
                    {row.image_url ? (
                      <img src={row.image_url} alt="" className="w-10 h-10 rounded-md object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    {row.name}
                  </td>
                  <td className="px-4 py-4 text-gray-500">{row.categories?.name || "Sem categoria"}</td>
                  <td className="px-4 py-4 font-bold text-gray-700">{formatBRL(row.base_price)}</td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => onToggle(row)}
                      className={`inline-flex w-16 justify-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        row.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {row.is_active ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingProd(row);
                          setOpen(true);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(row)}
                        className="grid h-8 w-8 place-items-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <ProdutoWizard
          onClose={() => {
            setOpen(false);
            setEditingProd(null);
          }}
          onSuccess={() => {
            setOpen(false);
            setEditingProd(null);
            load();
          }}
          categories={cats}
          initialData={editingProd}
        />
      )}
    </div>
  );
}
