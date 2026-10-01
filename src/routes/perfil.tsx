import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, LogOut, ArrowLeft, Loader2, ShoppingBag, ChevronRight, MapPin, HelpCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo_lume.png";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cpfInput, setCpfInput] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUserData(session.user.user_metadata);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserData(session.user.user_metadata);
      } else {
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 14);
    
    // Format CPF/CNPJ visually
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }
    
    setCpfInput(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfDigits = cpfInput.replace(/\D/g, "");
    
    if (cpfDigits.length !== 11 && cpfDigits.length !== 14) {
      toast.error("Por favor, informe um CPF ou CNPJ válido.");
      return;
    }

    setLoggingIn(true);
    const email = `${cpfDigits}@cliente.lumedoces.com`;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: cpfDigits,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Usuário não encontrado. Se você é novo, faça um pedido para criar seu perfil automaticamente!");
        } else {
          toast.error("Erro ao fazer login: " + error.message);
        }
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream/30">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream/30 pb-20 pt-8 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 -ml-2 text-brand hover:bg-brand/10 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-3xl font-extrabold text-highlight">
            Meu Perfil
          </h1>
        </div>

        {!session ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center max-w-md mx-auto mt-12">
            <img src={logo} alt="Lume Artesanais" className="h-16 w-auto mx-auto mb-6 drop-shadow-sm" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Falta pouco!</h2>
            <p className="text-gray-500 mb-8">Identifique-se para acessar seus pedidos e dados salvos.</p>
            
            <form onSubmit={handleLogin} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CPF / CNPJ</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cpfInput}
                    onChange={handleCpfChange}
                    className="block w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-lg"
                    placeholder="000.000.000-00"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3 flex items-start gap-1">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
                  Seu acesso é criado automaticamente na sua primeira compra.
                </p>
              </div>

              <button
                type="submit"
                disabled={loggingIn || cpfInput.length < 14}
                className="w-full flex items-center justify-center gap-2 bg-brand text-white font-bold text-lg py-4 px-4 rounded-xl hover:bg-brand/90 transition shadow-md disabled:opacity-50"
              >
                {loggingIn ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Continuar"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cabecalho de Informações do Usuário */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="h-20 w-20 bg-brand/10 rounded-full flex items-center justify-center text-brand text-3xl font-bold border-4 border-white shadow-sm shrink-0">
                {userData?.full_name?.charAt(0).toUpperCase() || <User className="h-10 w-10 text-brand/50" />}
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData?.full_name || "Cliente Lume"}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-gray-500 text-sm">
                  <span>CPF: {userData?.cpf || "Não informado"}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{userData?.phone || "Não informado"}</span>
                </div>
              </div>
            </div>

            {/* Lista de Opções do Menu */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <Link to="/historico" className="flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand/10 rounded-xl text-brand">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Meus Pedidos</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Link to="/enderecos" className="flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 border-b border-gray-50 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Meus Endereços</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Link to="/contato" className="flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Ajuda e Suporte</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
                    <LogOut className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-rose-600 text-lg">Sair da conta</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            <div className="text-center pt-8">
               <p className="text-xs text-gray-400 font-bold">Lume Artesanais • Versão 1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
