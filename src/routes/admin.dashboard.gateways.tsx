import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, Copy, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard/gateways")({
  component: GatewaysPage,
});

function GatewaysPage() {
  const [loading, setLoading] = useState(false);
  
  // Mercado Pago States
  const [mpActive, setMpActive] = useState(false);
  const [mpPublicKey, setMpPublicKey] = useState("APP_USR-1d786b23-acce-4857-ad97-418949e7feda");
  const [mpAccessToken, setMpAccessToken] = useState("APP_USR-4237224829653865-092216-8e53ce9edb6626294e6063076c652336-3700302220");
  const [mpClientId, setMpClientId] = useState("4237224829653865");
  const [mpClientSecret, setMpClientSecret] = useState("BI42nLRuxYddLfjVI9RxiEoGpO3kgT8V");

  useEffect(() => {
    // Na vida real isso viria do Supabase. Aqui simulamos com localStorage
    const saved = localStorage.getItem("mp_gateway_config");
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setMpActive(config.active || false);
        if (config.publicKey) setMpPublicKey(config.publicKey);
        if (config.accessToken) setMpAccessToken(config.accessToken);
        if (config.clientId) setMpClientId(config.clientId);
        if (config.clientSecret) setMpClientSecret(config.clientSecret);
      } catch(e) {}
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    // Simula salvamento no banco
    await new Promise(r => setTimeout(r, 800));
    
    const config = {
      active: mpActive,
      publicKey: mpPublicKey,
      accessToken: mpAccessToken,
      clientId: mpClientId,
      clientSecret: mpClientSecret
    };
    
    localStorage.setItem("mp_gateway_config", JSON.stringify(config));
    
    setLoading(false);
    toast.success("Configurações do Mercado Pago salvas com sucesso!");
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-extrabold text-gray-900">Gateways de Pagamento</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure os meios de pagamento para receber dos seus clientes automaticamente.
        </p>
      </div>

      <div className="space-y-6">
        {/* Card Mercado Pago */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#009EE3]/10">
                <span className="text-[#009EE3] font-black text-xl">mp</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Mercado Pago</h2>
                <p className="text-xs text-gray-500 mt-0.5">Aceite Pix, Cartões e Boleto</p>
              </div>
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-semibold text-gray-700">Ativar no Checkout</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={mpActive}
                  onChange={(e) => setMpActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </div>
            </label>
          </div>

          <div className="p-6 space-y-6">
            <div className="rounded-lg bg-blue-50 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-1">Como conseguir as credenciais?</p>
                <p>Acesse o painel de desenvolvedores do Mercado Pago, vá em "Suas integrações" e copie a Public Key e Access Token (Credenciais de Produção).</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Public Key</label>
                <input
                  type="text"
                  value={mpPublicKey}
                  onChange={(e) => setMpPublicKey(e.target.value)}
                  placeholder="APP_USR-..."
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm px-4 py-2 border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Access Token</label>
                <input
                  type="password"
                  value={mpAccessToken}
                  onChange={(e) => setMpAccessToken(e.target.value)}
                  placeholder="APP_USR-..."
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm px-4 py-2 border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Client ID</label>
                <input
                  type="text"
                  value={mpClientId}
                  onChange={(e) => setMpClientId(e.target.value)}
                  placeholder="Ex: 4237224829653865"
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm px-4 py-2 border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Client Secret</label>
                <input
                  type="password"
                  value={mpClientSecret}
                  onChange={(e) => setMpClientSecret(e.target.value)}
                  placeholder="Ex: BI42nLRuxYddLfjVI9RxiEoGpO3kgT8V"
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm px-4 py-2 border"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Salvando..." : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
