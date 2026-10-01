import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, ShoppingBag, Truck, Info, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { formatBRL } from "@/store/cart";

export const Route = createFileRoute("/admin/dashboard/configuracoes")({
  component: ConfiguracoesPage,
});

type StoreSettings = {
  id: string;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
  delivery_fee: number;
};

function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<StoreSettings>({
    id: "",
    delivery_enabled: true,
    pickup_enabled: true,
    delivery_fee: 0
  });

  const [feeInput, setFeeInput] = useState("0");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
      
      if (err) {
        if (err.message.includes("Could not find the table")) {
          setError("A tabela 'store_settings' ainda não foi criada no banco de dados.");
        } else {
          throw err;
        }
      } else if (data) {
        setSettings(data as StoreSettings);
        setFeeInput(data.delivery_fee.toString());
      } else {
        // Se a tabela existir mas estiver vazia, cria a primeira linha
        const { data: newData, error: insertErr } = await supabase.from("store_settings").insert({
          delivery_enabled: true,
          pickup_enabled: true,
          delivery_fee: 0
        }).select().single();
        
        if (!insertErr && newData) {
          setSettings(newData as StoreSettings);
          setFeeInput("0");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedFee = parseFloat(feeInput.replace(",", "."));
      if (isNaN(parsedFee) || parsedFee < 0) {
        toast.error("Taxa de entrega inválida");
        setSaving(false);
        return;
      }

      const supabaseAny = supabase as any;
      let saveError: any = null;

      if (settings.id) {
        // Já temos o id — só atualiza
        const { error } = await supabaseAny
          .from("store_settings")
          .update({
            delivery_enabled: settings.delivery_enabled,
            pickup_enabled: settings.pickup_enabled,
            delivery_fee: parsedFee,
            updated_at: new Date().toISOString()
          })
          .eq("id", settings.id);
        saveError = error;
      } else {
        // Nenhuma linha existe ainda — insere
        const { data: newRow, error } = await supabaseAny
          .from("store_settings")
          .insert({
            delivery_enabled: settings.delivery_enabled,
            pickup_enabled: settings.pickup_enabled,
            delivery_fee: parsedFee,
          })
          .select()
          .single();
        if (newRow) setSettings((s: any) => ({ ...s, id: newRow.id }));
        saveError = error;
      }

      const err = saveError;

      if (err) throw err;
      
      setSettings(s => ({ ...s, delivery_fee: parsedFee }));
      toast.success("Configurações salvas com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <Info className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h2 className="mb-2 text-xl font-bold text-amber-800">Atenção!</h2>
          <p className="text-amber-700 max-w-lg mx-auto mb-6">{error}</p>
          <p className="text-sm text-amber-600">Por favor, execute o script SQL de criação da tabela no Supabase para continuar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
          <Settings2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações da Loja</h1>
          <p className="text-gray-500">Gerencie taxas, fretes e opções de retirada</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-brand" /> Opções de Entrega e Retirada
            </h2>
            
            <div className="space-y-6">
              {/* Toggle Retirada */}
              <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center gap-4">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${settings.pickup_enabled ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-400'}`}>
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Retirada no Local</p>
                    <p className="text-sm text-gray-500">Permitir que clientes busquem o pedido no estabelecimento</p>
                  </div>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.pickup_enabled}
                    onChange={(e) => setSettings({...settings, pickup_enabled: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                </div>
              </label>

              {/* Toggle Entrega */}
              <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-center gap-4">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${settings.delivery_enabled ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-400'}`}>
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Entrega Delivery</p>
                    <p className="text-sm text-gray-500">Realizar entregas de pedidos no endereço do cliente</p>
                  </div>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.delivery_enabled}
                    onChange={(e) => setSettings({...settings, delivery_enabled: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                </div>
              </label>

              {/* Taxa de Entrega */}
              {settings.delivery_enabled && (
                <div className="pt-2 pl-14 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Taxa de Entrega Fixa
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={feeInput}
                      onChange={(e) => setFeeInput(e.target.value)}
                      className="w-32 rounded-xl border border-gray-200 bg-white px-3 py-2 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition"
                    />
                    <span className="text-sm text-gray-400 ml-2">Ex: 5.00 ou 12.50</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand/90 disabled:opacity-50 shadow-sm"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? "Salvando..." : "Salvar Configurações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
