import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-c5Xru2R-.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { K as LoaderCircle, P as MapPin, A as ArrowLeft, _ as Plus, o as CircleCheck, T as Navigation, Y as Pencil, aj as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const MapPicker = reactExports.lazy(() => import("./MapPicker-BQc2hsgM.mjs"));
function EnderecosPage() {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [addresses, setAddresses] = reactExports.useState([]);
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  const [mapVisible, setMapVisible] = reactExports.useState(false);
  const [mapCenter, setMapCenter] = reactExports.useState(null);
  const [selectedPos, setSelectedPos] = reactExports.useState(null);
  const [newAddress, setNewAddress] = reactExports.useState({
    title: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [editingId, setEditingId] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [gettingLocation, setGettingLocation] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session: session2
      }
    }) => {
      setSession(session2);
      if (session2) {
        setAddresses(session2.user.user_metadata?.addresses || []);
      }
      setLoading(false);
    });
  }, []);
  const handleOpenMap = async () => {
    setGettingLocation(true);
    if (newAddress.lat && newAddress.lng) {
      const coords = [newAddress.lat, newAddress.lng];
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
          const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
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
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = [position.coords.latitude, position.coords.longitude];
      setMapCenter(coords);
      setSelectedPos(coords);
      setMapVisible(true);
      setGettingLocation(false);
    }, (error) => {
      console.error(error);
      toast.error("Não conseguimos acessar seu GPS. Arraste o mapa para sua localização.");
      const defaultCoords = [-28.6757, -49.3731];
      setMapCenter(defaultCoords);
      setSelectedPos(defaultCoords);
      setMapVisible(true);
      setGettingLocation(false);
    }, {
      enableHighAccuracy: true
    });
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
      const newAddr = {
        id: crypto.randomUUID(),
        street: addr.road || addr.pedestrian || addr.street || "Endereço via Mapa",
        number: "S/N",
        neighborhood: addr.suburb || addr.neighbourhood || addr.city_district || "Bairro não especificado",
        city: addr.city || addr.town || addr.village || addr.municipality || "Cidade não especificada",
        state: addr.state || "SC",
        zipCode: zip || "00000-000",
        lat,
        lng: lon
      };
      const updatedAddresses = [...addresses, newAddr];
      const success = await saveAddressesToMeta(updatedAddresses);
      if (success) {
        toast.success("Endereço adicionado com sucesso pelo mapa!");
        setMapVisible(false);
        setShowAddForm(false);
        setNewAddress({
          title: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
          lat: void 0,
          lng: void 0
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar endereço do mapa.");
    } finally {
      setGettingLocation(false);
    }
  };
  const handleCepChange = async (e) => {
    let cep = e.target.value.replace(/\D/g, "");
    if (cep.length > 8) cep = cep.slice(0, 8);
    let formattedCep = cep;
    if (cep.length > 5) {
      formattedCep = `${cep.slice(0, 5)}-${cep.slice(5)}`;
    }
    setNewAddress((prev) => ({
      ...prev,
      zipCode: formattedCep
    }));
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setNewAddress((prev) => ({
            ...prev,
            street: prev.street || data.logradouro,
            neighborhood: prev.neighborhood || data.bairro,
            city: prev.city || data.localidade,
            state: prev.state || data.uf
          }));
          toast.success("Endereço preenchido pelo CEP!");
        }
      } catch (err) {
        console.error("Erro no ViaCEP", err);
      }
    }
  };
  const saveAddressesToMeta = async (newAddresses) => {
    try {
      const {
        data,
        error
      } = await supabase.auth.updateUser({
        data: {
          addresses: newAddresses
        }
      });
      if (error) throw error;
      setAddresses(newAddresses);
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar endereço: " + err.message);
      return false;
    }
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const addr = {
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
      lng: newAddress.lng
    };
    let updatedAddresses;
    if (editingId) {
      updatedAddresses = addresses.map((a) => a.id === editingId ? addr : a);
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
        lat: void 0,
        lng: void 0
      });
    }
    setSaving(false);
  };
  const handleEdit = (addr) => {
    setNewAddress(addr);
    setEditingId(addr.id);
    setShowAddForm(true);
  };
  const handleRemove = async (id) => {
    if (!confirm("Tem certeza que deseja remover este endereço?")) return;
    const updatedAddresses = addresses.filter((a) => a.id !== id);
    const success = await saveAddressesToMeta(updatedAddresses);
    if (success) {
      toast.success("Endereço removido.");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center bg-cream/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-brand" }) });
  }
  if (!session) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-cream/30 flex flex-col items-center justify-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-10 w-10 text-gray-300" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: "Faça login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mb-8", children: "Você precisa estar logado para gerenciar seus endereços." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/perfil", className: "block w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand/90 transition shadow-md", children: "Ir para o Perfil" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-cream/30 pb-20 pt-8 px-4 sm:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/perfil", className: "p-2 -ml-2 text-brand hover:bg-brand/10 rounded-full transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl font-extrabold text-highlight", children: "Endereços" })
      ] }),
      !showAddForm && !mapVisible && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
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
          lat: void 0,
          lng: void 0
        });
        setShowAddForm(true);
      }, className: "text-brand font-bold flex items-center gap-1.5 text-sm bg-brand/10 px-4 py-2 rounded-xl hover:bg-brand/20 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Novo"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: mapVisible ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-xl text-gray-900 mb-2", children: "Confirmar localização" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Arraste o mapa para ajustar sua localização exata no pino central." }),
      mapCenter && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200 relative z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin h-8 w-8 text-brand" }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPicker, { position: mapCenter, setPosition: setSelectedPos }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col-reverse sm:flex-row gap-3 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMapVisible(false), className: "w-full sm:w-1/3 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleConfirmMapLocation, disabled: gettingLocation || !selectedPos, className: "w-full sm:w-2/3 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition shadow-md flex items-center justify-center gap-2", children: [
          gettingLocation ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }),
          "Salvar Localização"
        ] })
      ] })
    ] }) : showAddForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-xl text-gray-900 mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-brand" }),
        " ",
        editingId ? "Editar Endereço" : "Adicionar Endereço"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleOpenMap, disabled: gettingLocation, className: "w-full mb-6 py-4 px-4 bg-brand/5 border border-brand/20 text-brand font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand/10 transition shadow-sm", children: [
        gettingLocation ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5" }),
        "Abrir Mapa de Localização"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: "Nome do Endereço (ex: Casa, Trabalho)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: newAddress.title, onChange: (e) => setNewAddress({
            ...newAddress,
            title: e.target.value
          }), className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition", placeholder: "Casa", maxLength: 30 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: "CEP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: newAddress.zipCode, onChange: handleCepChange, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition", placeholder: "00000-000", maxLength: 9 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: "Rua" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: newAddress.street, onChange: (e) => setNewAddress({
              ...newAddress,
              street: e.target.value
            }), className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition", placeholder: "Nome da rua" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: "Número" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: newAddress.number, onChange: (e) => setNewAddress({
              ...newAddress,
              number: e.target.value
            }), className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition", placeholder: "123" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: "Complemento (Opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: newAddress.complement, onChange: (e) => setNewAddress({
            ...newAddress,
            complement: e.target.value
          }), className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition", placeholder: "Apto 12, Bloco B" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: "Bairro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: newAddress.neighborhood, onChange: (e) => setNewAddress({
            ...newAddress,
            neighborhood: e.target.value
          }), className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition", placeholder: "Bairro" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: "Cidade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: newAddress.city, onChange: (e) => setNewAddress({
              ...newAddress,
              city: e.target.value
            }), className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition", placeholder: "Cidade" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: "Estado" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: newAddress.state, onChange: (e) => setNewAddress({
              ...newAddress,
              state: e.target.value
            }), className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand outline-none transition", placeholder: "UF", maxLength: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col-reverse sm:flex-row gap-3 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
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
              lat: void 0,
              lng: void 0
            });
          }, className: "w-full sm:w-1/3 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition", children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: saving, className: "w-full sm:w-2/3 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition shadow-md flex items-center justify-center", children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin" }) : "Salvar Endereço" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: addresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 bg-brand/5 rounded-full flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-10 w-10 text-brand/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Nenhum endereço salvo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-2 mb-8 max-w-sm", children: "Adicione um endereço para facilitar suas entregas em pedidos futuros." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAddForm(true), className: "px-8 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition shadow-md", children: "Adicionar Primeiro Endereço" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: addresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 transition hover:border-brand/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-brand/10 rounded-xl text-brand shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        addr.title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-brand text-lg mb-1 truncate", children: addr.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `font-bold text-gray-900 truncate ${addr.title ? "text-sm" : "text-base"}`, children: [
          addr.street,
          ", ",
          addr.number
        ] }),
        addr.complement && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 truncate", children: addr.complement }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 truncate mt-1", children: addr.neighborhood }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 truncate", children: [
          addr.city,
          " - ",
          addr.state
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-2 font-mono", children: [
          "CEP: ",
          addr.zipCode
        ] }),
        addr.lat && addr.lng && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://www.google.com/maps/search/?api=1&query=${addr.lat},${addr.lng}`, target: "_blank", rel: "noreferrer", className: "inline-flex mt-3 text-xs font-bold text-brand hover:text-brand/80 transition flex items-center gap-1.5 bg-brand/5 px-2.5 py-1.5 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3.5 w-3.5" }),
          " Ver no mapa"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleEdit(addr), className: "p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-xl transition", title: "Editar endereço", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemove(addr.id), className: "p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition", title: "Remover endereço", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5" }) })
      ] })
    ] }, addr.id)) }) }) })
  ] }) });
}
export {
  EnderecosPage as component
};
