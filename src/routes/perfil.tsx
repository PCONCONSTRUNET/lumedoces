import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, LogOut, ArrowLeft, Loader2, ShoppingBag, ChevronRight, MapPin, HelpCircle, ShieldCheck, Receipt, Store, Gift } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo_lume.png";
import iconPoints from "@/assets/icon_points_lume.png";

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
  const [pointsBalance, setPointsBalance] = useState<number>(0);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    const fetchPoints = async (userId: string) => {
      try {
        const supabaseUntyped = supabase as any;
        const { data } = await supabaseUntyped.from("customer_points_balance").select("balance").eq("user_id", userId).single();
        if (data) setPointsBalance(data.balance);
      } catch (err) {
        console.error(err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUserData(session.user.user_metadata);
        fetchPoints(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserData(session.user.user_metadata);
        fetchPoints(session.user.id);
      } else {
        setUserData(null);
        setPointsBalance(0);
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
    setPhoneInput(v);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfDigits = cpfInput.replace(/\D/g, "");
    const phoneDigits = phoneInput.replace(/\D/g, "");
    
    if (!nameInput.trim()) return toast.error("Preencha seu nome");
    if (phoneDigits.length < 10) return toast.error("Telefone inválido");
    if (cpfDigits.length !== 11 && cpfDigits.length !== 14) {
      return toast.error("CPF ou CNPJ inválido");
    }

    setLoggingIn(true);
    const email = `${cpfDigits}@cliente.lumedoces.com`;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: cpfDigits,
        options: {
          data: {
            full_name: nameInput.trim(),
            phone: phoneInput,
            cpf: cpfInput,
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este CPF já possui cadastro. Volte e faça login.");
        } else {
          toast.error("Erro ao criar conta: " + error.message);
        }
      } else {
        toast.success("Conta criada e logada com sucesso!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao criar conta.");
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
            
            {isRegistering ? (
              <form onSubmit={handleRegister} className="space-y-4 text-left mt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-base"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={handlePhoneChange}
                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-base"
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">CPF / CNPJ</label>
                  <input
                    type="text"
                    required
                    value={cpfInput}
                    onChange={handleCpfChange}
                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-base"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loggingIn}
                    className="w-full flex items-center justify-center gap-2 bg-brand text-white font-bold text-lg py-4 px-4 rounded-xl hover:bg-brand/90 transition shadow-md disabled:opacity-70"
                  >
                    {loggingIn ? <Loader2 className="h-6 w-6 animate-spin" /> : "Criar minha conta"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="w-full mt-3 flex items-center justify-center py-3 text-brand font-bold text-sm hover:underline"
                  >
                    Já tenho conta (Login)
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6 text-left mt-6">
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
                    Basta informar seu documento para acessar.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loggingIn}
                    className="w-full flex items-center justify-center gap-2 bg-brand text-white font-bold text-lg py-4 px-4 rounded-xl hover:bg-brand/90 transition shadow-md disabled:opacity-70"
                  >
                    {loggingIn ? <Loader2 className="h-6 w-6 animate-spin" /> : "Continuar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="w-full flex items-center justify-center py-4 bg-brand/10 text-brand font-bold text-base rounded-xl hover:bg-brand/20 transition"
                  >
                    Criar conta
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cabecalho de Informações do Usuário */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="h-20 w-20 bg-brand/10 rounded-full flex items-center justify-center text-brand text-3xl font-bold border-4 border-white shadow-sm shrink-0">
                {userData?.full_name?.charAt(0)?.toUpperCase() || <User className="h-10 w-10 text-brand/50" />}
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData?.full_name || (session?.user?.email?.includes('@cliente') ? "Cliente Lume" : "Administrador")}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-gray-500 text-sm">
                  {session?.user?.email?.includes('@cliente') ? (
                    <>
                      <span>CPF: {userData?.cpf || "Não informado"}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{userData?.phone || "Não informado"}</span>
                    </>
                  ) : (
                    <span>Conta Administrativa ({session?.user?.email})</span>
                  )}
                </div>
              </div>
            </div>

            {/* Carteira de Pontos */}
            {session?.user?.email?.includes('@cliente') && (
              <Link to="/loja" className="bg-gradient-to-r from-brand to-highlight rounded-3xl shadow-sm border border-brand/20 p-6 flex items-center justify-between text-white hover:opacity-95 active:opacity-90 transition-opacity">
                <div className="flex items-center gap-4">
                  <img src={iconPoints} alt="Moeda Lume" className="h-20 w-20 object-contain drop-shadow-md" />
                  <div>
                    <h3 className="text-lg font-bold opacity-90 leading-none mb-1">Meus Pontos</h3>
                    <p className="text-3xl font-extrabold leading-none">{pointsBalance} pts</p>
                    <p className="text-sm opacity-70 mt-1">Toque para ver a loja de prêmios</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 opacity-60 shrink-0" />
              </Link>
            )}

            {/* Lista de Opções do Menu */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">

              <Link to="/loja" className="flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                    <Store className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Loja de Prêmios</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Link to="/resgates" className="flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                    <Gift className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Meus Resgates</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Link to="/transacoes" className="flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Minhas Transações</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
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
