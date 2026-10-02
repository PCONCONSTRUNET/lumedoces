import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, MapPin, Plus, Trash2, Navigation, CheckCircle2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { lazy, Suspense } from "react";
import { useConfirm } from "@/providers/ConfirmProvider";

const MapPicker = lazy(() => import("@/components/site/MapPicker"));

export const Route = createFileRoute("/enderecos")({
  component: EnderecosPage,
});

export type Address = {
  id: string;
  title?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat?: number;
  lng?: number;
};


function EnderecosPage() {
  const { confirm } = useConfirm();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [mapVisible, setMapVisible] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    title: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setAddresses(session.user.user_metadata?.addresses || []);
      }
      setLoading(false);
    });
  }, []);

  const handleOpenMap = async () => {
    setGettingLocation(true);

    if (newAddress.lat && newAddress.lng) {
      const coords: [number, number] = [newAddress.lat, newAddress.lng];
      setMapCenter(coords);
      setSelectedPos(coords);
      setMapVisible(true);
      setGettingLocation(false);
      return;
    }

    const addressSearch = [newAddress.street, newAddress.city, newAddress.state].filter(Boolean).join(", ");
    
    if (addressSearch.length > 5) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setMapCenter(coords);
          setSelectedPos(coords);
          setMapVisible(true);
          setGettingLocation(false);
          toast.success("Mapa centrado no endereço atual!");
          return;
        }
      } catch (err) {
        console.error("Erro na busca de endereço", err);
      }
    }

    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada pelo seu navegador.");
      setGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setMapCenter(coords);
        setSelectedPos(coords);
        setMapVisible(true);
        setGettingLocation(false);
      },
      (error) => {
        console.error(error);
        toast.error("Não conseguimos acessar seu GPS. Arraste o mapa para sua localização.");
        // Centro padrão caso falhe
        const defaultCoords: [number, number] = [-28.6757, -49.3731];
        setMapCenter(defaultCoords);
        setSelectedPos(defaultCoords);
        setMapVisible(true);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleConfirmMapLocation = async () => {
    if (!selectedPos) return;
    setGettingLocation(true);
    
    try {
      const [lat, lon] = selectedPos;
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
      const data = await res.json();
      
      let addr = data && data.address ? data.address : {};
      
      let zip = addr.postcode || "";
      if (zip) zip = zip.replace("-", "");
      if (zip.length > 5) zip = `${zip.slice(0, 5)}-${zip.slice(5)}`;
      
      const newAddr: Address = {
        id: crypto.randomUUID(),
        street: addr.road || addr.pedestrian || addr.street || "Endereço via Mapa",
        number: "S/N",
        neighborhood: addr.suburb || addr.neighbourhood || addr.city_district || "Bairro não especificado",
        city: addr.city || addr.town || addr.village || addr.municipality || "Cidade não especificada",
        state: addr.state || "SC",
        zipCode: zip || "00000-000",
        lat: lat,
        lng: lon
      };

      const updatedAddresses = [...addresses, newAddr];
      const success = await saveAddressesToMeta(updatedAddresses);
      
      if (success) {
        toast.success("Endereço adicionado com sucesso pelo mapa!");
        setMapVisible(false);
        setShowAddForm(false);
        setNewAddress({
          title: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "", lat: undefined, lng: undefined
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar endereço do mapa.");
    } finally {
      setGettingLocation(false);
    }
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, "");
    if (cep.length > 8) cep = cep.slice(0, 8);
    
    let formattedCep = cep;
    if (cep.length > 5) {
      formattedCep = `${cep.slice(0, 5)}-${cep.slice(5)}`;
    }
    
    setNewAddress(prev => ({ ...prev, zipCode: formattedCep }));

    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setNewAddress(prev => ({
            ...prev,
            street: prev.street || data.logradouro,
            neighborhood: prev.neighborhood || data.bairro,
            city: prev.city || data.localidade,
            state: prev.state || data.uf,
          }));
          toast.success("Endereço preenchido pelo CEP!");
        }
      } catch (err) {
        console.error("Erro no ViaCEP", err);
      }
    }
  };

  const saveAddressesToMeta = async (newAddresses: Address[]) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { addresses: newAddresses }
      });
      
      if (error) throw error;
      setAddresses(newAddresses);
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao salvar endereço: " + err.message);
      return false;
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const addr: Address = {
      id: editingId || crypto.randomUUID(),
      title: newAddress.title || "",
      street: newAddress.street || "",
      number: newAddress.number || "",
      complement: newAddress.complement || "",
      neighborhood: newAddress.neighborhood || "",
      city: newAddress.city || "",
      state: newAddress.state || "",
      zipCode: newAddress.zipCode || "",
      lat: newAddress.lat,
      lng: newAddress.lng,
    };

    let updatedAddresses;
    if (editingId) {
      updatedAddresses = addresses.map(a => a.id === editingId ? addr : a);
    } else {
      updatedAddresses = [...addresses, addr];
    }
    const success = await saveAddressesToMeta(updatedAddresses);
    
    if (success) {
      toast.success(editingId ? "Endereço atualizado com sucesso!" : "Endereço adicionado com sucesso!");
      setShowAddForm(false);
      setEditingId(null);
      setNewAddress({
        title: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        lat: undefined,
        lng: undefined,
      });
    }
    setSaving(false);
  };

  const handleEdit = (addr: Address) => {
    setNewAddress(addr);
    setEditingId(addr.id);
    setShowAddForm(true);
  };

  const handleRemove = async (id: string) => {
    if (!(await confirm("Tem certeza que deseja remover este endereço?"))) return;
    const updatedAddresses = addresses.filter(a => a.id !== id);
    const success = await saveAddressesToMeta(updatedAddresses);
    if (success) {
      toast.success("Endereço removido.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream/30">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-cream/30 flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-sm border border-gray-100">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Faça login</h2>
          <p className="text-gray-500 mb-8">Você precisa estar logado para gerenciar seus endereços.</p>
          <Link to="/perfil" className="block w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand/90 transition shadow-md">
            Ir para o Perfil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream/30 pb-20 pt-8 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/perfil" className="p-2 -ml-2 text-brand hover:bg-brand/10 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-serif text-3xl font-extrabold text-highlight">
              Endereços
            </h1>
          </div>
          {!showAddForm && !mapVisible && (
            <button 
              onClick={() => {
                setEditingId(null);
                setNewAddress({
                  title: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "", lat: undefined, lng: undefined
                });
                setShowAddForm(true);
              }}
              className="text-brand font-bold flex items-center gap-1.5 text-sm bg-brand/10 px-4 py-2 rounded-xl hover:bg-brand/20 transition"
            >
              <Plus className="h-4 w-4" /> Novo
            </button>
          )}
        </div>

        <div className="space-y-4">
          {mapVisible ? (
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="font-bold text-xl text-gray-900 mb-2">Confirmar localização</h2>
                <p className="text-sm text-gray-500 mb-6">Arraste o mapa para ajustar sua localização exata no pino central.</p>
                
                {mapCenter && (
                  <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200 relative z-0">
                    <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-brand" /></div>}>
                      <MapPicker position={mapCenter} setPosition={setSelectedPos} />
                    </Suspense>
                  </div>
                )}
                
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setMapVisible(false)}
                    className="w-full sm:w-1/3 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmMapLocation}
                    disabled={gettingLocation || !selectedPos}
                    className="w-full sm:w-2/3 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition shadow-md flex items-center justify-center gap-2"
                  >
                    {gettingLocation ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                    Salvar Localização
                  </button>
                </div>
             </div>
          ) : showAddForm ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand" /> {editingId ? "Editar Endereço" : "Adicionar Endereço"}
              </h2>
              
              <button
                type="button"
                onClick={handleOpenMap}
                disabled={gettingLocation}
                className="w-full mb-6 py-4 px-4 bg-brand/5 border border-brand/20 text-brand font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand/10 transition shadow-sm"
              >
                {gettingLocation ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
                Abrir Mapa de Localização
              </button>

              <form onSubmit={handleAddSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nome do Endereço (ex: Casa, Trabalho)</label>
                  <input
                    value={newAddress.title}
                    onChange={e => setNewAddress({...newAddress, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition"
                    placeholder="Casa"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">CEP</label>
                  <input
                    required
                    value={newAddress.zipCode}
                    onChange={handleCepChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition"
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Rua</label>
                    <input
                      required
                      value={newAddress.street}
                      onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition"
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Número</label>
                    <input
                      required
                      value={newAddress.number}
                      onChange={e => setNewAddress({...newAddress, number: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Complemento (Opcional)</label>
                  <input
                    value={newAddress.complement}
                    onChange={e => setNewAddress({...newAddress, complement: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition"
                    placeholder="Apto 12, Bloco B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Bairro</label>
                  <input
                    required
                    value={newAddress.neighborhood}
                    onChange={e => setNewAddress({...newAddress, neighborhood: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition"
                    placeholder="Bairro"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Cidade</label>
                    <input
                      required
                      value={newAddress.city}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition"
                      placeholder="Cidade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Estado</label>
                    <input
                      required
                      value={newAddress.state}
                      onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition"
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setNewAddress({
                        title: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "", lat: undefined, lng: undefined
                      });
                    }}
                    className="w-full sm:w-1/3 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-2/3 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition shadow-md flex items-center justify-center"
                  >
                    {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : "Salvar Endereço"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {addresses.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center mt-6">
                  <div className="h-20 w-20 bg-brand/5 rounded-full flex items-center justify-center mb-5">
                    <MapPin className="h-10 w-10 text-brand/40" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Nenhum endereço salvo</h3>
                  <p className="text-gray-500 mt-2 mb-8 max-w-sm">
                    Adicione um endereço para facilitar suas entregas em pedidos futuros.
                  </p>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="px-8 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition shadow-md"
                  >
                    Adicionar Primeiro Endereço
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 transition hover:border-brand/30">
                      <div className="p-3 bg-brand/10 rounded-xl text-brand shrink-0">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {addr.title && (
                          <h3 className="font-extrabold text-brand text-lg mb-1 truncate">{addr.title}</h3>
                        )}
                        <p className={`font-bold text-gray-900 truncate ${addr.title ? 'text-sm' : 'text-base'}`}>
                          {addr.street}, {addr.number}
                        </p>
                        {addr.complement && <p className="text-sm text-gray-500 truncate">{addr.complement}</p>}
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {addr.neighborhood}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {addr.city} - {addr.state}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 font-mono">CEP: {addr.zipCode}</p>
                        {addr.lat && addr.lng && (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${addr.lat},${addr.lng}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex mt-3 text-xs font-bold text-brand hover:text-brand/80 transition flex items-center gap-1.5 bg-brand/5 px-2.5 py-1.5 rounded-lg"
                          >
                            <Navigation className="h-3.5 w-3.5" /> Ver no mapa
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button 
                          onClick={() => handleEdit(addr)}
                          className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-xl transition"
                          title="Editar endereço"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleRemove(addr.id)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                          title="Remover endereço"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
