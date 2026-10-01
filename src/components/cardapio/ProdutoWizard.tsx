import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X, ImagePlus, ShoppingCart, Star, ChevronLeft, Heart } from "lucide-react";
import { toast } from "sonner";
import imageCompression from 'browser-image-compression';

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").max(80),
  description: z.string().max(1000).optional(),
  base_price: z.number().min(0, "Preço inválido"),
  category_id: z.string().min(1, "Selecione uma categoria"),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProdutoWizard({ onClose, onSuccess, categories, initialData }: any) {
  const [step, setStep] = useState(initialData ? 2 : 1);
  const [tipo, setTipo] = useState("preparado");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const totalSteps = 5;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      base_price: initialData?.base_price || 0,
      category_id: initialData?.category_id || "",
      image_url: initialData?.image_url || "",
    }
  });

  const nextStep = async () => {
    if (step === 2) {
      const valid = await form.trigger(["name", "description"]);
      if (!valid) return;
    }
    if (step === 3) {
      const valid = await form.trigger(["base_price"]);
      if (!valid) return;
    }
    if (step < totalSteps) setStep(s => s + 1);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
      form.setValue('image_url', publicUrlData.publicUrl);
      toast.success("Imagem enviada com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        const { error } = await supabase.from('products').update({
          name: data.name,
          description: data.description,
          base_price: data.base_price,
          category_id: data.category_id,
          image_url: data.image_url
        }).eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert({
          name: data.name,
          description: data.description,
          base_price: data.base_price,
          category_id: data.category_id,
          image_url: data.image_url,
          is_active: true
        });
        if (error) throw error;
      }

      toast.success(initialData ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao salvar produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[28px] font-bold text-gray-900">
              {step === 1 ? (initialData ? "Editar produto" : "Criar produto") : (initialData ? `Editar produto ${tipo}` : `Criar produto ${tipo}`)}
            </h1>
            <button onClick={onClose} className="flex items-center gap-2 text-sm font-bold text-[#ff0000] hover:bg-red-50 px-3 py-1.5 rounded-md">
              Fechar <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#ff0000]" : "bg-gray-200"}`} />
            ))}
          </div>

          <div className="flex gap-12 mt-8">
            {/* Form area */}
            <div className="flex-1 min-w-0">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Escolha um tipo de produto</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => setTipo("preparado")} className={`text-left p-4 rounded-lg border-2 ${tipo === "preparado" ? "border-[#ff0000]" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-900 text-sm">Preparado</span>
                          <div className={`w-4 h-4 rounded-full border-[5px] ${tipo === "preparado" ? "border-[#ff0000]" : "border-gray-300 bg-white"}`} />
                        </div>
                        <p className="text-xs text-gray-500">Produtos produzidos pela sua loja, como marmitas, bolos, lanches e etc.</p>
                      </button>
                      <button type="button" onClick={() => setTipo("industrializado")} className={`text-left p-4 rounded-lg border-2 ${tipo === "industrializado" ? "border-[#ff0000]" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-900 text-sm">Industrializado</span>
                          <div className={`w-4 h-4 rounded-full border-[5px] ${tipo === "industrializado" ? "border-[#ff0000]" : "border-gray-300 bg-white"}`} />
                        </div>
                        <p className="text-xs text-gray-500">Produtos prontos que sua loja não produz, como chocolates, refrigerantes e etc.</p>
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                    <h2 className="text-xl font-bold text-gray-900">Principais informações</h2>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nome do Produto</label>
                      <input {...form.register("name")} placeholder="Ex: Bolo de Cenoura" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 outline-none" />
                      {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Descrição</label>
                      <textarea {...form.register("description")} rows={4} placeholder="Ex: Bolo fofinho com cobertura de brigadeiro..." className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 outline-none resize-none" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Imagem do produto</label>
                      <div className="flex items-center gap-4">
                        {form.watch("image_url") && (
                          <img src={form.watch("image_url")} alt="Preview" className="w-16 h-16 rounded-md object-cover border border-gray-200" />
                        )}
                        <label className="flex items-center gap-2 border border-[#ff0000] text-[#ff0000] font-semibold text-sm rounded-md px-4 py-2 hover:bg-red-50 cursor-pointer">
                          {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                          {uploadingImage ? "Enviando..." : "Adicionar imagem"}
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                    <h2 className="text-xl font-bold text-gray-900">Valores e estoque</h2>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Preço (R$)</label>
                      <input 
                        type="number" step="0.01" 
                        {...form.register("base_price", { valueAsNumber: true })} 
                        className="w-40 border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] focus:ring-1 outline-none" 
                      />
                      {form.formState.errors.base_price && <p className="text-red-500 text-xs mt-1">{form.formState.errors.base_price.message}</p>}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Variações e Adicionais (Em breve)</h2>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                      🚧 O cadastro de grupos de variações (ex: Sabores, Tamanhos) será adicionado em breve. O produto já pode ser salvo sem variações.
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Disponível em:</h2>
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Selecione uma categoria existente:</label>
                      <select {...form.register("category_id")} className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-[#ff0000] outline-none bg-white">
                        <option value="">Sem categoria</option>
                        {categories.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {form.formState.errors.category_id && <p className="text-red-500 text-xs mt-1">{form.formState.errors.category_id.message}</p>}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Live Phone Preview — shown from step 2 onward */}
            {step >= 2 && (
              <div className="w-[290px] shrink-0 hidden lg:block">
                <div className="sticky top-8">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
                    <span>📱</span>
                    <span>Preview do cliente — tempo real</span>
                  </div>

                  {/* Phone frame */}
                  <div className="relative border-[7px] border-gray-900 rounded-[2.8rem] h-[580px] w-[272px] mx-auto bg-white overflow-hidden shadow-2xl flex flex-col">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 rounded-b-2xl z-20" />

                    {/* Hero Image */}
                    <div className="relative h-52 shrink-0 bg-gradient-to-br from-pink-100 to-amber-100 flex items-center justify-center overflow-hidden">
                      {form.watch("image_url") ? (
                        <img src={form.watch("image_url")} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">🍰</span>
                      )}
                      {/* overlay buttons */}
                      <div className="absolute top-7 left-3 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow">
                        <ChevronLeft className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="absolute top-7 right-3 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow">
                        <Heart className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1">
                          {form.watch("name") || <span className="text-gray-400 font-normal italic">Nome do produto</span>}
                        </h3>
                        {form.watch("base_price") > 0 && (
                          <span className="text-sm font-bold text-[#ff0000] shrink-0">
                            R$ {Number(form.watch("base_price")).toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        ))}
                        <span className="text-[10px] text-gray-500 ml-1">4.0 (27)</span>
                      </div>

                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {form.watch("description") || <span className="italic">A descrição vai aparecer aqui...</span>}
                      </p>

                      <div className="border-t border-gray-100 pt-2">
                        <p className="text-[10px] font-bold text-gray-700 mb-1.5">Variações</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {["P", "M", "G", "GG"].map(s => (
                            <div key={s} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s === "M" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600"}`}>{s}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                      <div className="bg-[#ff0000] rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-red-200">
                        <ShoppingCart className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-bold">
                          {form.watch("base_price") > 0 
                            ? `Adicionar · R$ ${Number(form.watch("base_price")).toFixed(2).replace(".", ",")}` 
                            : "Adicionar ao carrinho"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 bg-white flex justify-end gap-3 absolute bottom-0 w-full left-0 z-50">
        {(initialData ? step > 2 : step > 1) && (
          <button type="button" onClick={() => setStep(s => s - 1)} className="border border-[#ff0000] text-[#ff0000] font-bold text-sm rounded-md px-6 py-2.5 hover:bg-red-50">
            Voltar
          </button>
        )}
        
        {step < totalSteps ? (
          <button type="button" onClick={nextStep} className="bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5">
            Continuar
          </button>
        ) : (
          <button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md px-8 py-2.5 flex items-center gap-2">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? "Salvar produto" : "Criar produto"}
          </button>
        )}
      </div>
    </div>
  );
}
