import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, X, ImagePlus, Check, ChevronRight, Settings, BarChart2, Tag, Pause, MoreVertical, Edit2, Copy, Trash2 } from "lucide-react";
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
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addExistingProductModalOpen, setAddExistingProductModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    // Supabase desconectado a pedido do usuário. Usando apenas dados ilustrativos locais.
    setTimeout(() => {
      const defaultCats = [
        { id: "doces", name: "Doces Saudáveis", sort_order: 1 },
        { id: "salgados", name: "Snacks Saudáveis", sort_order: 2 },
        { id: "bebidas", name: "Bebidas Naturais", sort_order: 3 }
      ];
      
      const savedOrder = localStorage.getItem("categoryOrder");
      if (savedOrder) {
        try {
          const orderArr = JSON.parse(savedOrder);
          defaultCats.sort((a, b) => {
            let indexA = orderArr.indexOf(a.id);
            let indexB = orderArr.indexOf(b.id);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
          });
        } catch (e) {}
      }

      setCategories(defaultCats);
      setProducts([
        { id: "trufa-vegana", name: "Trufa Vegana de Chocolate", description: "Deliciosa trufa de chocolate vegano, polvilhada com cacau 100%. Sem lactose e sem açúcar.", base_price: 8.00, category_id: "doces", image_url: "/src/assets/trufa_vegana.jpg" },
        { id: "bolo-pote-vegano", name: "Bolo de Pote Cenoura e Cacau", description: "Bolo de cenoura vegano intercalado com deliciosa calda de cacau. Sem glúten.", base_price: 18.00, category_id: "doces", image_url: "/src/assets/bolo_pote_vegano.jpg" },
        { id: "coxinha-vegana", name: "Mini Coxinhas Veganas", description: "Porção de mini coxinhas crocantes recheadas de forma 100% vegetal e deliciosa.", base_price: 24.00, category_id: "salgados", image_url: "/src/assets/coxinha_vegana.jpg" },
        { id: "kombucha-frutas", name: "Kombucha Frutas Vermelhas", description: "Refrescante bebida probiótica gaseificada com mix de frutas vermelhas. 100% natural.", base_price: 15.00, category_id: "bebidas", image_url: "/src/assets/kombucha.jpg" }
      ]);
      setLoading(false);
    }, 300); // pequeno delay para simular carregamento suave
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    if (direction === 'up' && index > 0) {
      [newCats[index - 1], newCats[index]] = [newCats[index], newCats[index - 1]];
    } else if (direction === 'down' && index < newCats.length - 1) {
      [newCats[index + 1], newCats[index]] = [newCats[index], newCats[index + 1]];
    } else {
      return;
    }
    setCategories(newCats);
    localStorage.setItem("categoryOrder", JSON.stringify(newCats.map(c => c.id)));
    toast.success("Ordem atualizada com sucesso!");
  };

  const seedTestProducts = async () => {
    setLoading(true);
    try {
      // Create 'Doce 1' category
      const { data: cat1 } = await supabase.from("categories").insert({ name: "Doce 1", is_active: true }).select().single();
      const cat1Id = cat1?.id;

      // Create 'Teste' category
      const { data: cat2 } = await supabase.from("categories").insert({ name: "Teste", is_active: true }).select().single();
      const cat2Id = cat2?.id;

      // Insert products
      if (cat1Id) {
        await supabase.from("products").insert({
          name: "Teste",
          description: "Oferta Simples (Sadas)",
          base_price: 5.00,
          category_id: cat1Id,
          is_active: true,
          image_url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=200"
        });
      }

      if (cat2Id) {
        await supabase.from("products").insert({
          name: "Bolinho Trufado",
          description: "Bolinho de chocolate com recheio cremoso.",
          base_price: 12.50,
          category_id: cat2Id,
          is_active: true,
          image_url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200"
        });
        
        await supabase.from("products").insert({
          name: "Bolo de Pote",
          description: "Bolo de pote sabor ninho com morango.",
          base_price: 15.00,
          category_id: cat2Id,
          is_active: true,
          image_url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=200"
        });
      }

      toast.success("Dados de teste gerados!");
      await loadData();
    } catch (e) {
      toast.error("Erro ao gerar dados");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <div className="py-20 grid place-items-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : activeTab === "Cardápio" ? (
          <CardapioTab categories={categories} products={products} setProducts={setProducts} onAddExistingProduct={(catId: string) => { setSelectedCategoryId(catId); setAddExistingProductModalOpen(true); }} onEdit={(p: any) => { setEditingProduct(p); setWizardOpen(true); }} onOpenComboWizard={() => setComboWizardOpen(true)} moveCategory={moveCategory} />
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
            loadData();
          }}
        />
      )}

      {comboWizardOpen && (
        <ComboWizard
          onClose={() => setComboWizardOpen(false)}
          products={products}
          onSuccess={() => {
            setComboWizardOpen(false);
            loadData();
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
          onSelect={async (productId) => {
            // Update product's category
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, category_id: selectedCategoryId } : p));
            toast.success("Produto adicionado à categoria com sucesso! (Mock)");
            setAddExistingProductModalOpen(false);
            setSelectedCategoryId(null);
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
            // Update product's category (mock)
            setProducts((prev: any[]) => prev.map((p: any) => p.id === productId ? { ...p, category_id: selectedCategoryId } : p));
            toast.success("Produto adicionado à categoria com sucesso! (Mock)");
            setAddExistingProductModalOpen(false);
            setSelectedCategoryId(null);
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// TABS
// ==========================================

function CardapioTab({ categories, products, setProducts, onOpenWizard, onAddExistingProduct, onEdit, moveCategory }: any) {
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

      {categories.map((cat: any, index: number) => {
        const catProducts = products.filter((p: any) => p.category_id === cat.id);
        
        return (
          <div key={cat.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-gray-50/80 px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2 group">
                <div className="flex flex-col mr-2 text-gray-300">
                  <button onClick={() => moveCategory(index, 'up')} disabled={index === 0} className="hover:text-gray-900 disabled:opacity-30 leading-none h-4 px-1">▲</button>
                  <button onClick={() => moveCategory(index, 'down')} disabled={index === categories.length - 1} className="hover:text-gray-900 disabled:opacity-30 leading-none h-4 px-1">▼</button>
                </div>
                <span className="font-bold text-gray-900 text-lg">{cat.name}</span>
                <button 
                  onClick={() => toast.success("Editar categoria em breve (Mock)")}
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
                    onRemove={() => {
                      if(confirm(`Tem certeza que deseja remover ${p.name}?`)) {
                        setProducts((prev: any[]) => prev.filter(prod => prod.id !== p.id));
                        toast.success("Produto removido! (Mock)");
                      }
                    }} 
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductListItem({ p, onRemove, onEdit }: any) {
  const [stockModal, setStockModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stock, setStock] = useState<number | "">(999);
  const [draftStock, setDraftStock] = useState<number | "">(999);

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
              <DialogTitle>Estoque - {p.name}</DialogTitle>
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
                <p className="text-xs text-gray-500 mt-2">Como é um ambiente de teste, as alterações não afetarão o banco real.</p>
              </div>
            </div>
            <DialogFooter>
              <button onClick={() => setStockModal(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-300 transition">
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setStock(draftStock);
                  toast.success("Estoque atualizado com sucesso! (Mock)");
                  setStockModal(false);
                }} 
                className="bg-[#ff0000] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-red-700 transition"
              >
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

function ProdutoWizard({ onClose, onSuccess, categories, initialData }: any) {
  const [step, setStep] = useState(initialData ? 2 : 1);
  const totalSteps = 5;
  
  // Form State
  const [tipo, setTipo] = useState("preparado");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [catId, setCatId] = useState("");
  const [optionGroups, setOptionGroups] = useState<any[]>(
    initialData?.optionGroups || []
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDesc(initialData.description || "");
      setPrice(initialData.base_price ? initialData.base_price.toFixed(2).replace('.', ',') : "");
      setCatId(initialData.category_id || "");
    }
  }, [initialData]);

  const nextStep = () => {
    if (step === 2 && !name.trim()) return toast.error("Preencha o nome do produto");
    if (step < totalSteps) setStep(s => s + 1);
  };

  const updateGroup = (gIdx: number, patch: any) => {
    setOptionGroups(prev => prev.map((g, i) => i === gIdx ? { ...g, ...patch } : g));
  };
  const removeGroup = (gIdx: number) => {
    setOptionGroups(prev => prev.filter((_, i) => i !== gIdx));
  };
  const addOption = (gIdx: number) => {
    setOptionGroups(prev => prev.map((g, i) => i === gIdx ? { ...g, options: [...g.options, { name: "", price: "" }] } : g));
  };
  const updateOption = (gIdx: number, oIdx: number, patch: any) => {
    setOptionGroups(prev => prev.map((g, i) => i === gIdx ? {
      ...g,
      options: g.options.map((o: any, j: number) => j === oIdx ? { ...o, ...patch } : o)
    } : g));
  };
  const removeOption = (gIdx: number, oIdx: number) => {
    setOptionGroups(prev => prev.map((g, i) => i === gIdx ? {
      ...g,
      options: g.options.filter((_: any, j: number) => j !== oIdx)
    } : g));
  };

  const handleFinish = async () => {
    // Supabase desconectado
    toast.success(initialData ? "Produto atualizado com sucesso! (Modo Mock)" : "Produto criado com sucesso! (Modo Mock)");
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-sm text-gray-500 mb-6 font-medium">
            Cardápio <ChevronRight className="inline w-3 h-3 mx-1" /> <span className="text-gray-900 font-bold">Criar produto</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[28px] font-bold text-gray-900">
              {step === 1 ? (initialData ? "Editar produto" : "Criar produto") : (initialData ? `Editar produto ${tipo}` : `Criar produto ${tipo}`)}
            </h1>
            <button onClick={onClose} className="flex items-center gap-2 text-sm font-bold text-[#ff0000] hover:bg-red-50 px-3 py-1.5 rounded-md">
              Fechar <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#ff0000]" : "bg-gray-200"}`} 
              />
            ))}
          </div>
          <div className="text-right text-xs font-bold text-gray-900 mb-12">
            Passo {step} de {totalSteps}
          </div>

          {/* Steps Content */}
          <div className="flex gap-12">
            
            <div className="flex-1 max-w-2xl">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Escolha um tipo de produto</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setTipo("preparado")}
                      className={`text-left p-4 rounded-lg border-2 ${tipo === "preparado" ? "border-[#ff0000]" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900 text-sm">Preparado</span>
                        <div className={`w-4 h-4 rounded-full border-[5px] ${tipo === "preparado" ? "border-[#ff0000]" : "border-gray-300 bg-white"}`} />
                      </div>
                      <p className="text-xs text-gray-500">Produtos produzidos pela sua loja, como marmitas, bolos, lanches e etc.</p>
                    </button>
                    
                    <button 
                      onClick={() => setTipo("industrializado")}
                      className={`text-left p-4 rounded-lg border-2 ${tipo === "industrializado" ? "border-[#ff0000]" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900 text-sm">Industrializado</span>
                        <div className={`w-4 h-4 rounded-full border-[5px] ${tipo === "industrializado" ? "border-[#ff0000]" : "border-gray-300 bg-white"}`} />
                      </div>
                      <p className="text-xs text-gray-500">Produtos prontos que sua loja não produz, como chocolates, chicletes, refrigerantes e etc.</p>
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                  <h2 className="text-xl font-bold text-gray-900">Principais informações</h2>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nome do Produto</label>
                    <input 
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="Ex: Molho pomodoro" maxLength={80}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] outline-none"
                    />
                    <div className="text-right text-[10px] text-gray-500 mt-1">{name.length}/80</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Descrição</label>
                    <textarea 
                      value={desc} onChange={e => setDesc(e.target.value)}
                      placeholder="Ex: Molho de tomate italiano clássico..." rows={4} maxLength={1000}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] outline-none resize-none"
                    />
                    <div className="text-right text-[10px] text-gray-500 mt-1">{desc.length}/1000</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Imagem do produto</label>
                    <button className="flex items-center gap-2 border border-[#ff0000] text-[#ff0000] font-semibold text-sm rounded-md px-4 py-2 hover:bg-red-50">
                      <ImagePlus className="w-4 h-4" /> Adicionar imagem
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                  <h2 className="text-xl font-bold text-gray-900">Valores e estoque</h2>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Preço (R$)</label>
                    <input 
                      value={price} onChange={e => setPrice(e.target.value)}
                      placeholder="0,00"
                      className="w-40 border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Variações e Adicionais</h2>
                    <p className="text-sm text-gray-500 mb-6">Crie grupos de opções (ex: Sabores, Tamanhos) ou adicione itens extras.</p>

                    <div className="space-y-6">
                      {optionGroups.map((group, gIdx) => (
                        <div key={gIdx} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Nome do grupo</label>
                              <input 
                                value={group.name} 
                                onChange={(e) => updateGroup(gIdx, { name: e.target.value })}
                                placeholder="Ex: Escolha o sabor"
                                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] outline-none"
                              />
                            </div>
                            <button onClick={() => removeGroup(gIdx)} className="mt-6 text-gray-400 hover:text-red-500 transition">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center gap-2 mt-6">
                              <input 
                                type="checkbox" 
                                id={`req-${gIdx}`}
                                checked={group.isRequired}
                                onChange={(e) => updateGroup(gIdx, { isRequired: e.target.checked, minSelections: e.target.checked ? Math.max(1, group.minSelections) : 0 })}
                                className="w-4 h-4 rounded border-gray-300 accent-[#ff0000]"
                              />
                              <label htmlFor={`req-${gIdx}`} className="text-sm font-semibold text-gray-700 cursor-pointer">Obrigatório?</label>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Mínimo</label>
                              <input 
                                type="number" min="0"
                                value={group.minSelections}
                                onChange={(e) => updateGroup(gIdx, { minSelections: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Máximo</label>
                              <input 
                                type="number" min="1"
                                value={group.maxSelections}
                                onChange={(e) => updateGroup(gIdx, { maxSelections: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="block text-xs font-semibold text-gray-700">Opções do grupo</label>
                            {group.options.map((opt: any, oIdx: number) => (
                              <div key={oIdx} className="flex gap-3 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="flex-1">
                                  <input 
                                    value={opt.name} 
                                    onChange={(e) => updateOption(gIdx, oIdx, { name: e.target.value })}
                                    placeholder="Ex: Chocolate"
                                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-sm focus:border-[#ff0000] outline-none"
                                  />
                                </div>
                                <div className="w-32 flex items-center border border-gray-300 rounded-md bg-white overflow-hidden focus-within:border-[#ff0000] focus-within:ring-1 focus-within:ring-[#ff0000]">
                                  <span className="px-2 text-xs text-gray-500 font-medium bg-gray-50 border-r border-gray-300">R$</span>
                                  <input 
                                    value={opt.price} 
                                    onChange={(e) => updateOption(gIdx, oIdx, { price: e.target.value })}
                                    placeholder="0,00"
                                    className="w-full p-2 text-sm outline-none"
                                  />
                                </div>
                                <button onClick={() => removeOption(gIdx, oIdx)} className="text-gray-400 hover:text-red-500 p-1">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => addOption(gIdx)}
                              className="text-sm font-semibold text-[#ff0000] hover:text-red-700 flex items-center gap-1 mt-2"
                            >
                              <Plus className="w-4 h-4" /> Adicionar opção
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-4">
                        <button 
                          onClick={() => setOptionGroups([...optionGroups, { name: "", isRequired: true, minSelections: 1, maxSelections: 1, options: [{ name: "", price: "" }] }])} 
                          className="flex-1 flex items-center justify-center gap-2 border border-[#ff0000] text-[#ff0000] font-semibold text-sm rounded-md px-6 py-3 hover:bg-red-50 transition"
                        >
                          <Plus className="w-4 h-4" /> Novo Grupo (ex: Sabores)
                        </button>
                        <button 
                          onClick={() => setOptionGroups([...optionGroups, { name: "", isRequired: false, minSelections: 0, maxSelections: 10, options: [{ name: "", price: "" }] }])} 
                          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold text-sm rounded-md px-6 py-3 hover:bg-gray-50 transition"
                        >
                          <Plus className="w-4 h-4" /> Novos Adicionais (Opcionais)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Disponível em:</h2>
                    <p className="text-sm text-gray-500 mb-6">Adicione o produto em uma ou mais categorias.</p>

                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Selecione uma categoria existente:</label>
                      <select 
                        value={catId} onChange={e => setCatId(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] outline-none bg-white mb-4"
                      >
                        <option value="">Sem categoria (Não recomendado)</option>
                        {categories.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>

                      <div className="text-center py-6 border-t border-gray-200 mt-4">
                        <p className="text-xs text-gray-500 mb-3">Ou crie uma nova categoria</p>
                        <button className="border border-[#ff0000] text-[#ff0000] font-semibold text-sm rounded-md px-6 py-2.5 hover:bg-red-50">
                          + Adicionar categoria
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Preview Panel (Steps 2, 3, 4) */}
            {step > 1 && (
              <div className="w-[300px] shrink-0 hidden md:block">
                <div className="bg-gray-100 rounded-lg p-3 text-center text-xs text-gray-500 mb-4 font-semibold flex items-center justify-center gap-2">
                  <span>📱</span> Essa é uma simulação do seu produto no app
                </div>
                
                <div className="border-[6px] border-gray-900 rounded-[2.5rem] h-[550px] w-[280px] mx-auto bg-white overflow-hidden flex flex-col relative shadow-xl">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20" />
                  
                  <div className="h-40 bg-pink-100 flex items-center justify-center shrink-0">
                    <span className="text-4xl">🍔</span>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{name || "Nome do produto"}</h3>
                    <p className="text-xs text-gray-500 line-clamp-3">{desc || "Descrição"}</p>
                    
                    {step >= 3 && price && (
                      <div className="mt-4 text-green-600 font-bold">R$ {price}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Footer / Nav Buttons */}
      <div className="border-t border-gray-200 p-4 bg-white flex justify-end gap-3 absolute bottom-0 w-full left-0">
        {(initialData ? step > 2 : step > 1) && (
          <button 
            onClick={() => setStep(s => s - 1)}
            className="border border-[#ff0000] text-[#ff0000] font-bold text-sm rounded-md px-6 py-2.5 hover:bg-red-50"
          >
            Voltar
          </button>
        )}
        
        {step < totalSteps ? (
          <button 
            onClick={nextStep}
            className="bg-[#e0e0e0] hover:bg-[#d5d5d5] text-gray-600 font-bold text-sm rounded-md px-6 py-2.5"
          >
            Continuar
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            className="bg-[#ff0000] hover:bg-red-700 text-white font-bold text-sm rounded-md px-6 py-2.5"
          >
            {initialData ? "Salvar alterações" : "Criar produto"}
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// COMBO WIZARD
// ==========================================

function ComboWizard({ onClose, onSuccess, products }: any) {
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  // Step 1
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [maxSelect, setMaxSelect] = useState(2);

  // Step 2
  const [totalPrice, setTotalPrice] = useState("10,00");
  const [discount, setDiscount] = useState("0");

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    if (step === 1 && selectedProductIds.length === 0) {
      return toast.error("Selecione pelo menos um produto para o combo");
    }
    if (step < totalSteps) setStep(s => s + 1);
  };

  const handleFinish = () => {
    toast.success("Combo criado com sucesso! (Mock)");
    onSuccess();
  };

  const finalPriceCalc = () => {
    const total = parseFloat(totalPrice.replace(',', '.') || "0");
    const disc = parseFloat(discount || "0");
    const final = total - (total * (disc / 100));
    return final.toFixed(2).replace('.', ',');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Top Header */}
      <div className="h-16 border-b border-gray-200 flex items-center px-6 justify-between shrink-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-gray-900 text-lg">Criar combo (Passo {step} de {totalSteps})</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        <div className="max-w-4xl mx-auto py-8 px-6">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Adicionar produtos ao combo</h2>
                <p className="text-sm text-gray-500">Selecione os produtos que farão parte deste combo e defina o limite de escolha.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <label className="block mb-4">
                  <span className="block text-sm font-semibold text-gray-900 mb-1.5">Quantidade máxima de itens que o cliente pode escolher:</span>
                  <input 
                    type="number" 
                    value={maxSelect}
                    onChange={(e) => setMaxSelect(Number(e.target.value) || 1)}
                    className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition" 
                  />
                </label>

                <h3 className="font-bold text-gray-900 text-sm mb-3 mt-6">Produtos disponíveis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((p: any) => (
                    <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedProductIds.includes(p.id) ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedProductIds.includes(p.id)}
                        onChange={() => toggleProduct(p.id)}
                        className="w-4 h-4 accent-gray-900"
                      />
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 shrink-0">
                        {p.image_url ? (
                          <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImagePlus className="w-4 h-4"/></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">{p.name}</div>
                        <div className="text-xs text-gray-500">R$ {p.base_price.toFixed(2).replace('.', ',')}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Como irá ofertar seu combo?</h2>
                <p className="text-sm text-gray-500">Escolha a modalidade de oferta e aproveite pra revisar</p>
              </div>

              {/* Opções de Oferta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-500 bg-white p-5 rounded-lg shadow-sm relative cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-[15px]">Preço no combo</h3>
                    <div className="w-4 h-4 rounded-full border-4 border-red-500 bg-white" />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed pr-6">
                    Decida o <span className="font-bold text-gray-900">preço do combo</span> e ofereça <span className="font-bold text-gray-900">um desconto</span>. Isso aumenta as chances dele aparecer nas listas de promoções!
                  </p>
                </div>
                
                <div className="border border-gray-200 bg-white p-5 rounded-lg hover:border-gray-300 transition cursor-not-allowed opacity-60">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-[15px]">Preço nos produtos</h3>
                    <div className="w-4 h-4 rounded-full border border-gray-300 bg-white" />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed pr-6">
                    Cada <span className="font-bold text-gray-900">produto tem um preço</span> e o valor do combo é a soma dos que forem escolhidos pelos clientes. Os produtos separados ajudam a lidar com casos de cancelamentos parciais.
                  </p>
                </div>
              </div>

              {/* Quanto vai custar */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-900 text-[15px] mb-0.5">Quanto vai custar esse combo?</h3>
                    <p className="text-sm text-gray-500">Ofereça um desconto e revise os preços dos seus produtos</p>
                  </div>
                  <button className="w-8 h-8 border border-gray-200 rounded grid place-items-center bg-white shadow-sm text-gray-600">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  </button>
                </div>
                
                <div className="p-5 bg-white space-y-6">
                  {/* Pricing Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Preço total</label>
                      <div className="relative flex items-center border border-gray-200 rounded-md bg-gray-50/50 overflow-hidden focus-within:border-gray-400 focus-within:bg-white transition-colors">
                        <span className="pl-3 pr-1 text-sm font-semibold text-gray-400">R$</span>
                        <input 
                          value={totalPrice}
                          onChange={(e) => setTotalPrice(e.target.value)}
                          className="w-full py-2.5 px-2 bg-transparent text-sm font-semibold text-gray-900 outline-none"
                        />
                        <div className="px-3 text-gray-400">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Desconto</label>
                      <div className="relative flex items-center border border-gray-200 rounded-md bg-white overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all">
                        <span className="pl-3 pr-1 text-sm font-semibold text-gray-400">%</span>
                        <input 
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          className="w-full py-2.5 px-2 bg-transparent text-sm font-semibold text-green-700 outline-none"
                        />
                        <div className="px-3 text-green-600">
                          <Tag className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Preço final</label>
                      <div className="relative flex items-center border border-gray-100 rounded-md bg-gray-100 overflow-hidden opacity-70">
                        <span className="pl-3 pr-1 text-sm font-semibold text-gray-400">R$</span>
                        <input 
                          readOnly
                          value={finalPriceCalc()}
                          className="w-full py-2.5 px-2 bg-transparent text-sm font-semibold text-gray-900 outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Produtos Review */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mt-4">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">99 Obrigatório</span>
                        </div>
                        <p className="text-xs text-gray-500">O cliente poderá escolher até {maxSelect} opções</p>
                      </div>
                      <button className="w-7 h-7 border border-gray-200 rounded grid place-items-center bg-white shadow-sm text-gray-600">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                      </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {selectedProductIds.map(id => {
                        const p = products.find((x: any) => x.id === id);
                        if(!p) return null;
                        return (
                          <div key={id} className="p-4 bg-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden shrink-0">
                                {p.image_url ? (
                                  <img src={p.image_url} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-100" />
                                )}
                              </div>
                              <span className="font-semibold text-sm text-gray-900">{p.name}</span>
                            </div>
                            <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
                              R$ {p.base_price.toFixed(2).replace('.', ',')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Gerais */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-900 text-[15px] mb-0.5">Informações gerais</h3>
                    <p className="text-sm text-gray-500">Defina a disponibilidade do combo em seu cardápio</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Nav */}
      <div className="h-[72px] border-t border-gray-200 bg-white flex justify-end items-center px-6 gap-3 shrink-0 relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {step > 1 && (
          <button 
            onClick={() => setStep(s => s - 1)}
            className="border border-gray-300 text-gray-700 font-bold text-sm rounded-md px-6 py-2.5 hover:bg-gray-50 transition"
          >
            Voltar
          </button>
        )}
        
        {step < totalSteps ? (
          <button 
            onClick={nextStep}
            className="bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5 transition"
          >
            Continuar
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            className="bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5 transition"
          >
            Criar combo
          </button>
        )}
      </div>
    </div>
  );
}
