import { createFileRoute } from "@tanstack/react-router";
import { Truck, Plus, Loader2, Trash2, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useConfirm } from "@/providers/ConfirmProvider";

export const Route = createFileRoute("/admin/dashboard/entregas")({
  component: EntregasPage,
});

type Neighborhood = {
  id: string;
  name: string;
  fee: number;
  is_active: boolean;
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function EntregasPage() {
  const { confirm } = useConfirm();
  const [rows, setRows] = useState<Neighborhood[] | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [fee, setFee] = useState(0);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('delivery_neighborhoods').select('*').order('name');
    if (!error && data) {
      setRows(data as any[]);
    } else {
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openForm = (n?: Neighborhood) => {
    if (n) {
      setEditingId(n.id);
      setName(n.name);
      setFee(n.fee);
    } else {
      setEditingId(null);
      setName("");
      setFee(0);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setName("");
    setFee(0);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nome é obrigatório");
    
    if (editingId) {
      const { error } = await supabase.from("delivery_neighborhoods").update({ name, fee }).eq("id", editingId);
      if (error) {
        toast.error("Erro ao atualizar bairro");
        return;
      }
      toast.success("Bairro atualizado");
    } else {
      const { error } = await supabase.from("delivery_neighborhoods").insert({ name, fee, is_active: true });
      if (error) {
        toast.error("Erro ao adicionar bairro");
        return;
      }
      toast.success("Bairro adicionado");
    }
    closeForm();
    load();
  };

  const onToggle = async (n: Neighborhood) => {
    const { error } = await supabase.from("delivery_neighborhoods").update({ is_active: !n.is_active }).eq("id", n.id);
    if (!error) {
      toast.success("Status atualizado");
      load();
    } else {
      toast.error("Erro ao atualizar status");
    }
  };

  const onDelete = async (n: Neighborhood) => {
    if (!(await confirm(`Excluir bairro "${n.name}"?`))) return;
    const { error } = await supabase.from("delivery_neighborhoods").delete().eq("id", n.id);
    if (!error) {
      toast.success("Bairro excluído");
      load();
    } else {
      toast.error("Erro ao excluir bairro");
    }
  };

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
          <Truck className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-foreground">Taxas de Entrega</h1>
          <p className="text-sm text-muted-foreground">Cadastre os bairros e seus respectivos valores de entrega.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-md hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Bairro</span>
        </button>
      </header>

      {isFormOpen && (
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">{editingId ? "Editar Bairro" : "Adicionar Bairro"}</h2>
          <form onSubmit={onSave} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nome do Bairro</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Ex: Centro" 
                className="w-full border border-gray-300 rounded-md p-2"
                autoFocus
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Taxa (R$)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={fee} 
                onChange={e => setFee(parseFloat(e.target.value) || 0)} 
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="button" onClick={closeForm} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200 w-full sm:w-auto">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-brand text-white font-bold rounded-md hover:bg-brand/90 w-full sm:w-auto">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
      ) : rows?.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-500 mb-2">Nenhum bairro cadastrado ainda.</p>
          <button onClick={() => openForm()} className="text-brand font-bold hover:underline">
            Adicionar o primeiro
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Bairro</th>
                <th className="px-4 py-3 font-semibold w-32">Taxa</th>
                <th className="px-4 py-3 font-semibold text-center w-24">Status</th>
                <th className="px-4 py-3 text-right w-32">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows?.map((row) => (
                <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 font-medium text-foreground">{row.name}</td>
                  <td className="px-4 py-4 text-green-600 font-bold">{formatBRL(row.fee)}</td>
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
                        onClick={() => openForm(row)}
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
    </div>
  );
}
