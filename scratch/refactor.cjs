const fs = require('fs');

let content = fs.readFileSync('src/routes/admin.dashboard.cardapio.tsx', 'utf-8');

// 1. Imports
content = content.replace(
  /import \{ useState, useEffect \} from "react";\nimport \{ supabase \} from "@\/integrations\/supabase\/client";/,
  `import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";`
);

content = content.replace(
  /Trash2 } from "lucide-react";/,
  `Trash2, GripVertical } from "lucide-react";`
);


// 2. CardapioPage Logic
const cardapioPageTopRegex = /function CardapioPage\(\) \{[\s\S]*?useEffect\(\(\) => \{\n    loadData\(\);\n  \}, \[\]\);/m;
content = content.replace(cardapioPageTopRegex, `function CardapioPage() {
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
  };`);

// 3. Loading JSX inside CardapioPage
content = content.replace(
  /<div className="py-20 grid place-items-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" \/><\/div>/,
  `<div className="space-y-4">
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
          </div>`
);

content = content.replace(
  /onOpenComboWizard=\{\(\) => setComboWizardOpen\(true\)\} moveCategory=\{moveCategory\} \/>/,
  `onOpenComboWizard={() => setComboWizardOpen(true)} />`
);

content = content.replace(
  /setProducts=\{setProducts\} /,
  ``
);

// 4. CardapioTab Component Replace
const cardapioTabRegex = /function CardapioTab.*?\n\}\n\nfunction ProductListItem/ms;
content = content.replace(cardapioTabRegex, `function SortableCategory({ cat, catProducts, index, onAddExistingProduct, onEdit }: any) {
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
      const { error } = await supabase.from('categories').upsert(updates);
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

function ProductListItem`);

// 5. Adjust ProductListItem delete to use useMutation
content = content.replace(
  /function ProductListItem\(\{ p, onRemove, onEdit \}: any\) \{[\s\S]*?const \[stock, setStock\] = useState<number \| "">\(999\);\n  const \[draftStock, setDraftStock\] = useState<number \| "">\(999\);/m,
  `function ProductListItem({ p, onEdit }: any) {
  const [stockModal, setStockModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stock, setStock] = useState<number | "">(999);
  const [draftStock, setDraftStock] = useState<number | "">(999);
  const queryClient = useQueryClient();

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
    if(confirm(\`Tem certeza que deseja remover \${p.name}?\`)) {
      removeProduct.mutate();
    }
  };`
);

// Remove onSuccess loadData() since queryClient handles invalidation in the wizard success?
// Wait, wizard closes and calls onSuccess which calls loadData. We should replace loadData with queryClient.invalidateQueries.
content = content.replace(
  /loadData\(\);/g,
  `queryClient.invalidateQueries({ queryKey: ['categories'] });\n            queryClient.invalidateQueries({ queryKey: ['products'] });`
);

// But we already replaced the loadData definition, let's fix the loadData calls in the JSX.
// Since wizard onSuccess calls queryClient.invalidateQueries, it will work.

fs.writeFileSync('src/routes/admin.dashboard.cardapio.tsx', content);
console.log("Refactored admin.dashboard.cardapio.tsx successfully.");
