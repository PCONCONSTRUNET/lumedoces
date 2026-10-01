import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X, ImagePlus, Tag } from "lucide-react";
import { toast } from "sonner";

const comboSchema = z.object({
  name: z.string().min(1, "Nome do combo obrigatório").max(80),
  description: z.string().max(1000).optional(),
  maxSelect: z.number().min(1, "O limite mínimo é 1"),
  totalPrice: z.number().min(0),
  discount: z.number().min(0).max(100),
  selectedProductIds: z.array(z.string()).min(1, "Selecione pelo menos um produto"),
});

type ComboFormValues = z.infer<typeof comboSchema>;

export function ComboWizard({ onClose, onSuccess, products }: any) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 2;

  const form = useForm<ComboFormValues>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      name: "Novo Combo",
      description: "Monte o seu combo especial.",
      maxSelect: 2,
      totalPrice: 10.00,
      discount: 0,
      selectedProductIds: [],
    }
  });

  const selectedProductIds = form.watch("selectedProductIds");
  const maxSelect = form.watch("maxSelect");
  const totalPrice = form.watch("totalPrice");
  const discount = form.watch("discount");

  const toggleProduct = (id: string) => {
    const current = form.getValues("selectedProductIds");
    if (current.includes(id)) {
      form.setValue("selectedProductIds", current.filter(x => x !== id));
    } else {
      form.setValue("selectedProductIds", [...current, id]);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      if (selectedProductIds.length === 0) {
        return toast.error("Selecione pelo menos um produto para o combo");
      }
      form.setValue("totalPrice", selectedProductIds.reduce((acc, id) => {
        const p = products.find((x: any) => x.id === id);
        return acc + (p?.base_price || 0);
      }, 0));
    }
    if (step < totalSteps) setStep(s => s + 1);
  };

  const finalPriceCalc = () => {
    const final = totalPrice - (totalPrice * (discount / 100));
    return final.toFixed(2).replace('.', ',');
  };

  const onSubmit = async (data: ComboFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real database this would go to a combos table or products table with a is_combo flag.
      // But for now, we will add it as a normal product with is_combo flag if it exists, or just a product.
      const finalPrice = data.totalPrice - (data.totalPrice * (data.discount / 100));

      const { data: newProd, error } = await supabase.from('products').insert({
        name: data.name,
        description: data.description,
        base_price: finalPrice,
        is_active: true,
      }).select().single();

      if (error) throw error;

      // Real app: insert relation in combo_products table

      toast.success("Combo criado com sucesso!");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao criar combo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="h-16 border-b border-gray-200 flex items-center px-6 justify-between shrink-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-gray-900 text-lg">Criar combo (Passo {step} de {totalSteps})</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        <div className="max-w-4xl mx-auto py-8 px-6">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Adicionar produtos ao combo</h2>
                <p className="text-sm text-gray-500">Selecione os produtos que farão parte deste combo e defina o limite de escolha.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Nome do Combo:</label>
                  <input 
                    {...form.register("name")}
                    placeholder="Ex: Combo Família"
                    className="w-full sm:w-96 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-gray-900 focus:ring-1 outline-none transition" 
                  />
                  {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                </div>
                <label className="block mb-4">
                  <span className="block text-sm font-semibold text-gray-900 mb-1.5">Quantidade máxima de itens que o cliente pode escolher:</span>
                  <input 
                    type="number" 
                    {...form.register("maxSelect", { valueAsNumber: true })}
                    className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-gray-900 focus:ring-1 outline-none transition" 
                  />
                  {form.formState.errors.maxSelect && <p className="text-red-500 text-xs mt-1">{form.formState.errors.maxSelect.message}</p>}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-500 bg-white p-5 rounded-lg shadow-sm relative cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-[15px]">Preço no combo</h3>
                    <div className="w-4 h-4 rounded-full border-4 border-red-500 bg-white" />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed pr-6">
                    Decida o <span className="font-bold text-gray-900">preço do combo</span> e ofereça <span className="font-bold text-gray-900">um desconto</span>.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-900 text-[15px] mb-0.5">Quanto vai custar esse combo?</h3>
                    <p className="text-sm text-gray-500">Ofereça um desconto e revise os preços dos seus produtos</p>
                  </div>
                </div>
                
                <div className="p-5 bg-white space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Preço total</label>
                      <div className="relative flex items-center border border-gray-200 rounded-md bg-gray-50/50 overflow-hidden focus-within:border-gray-400 focus-within:bg-white transition-colors">
                        <span className="pl-3 pr-1 text-sm font-semibold text-gray-400">R$</span>
                        <input 
                          type="number" step="0.01"
                          {...form.register("totalPrice", { valueAsNumber: true })}
                          className="w-full py-2.5 px-2 bg-transparent text-sm font-semibold text-gray-900 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Desconto (%)</label>
                      <div className="relative flex items-center border border-gray-200 rounded-md bg-white overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all">
                        <span className="pl-3 pr-1 text-sm font-semibold text-gray-400">%</span>
                        <input 
                          type="number" min="0" max="100"
                          {...form.register("discount", { valueAsNumber: true })}
                          className="w-full py-2.5 px-2 bg-transparent text-sm font-semibold text-green-700 outline-none"
                        />
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

                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mt-4">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Obrigatório</span>
                        </div>
                        <p className="text-xs text-gray-500">O cliente poderá escolher até {maxSelect} opções</p>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {selectedProductIds.map((id: string) => {
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
            </div>
          )}

        </div>
      </div>

      <div className="h-[72px] border-t border-gray-200 bg-white flex justify-end items-center px-6 gap-3 shrink-0 relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {step > 1 && (
          <button 
            type="button"
            onClick={() => setStep(s => s - 1)}
            className="border border-gray-300 text-gray-700 font-bold text-sm rounded-md px-6 py-2.5 hover:bg-gray-50 transition"
          >
            Voltar
          </button>
        )}
        
        {step < totalSteps ? (
          <button 
            type="button"
            onClick={nextStep}
            className="bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5 transition"
          >
            Continuar
          </button>
        ) : (
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5 transition flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Criar combo
          </button>
        )}
      </div>
    </div>
  );
}
