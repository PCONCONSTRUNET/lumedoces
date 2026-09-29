import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "sonner";
import { ArrowLeft, Clock, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/funcionamento")({
  component: FuncionamentoPage,
});

function FuncionamentoPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cream flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
          <Link to="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-zinc-900 mb-8">Funcionamento e Entregas</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <div className="flex items-center mb-4 text-orange-600">
                  <Clock className="w-6 h-6 mr-3" />
                  <h2 className="text-xl font-semibold text-zinc-900">Horários</h2>
                </div>
                <ul className="space-y-3 text-zinc-700">
                  <li className="flex justify-between border-b border-orange-200/50 pb-2">
                    <span className="font-medium">Segunda-feira</span>
                    <span className="text-zinc-500">Fechado</span>
                  </li>
                  <li className="flex justify-between border-b border-orange-200/50 pb-2">
                    <span className="font-medium">Terça-feira</span>
                    <span>18:00 - 23:30</span>
                  </li>
                  <li className="flex justify-between border-b border-orange-200/50 pb-2">
                    <span className="font-medium">Quarta-feira</span>
                    <span>18:00 - 23:30</span>
                  </li>
                  <li className="flex justify-between border-b border-orange-200/50 pb-2">
                    <span className="font-medium">Quinta-feira</span>
                    <span>18:00 - 23:30</span>
                  </li>
                  <li className="flex justify-between border-b border-orange-200/50 pb-2">
                    <span className="font-medium">Sexta-feira</span>
                    <span>18:00 - 23:30</span>
                  </li>
                  <li className="flex justify-between border-b border-orange-200/50 pb-2">
                    <span className="font-medium">Sábado</span>
                    <span>18:00 - 23:30</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Domingo</span>
                    <span>18:00 - 23:30</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-8">
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                  <div className="flex items-center mb-4 text-emerald-600">
                    <MapPin className="w-6 h-6 mr-3" />
                    <h2 className="text-xl font-semibold text-zinc-900">Entregas</h2>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">
                    Nós entregamos nossos doces e salgados em toda a região. As taxas de entrega variam de acordo com a distância e são calculadas automaticamente no momento de finalizar a sua compra.
                  </p>
                  <p className="text-zinc-600 leading-relaxed mt-4">
                    <strong>Tempo estimado:</strong> Nossas entregas costumam levar entre 40 a 60 minutos, podendo variar de acordo com o clima e o trânsito da cidade.
                  </p>
                </div>

                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                  <div className="flex items-center mb-4 text-blue-600">
                    <Phone className="w-6 h-6 mr-3" />
                    <h2 className="text-xl font-semibold text-zinc-900">Contato</h2>
                  </div>
                  <p className="text-zinc-600">
                    Dúvidas sobre sua entrega?
                  </p>
                  <p className="text-zinc-900 font-medium mt-1">
                    Chame no WhatsApp: (00) 90000-0000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </div>
    </CartProvider>
  );
}
