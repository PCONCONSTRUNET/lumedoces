import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, Trash2, X, Gift, ImagePlus, ToggleLeft, ToggleRight, Package2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard/loja-premios")({
  component: LojaPremiosAdminPage,
});

type RewardItem = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  points_cost: number;
  stock: number | null;
  is_active: boolean;
  created_at: string;
};

const DEFAULT_FORM = {
  name: "",
  description: "",
  image_url: "",
  points_cost: "",
  stock: "",
  is_active: true,
};

function LojaPremiosAdminPage() {
  const db = supabase as any;
  const [items, setItems] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await db
      .from("reward_store_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data);
    setLoading(false);
  }

  function openNew() {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(item: RewardItem) {
    setForm({
      name: item.name,
      description: item.description || "",
      image_url: item.image_url || "",
      points_cost: String(item.points_cost),
      stock: item.stock !== null ? String(item.stock) : "",
      is_active: item.is_active,
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 3MB.");
      return;
    }
    setUploadingImg(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `reward-items/${Date.now()}.${ext}`;
      const { error: upErr } = await db.storage.from("product-images").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = db.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
      toast.success("Imagem enviada!");
    } catch (err: any) {
      toast.error("Erro ao enviar imagem: " + err.message);
    } finally {
      setUploadingImg(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) return toast.error("Informe o nome do prêmio.");
    const cost = parseInt(form.points_cost);
    if (isNaN(cost) || cost <= 0) return toast.error("Informe um custo em pontos válido.");

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        points_cost: cost,
        stock: form.stock !== "" ? parseInt(form.stock) : null,
        is_active: form.is_active,
      };

      if (editingId) {
        const { error } = await db.from("reward_store_items").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Prêmio atualizado!");
      } else {
        const { error } = await db.from("reward_store_items").insert(payload);
        if (error) throw error;
        toast.success("Prêmio adicionado!");
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este prêmio da loja?")) return;
    setDeleting(id);
    const { error } = await db.from("reward_store_items").delete().eq("id", id);
    if (error) toast.error("Erro ao remover.");
    else { toast.success("Prêmio removido."); load(); }
    setDeleting(null);
  }

  async function handleToggleActive(item: RewardItem) {
    await db.from("reward_store_items").update({ is_active: !item.is_active }).eq("id", item.id);
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
    toast.success(item.is_active ? "Prêmio desativado." : "Prêmio ativado.");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand/10 rounded-xl text-brand">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Loja de Prêmios</h1>
            <p className="text-sm text-muted-foreground">Gerencie os itens resgatáveis pelos clientes com pontos.</p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-brand text-white font-bold px-4 py-2.5 rounded-xl hover:bg-brand/90 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo Prêmio
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border flex flex-col items-center">
          <div className="h-16 w-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
            <Package2 className="h-8 w-8 text-brand/50" />
          </div>
          <h2 className="font-bold text-foreground text-lg">Nenhum prêmio cadastrado</h2>
          <p className="text-muted-foreground text-sm mt-1">Clique em "Novo Prêmio" para adicionar o primeiro item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "bg-card border rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all",
                item.is_active ? "border-border" : "border-dashed border-muted opacity-60"
              )}
            >
              {/* Imagem */}
              <div className="h-40 bg-muted relative overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gift className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                {/* Status badge */}
                <div className={cn(
                  "absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-xs font-bold",
                  item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                )}>
                  {item.is_active ? "Ativo" : "Inativo"}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-foreground text-base leading-tight">{item.name}</h3>
                    {item.description && (
                      <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="shrink-0 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1 text-center">
                    <p className="text-amber-700 font-extrabold text-sm leading-none">{item.points_cost}</p>
                    <p className="text-amber-600 text-[10px] font-bold">pts</p>
                  </div>
                </div>

                {item.stock !== null && (
                  <p className="text-xs text-muted-foreground">
                    Estoque: <span className="font-bold text-foreground">{item.stock} unidades</span>
                  </p>
                )}

                {/* Ações */}
                <div className="mt-auto pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-brand transition"
                    title={item.is_active ? "Desativar" : "Ativar"}
                  >
                    {item.is_active
                      ? <ToggleRight className="h-5 w-5 text-emerald-500" />
                      : <ToggleLeft className="h-5 w-5" />}
                    {item.is_active ? "Ativo" : "Inativo"}
                  </button>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-lg bg-muted hover:bg-brand/10 hover:text-brand transition"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="p-2 rounded-lg bg-muted hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Remover"
                    >
                      {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Drawer de Formulário */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header modal */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-bold text-foreground text-lg">
                {editingId ? "Editar Prêmio" : "Novo Prêmio"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl hover:bg-muted transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-4">
              {/* Imagem */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Foto do Prêmio</label>
                <div
                  className="relative h-40 rounded-2xl border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer hover:border-brand/50 transition overflow-hidden"
                  onClick={() => fileRef.current?.click()}
                >
                  {form.image_url ? (
                    <>
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <p className="text-white text-sm font-bold">Trocar imagem</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {uploadingImg ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
                      <p className="text-sm font-medium">{uploadingImg ? "Enviando..." : "Clique para adicionar foto"}</p>
                      <p className="text-xs opacity-60">Máx. 3MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {form.image_url && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                    className="mt-1 text-xs text-rose-500 hover:underline"
                  >
                    Remover imagem
                  </button>
                )}
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Nome do Prêmio *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-muted focus:bg-card focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm font-medium"
                  placeholder="Ex: Brigadeiro Especial Grátis"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-muted focus:bg-card focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm resize-none"
                  placeholder="Descreva o prêmio (opcional)"
                />
              </div>

              {/* Custo em pontos + Estoque */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Custo em Pontos *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.points_cost}
                    onChange={(e) => setForm((f) => ({ ...f, points_cost: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-muted focus:bg-card focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm font-medium"
                    placeholder="Ex: 500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Estoque</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-muted focus:bg-card focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
                    placeholder="Vazio = ilimitado"
                  />
                </div>
              </div>

              {/* Ativo */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <p className="font-bold text-sm text-foreground">Visível na loja</p>
                  <p className="text-xs text-muted-foreground">Clientes poderão visualizar e resgatar este prêmio.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className="transition"
                >
                  {form.is_active
                    ? <ToggleRight className="h-8 w-8 text-emerald-500" />
                    : <ToggleLeft className="h-8 w-8 text-muted-foreground" />}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl border border-border font-bold text-sm hover:bg-muted transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand/90 transition flex items-center justify-center gap-2 shadow-sm"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? "Salvar Alterações" : "Adicionar Prêmio")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

