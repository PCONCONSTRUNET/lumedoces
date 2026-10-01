import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { ProdutoWizard } from "@/components/cardapio/ProdutoWizard";
import { ComboWizard } from "@/components/cardapio/ComboWizard";
import { Loader2, Plus, X, ImagePlus, Check, ChevronRight, Settings, BarChart2, Tag, Pause, MoreVertical, Edit2, Copy, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/dashboard/cardapio")({
  component: CardapioPage,
});

function CardapioPage() {
  const [activeTab, setActiveTab] = useState("Cardápio");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [comboWizardOpen, setComboWizardOpen] = useState(false);
  const [addExistingProductModalOpen, setAddExistingProductModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: products = [], isLoading: isLoadingProds } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("name", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const loading = isLoadingCats || isLoadingProds;

  const seedTestProducts = async () => {
    toast.info("A geração de dados de teste foi desativada na nova versão para não sujar o banco de dados.");
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 min-h-[calc(100vh-6rem)]">
      <div className="border-b border-gray-200 p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cardápio</h1>
            <p className="text-sm text-gray-500 mt-1">Defina quais os itens seus clientes podem pedir pelo app</p>
          </div>
          <div className="flex gap-2">
            <button onClick={seedTestProducts} className="bg-orange-100 text-orange-700 text-xs font-bold px-3 rounded-md hover:bg-orange-200">
              Gerar Dados Teste
            </button>
            <button className="grid place-items-center h-10 w-10 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
            <button className="grid place-items-center h-10 w-10 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
              <BarChart2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6">
          {["Cardápio", "Produtos", "Complementos", "PDV"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#ff0000] text-[#ff0000]"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="pb-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-900 flex items-center gap-2">
            Otimizador de cardápio
            <span className="bg-[#ff0000]/10 text-[#ff0000] text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Novo</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm animate-pulse">
                <div className="bg-gray-50/80 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="p-4 flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "Cardápio" ? (
          <CardapioTab categories={categories} products={products} onAddExistingProduct={(catId: string) => { setSelectedCategoryId(catId); setAddExistingProductModalOpen(true); }} onEdit={(p: any) => { setEditingProduct(p); setWizardOpen(true); }} onOpenComboWizard={() => setComboWizardOpen(true)} />
        ) : activeTab === "Produtos" ? (
          <ProdutosTab products={products} categories={categories} onOpenWizard={() => { setEditingProduct(null); setWizardOpen(true); }} onEdit={(p: any) => { setEditingProduct(p); setWizardOpen(true); }} />
        ) : (
          <div className="py-20 text-center text-gray-500">Em breve</div>
        )}
      </div>

      {wizardOpen && (
        <ProdutoWizard 
          onClose={() => setWizardOpen(false)} 
          categories={categories}
          initialData={editingProduct}
          onSuccess={() => {
            setWizardOpen(false);
            setEditingProduct(null);
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
          }}
        />
      )}

      {comboWizardOpen && (
        <ComboWizard
          onClose={() => setComboWizardOpen(false)}
          products={products}
          onSuccess={() => {
            setComboWizardOpen(false);
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
          }}
        />
      )}

      {addExistingProductModalOpen && selectedCategoryId && (
        <AddExistingProductModal
          onClose={() => {
            setAddExistingProductModalOpen(false);
            setSelectedCategoryId(null);
          }}
          categoryId={selectedCategoryId}
          allProducts={products}
          onSelect={async (productId: string) => {
            try {
              const { error } = await supabase.from("products").update({ category_id: selectedCategoryId }).eq("id", productId);
              if (error) throw error;
              queryClient.setQueryData(['products'], (prev: any[]) => prev.map((p: any) => p.id === productId ? { ...p, category_id: selectedCategoryId } : p));
              toast.success("Produto vinculado à categoria!");
            } catch (err: any) {
              console.error(err);
              toast.error("Erro ao vincular produto");
            } finally {
              setAddExistingProductModalOpen(false);
              setSelectedCategoryId(null);
            }
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// TABS
// ==========================================

function SortableCategory({ cat, catProducts, index, onAddExistingProduct, onEdit }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm relative">
      <div className="bg-gray-50/80 px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2 group">
          <div {...attributes} {...listeners} className="text-gray-400 hover:text-gray-900 cursor-grab active:cursor-grabbing mr-2 px-1">
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 text-lg">{cat.name}</span>
          <button 
            onClick={() => toast.success("Editar categoria em breve")}
            className="w-7 h-7 rounded grid place-items-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Editar categoria"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500 ml-2">({catProducts.length} item{catProducts.length !== 1 ? 's' : ''})</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-md px-3 py-1.5">Criar combo</button>
          <button 
            onClick={() => onAddExistingProduct(cat.id)}
            className="bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-md px-3 py-1.5"
          >
            Adicionar produto
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {catProducts.length === 0 ? (
          <div className="p-4 flex items-center justify-center">
            <button onClick={() => onAddExistingProduct(cat.id)} className="w-full max-w-xl py-3 border border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Adicionar produto
            </button>
          </div>
        ) : (
          catProducts.map((p: any) => (
            <ProductListItem 
              key={p.id} 
              p={p} 
              onEdit={() => onEdit(p)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CardapioTab({ categories, products, onOpenWizard, onAddExistingProduct, onEdit }: any) {
  const queryClient = useQueryClient();
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reorderCategories = useMutation({
    mutationFn: async (newOrder: any[]) => {
      const updates = newOrder.map((c, idx) => ({ id: c.id, sort_order: idx }));
      const { error } = await supabase.from('categories').upsert(updates as any);
      if (error) throw error;
    },
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previous = queryClient.getQueryData(['categories']);
      queryClient.setQueryData(['categories'], newOrder);
      return { previous };
    },
    onError: (err, newOrder, context: any) => {
      queryClient.setQueryData(['categories'], context.previous);
      toast.error("Erro ao salvar ordem das categorias.");
    }
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = categories.findIndex((c: any) => c.id === active.id);
      const newIndex = categories.findIndex((c: any) => c.id === over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      reorderCategories.mutate(newOrder);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-24">
        <h3 className="text-lg font-bold text-gray-900">Seu cardápio está vazio</h3>
        <p className="text-sm text-gray-500 mt-2 mb-6">Comece criando categorias e adicionando seus produtos.</p>
        <button onClick={onOpenWizard} className="bg-[#ff0000] text-white font-bold rounded-md px-6 py-2">
          Criar produto
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-8">
        <input 
          placeholder="Buscar um item" 
          className="flex-1 h-10 border border-gray-300 rounded-md px-4 text-sm"
        />
        <select className="flex-1 h-10 border border-gray-300 rounded-md px-4 text-sm bg-white">
          <option value="">Selecionar categoria</option>
        </select>
        <button className="h-10 border border-gray-300 rounded-md px-4 text-sm font-semibold hover:bg-gray-50">
          Criar categoria
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
          {categories.map((cat: any, index: number) => {
            const catProducts = products.filter((p: any) => p.category_id === cat.id);
            return (
              <SortableCategory 
                key={cat.id} 
                cat={cat} 
                catProducts={catProducts} 
                index={index} 
                onAddExistingProduct={onAddExistingProduct} 
                onEdit={onEdit} 
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function ProductListItem({ p, onEdit }: any) {
  const [stockModal, setStockModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stock, setStock] = useState<number | "">(999);
  const [draftStock, setDraftStock] = useState<number | "">(999);
  const queryClient = useQueryClient();

  const updateStock = useMutation({
    mutationFn: async (newStock: number) => {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock } as any)
        .eq('id', p.id);
      if (error) throw error;

      // Audit log: record who changed what and when
      await supabase.from('product_audit_log' as any).insert({
        product_id: p.id,
        product_name: p.name,
        field_changed: 'stock',
        old_value: String(stock),
        new_value: String(newStock),
        changed_at: new Date().toISOString(),
      }).maybeSingle();
    },
    onMutate: async (newStock) => {
      const previous = stock;
      setStock(newStock);
      return { previous };
    },
    onError: (err, newStock, context: any) => {
      setStock(context.previous);
      toast.error("Erro ao atualizar estoque.");
    },
    onSuccess: (_, newStock) => {
      toast.success(`Estoque atualizado para ${newStock} unidades!`);
    }
  });

  const removeProduct = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('products').delete().eq('id', p.id);
      if (error) throw error;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData(['products']);
      queryClient.setQueryData(['products'], (old: any) => old.filter((prod: any) => prod.id !== p.id));
      return { previous };
    },
    onError: (err, variables, context: any) => {
      queryClient.setQueryData(['products'], context.previous);
      toast.error("Erro ao remover produto.");
    },
    onSuccess: () => toast.success("Produto removido com sucesso!")
  });

  const onRemove = () => {
    if(confirm(`Tem certeza que deseja remover ${p.name}?`)) {
      removeProduct.mutate();
    }
  };

  return (
    <div className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 group transition border-b border-gray-100 last:border-0 relative">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
          {p.image_url ? (
            <img src={p.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-[15px]">{p.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-gray-900 border border-gray-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Oferta Simples
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            setDraftStock(stock);
            setStockModal(true);
          }}
          className="text-[13px] font-semibold text-gray-600 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center gap-1.5"
        >
          <span>Estoque</span>
          <span className="bg-gray-200 text-gray-800 rounded-md px-1.5 py-0.5 text-[11px] leading-none tabular-nums font-bold">
            {stock !== "" ? stock : 0}
          </span>
        </button>
        
        <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden h-8">
          <div className="px-3 py-1.5 text-[13px] font-semibold text-gray-900 tabular-nums border-r border-gray-300 flex items-center h-full">
            R$ {p.base_price.toFixed(2).replace('.', ',')}
          </div>
          <button className="px-2 h-full hover:bg-gray-100 text-gray-500 grid place-items-center">
            <Tag className="w-3.5 h-3.5" />
          </button>
        </div>

        <button className="w-8 h-8 rounded-md border border-gray-300 grid place-items-center hover:bg-gray-100 text-gray-500">
          <Pause className="w-4 h-4 fill-current" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-8 h-8 rounded-md border border-gray-300 grid place-items-center text-gray-500 transition ${menuOpen ? 'bg-gray-900 text-white border-gray-900' : 'hover:bg-gray-100'}`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white border border-gray-200 shadow-xl rounded-lg py-2 z-50">
                <button onClick={() => { setMenuOpen(false); onEdit(); }} className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <Edit2 className="w-4 h-4" /> Editar item
                </button>
                <button onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <Copy className="w-4 h-4" /> Duplicar item
                </button>
                <button onClick={() => { setMenuOpen(false); onRemove(); }} className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3">
                  <Trash2 className="w-4 h-4" /> Remover item
                </button>
                <div className="absolute -top-1.5 right-2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45" />
              </div>
            </>
          )}
        </div>
      </div>

      {stockModal && (
        <Dialog open={stockModal} onOpenChange={setStockModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Estoque — {p.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantidade em estoque</label>
                <input 
                  type="number" 
                  value={draftStock}
                  onChange={(e) => setDraftStock(e.target.value ? Number(e.target.value) : "")}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] outline-none" 
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  <span>📋</span> Salvo no banco + registrado no histórico de auditoria.
                </p>
              </div>
            </div>
            <DialogFooter>
              <button onClick={() => setStockModal(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-300 transition">
                Cancelar
              </button>
              <button 
                disabled={updateStock.isPending}
                onClick={() => {
                  if (draftStock !== "") {
                    updateStock.mutate(Number(draftStock));
                    setStockModal(false);
                  }
                }} 
                className="bg-[#ff0000] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-red-700 transition flex items-center gap-2"
              >
                {updateStock.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar alterações
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ProdutosTab({ products, categories, onOpenWizard, onEdit }: any) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button className="h-10 px-4 border border-gray-900 rounded-full text-sm font-semibold text-gray-900 bg-white">Todos</button>
        <button className="h-10 px-4 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50">Pausados</button>
        <button className="h-10 px-4 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50">Ativos</button>
        
        <input 
          placeholder="Buscar produtos" 
          className="flex-1 h-10 border border-gray-300 rounded-full px-4 text-sm ml-4"
        />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <h3 className="text-lg font-bold text-gray-900">Sem produtos cadastrados</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">Que tal começar a criar os produtos para disponibilizá-los em ofertas no seu cardápio?</p>
          <button onClick={onOpenWizard} className="bg-gray-900 text-white text-sm font-bold rounded-md px-6 py-2.5 flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" /> Criar produto
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_200px_200px_100px] gap-4 p-4 px-6 bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-700">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
              <span>Produtos</span>
            </div>
            <div>Classificação</div>
            <div>Disponível em</div>
            <div className="text-right">Ações</div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {products.map((p: any) => {
              const catName = categories.find((c: any) => c.id === p.category_id)?.name || "Sem categoria";
              return (
                <div key={p.id} className="grid grid-cols-[1fr_200px_200px_100px] gap-4 p-4 px-6 items-center hover:bg-gray-50 transition group">
                  {/* Produto Info */}
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500">{catName}</div>
                    </div>
                  </div>

                  {/* Classificação */}
                  <div className="text-sm text-gray-600 font-medium">
                    Item principal
                  </div>

                  {/* Disponível em */}
                  <div className="text-sm text-gray-600 font-medium">
                    {catName}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(p)} className="w-8 h-8 rounded-md border border-gray-300 grid place-items-center hover:bg-gray-100 text-gray-500" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-md border border-gray-300 grid place-items-center hover:bg-gray-100 text-gray-500" title="Pausar">
                      <Pause className="w-4 h-4 fill-current" />
                    </button>
                    <button className="w-8 h-8 rounded-md border border-gray-300 grid place-items-center hover:bg-red-50 text-red-500 hover:border-red-200 hover:text-red-600" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// WIZARD
// ==========================================

function AddExistingProductModal({ onClose, categoryId, allProducts, onSelect }: any) {
  const [search, setSearch] = useState("");
  // filter products not already in this category
  const available = allProducts.filter((p: any) => p.category_id !== categoryId);
  const filtered = available.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar produto existente</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum produto encontrado.</p>
            ) : (
              filtered.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200 transition text-left"
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                      <ImagePlus className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.base_price ? `R$ ${Number(p.base_price).toFixed(2).replace('.', ',')}` : 'Sem preço'}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-200 transition">
            Cancelar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
