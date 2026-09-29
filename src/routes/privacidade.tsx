import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  component: PrivacidadePage,
});

function PrivacidadePage() {
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
            <h1 className="text-3xl font-bold text-zinc-900 mb-6">Política de Privacidade</h1>
            
            <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6">
              <p>
                A sua privacidade é importante para nós. Esta política descreve como a Lume Doces coleta, usa e protege as suas informações pessoais.
                <br /><br />
                * Coletamos seu nome e telefone apenas para garantir a entrega e identificação correta do seu pedido.
              </p>
              
              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">1. Informações que Coletamos</h2>
              <p>
                Para processar e entregar o seu pedido, coletamos as seguintes informações:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Nome completo (para identificação).</li>
                  <li>Número de telefone / WhatsApp (para contato sobre o pedido).</li>
                  <li>Endereço completo (para realizar a entrega).</li>
                </ul>
              </p>

              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">2. Como Usamos as Informações</h2>
              <p>
                Os seus dados são utilizados <strong>exclusivamente</strong> para o processamento do pedido, comunicação em caso de imprevistos, e para efetuar a entrega no local correto.
                Não utilizamos o seu número de telefone para envio de spam.
              </p>

              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">3. Proteção de Dados</h2>
              <p>
                Implementamos medidas de segurança para manter as suas informações pessoais seguras. Não vendemos, trocamos ou transferimos os seus dados a terceiros.
              </p>

              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">4. Seus Direitos</h2>
              <p>
                Você tem o direito de solicitar a remoção ou alteração dos seus dados pessoais da nossa base. Para isso, basta entrar em contato conosco pelo nosso WhatsApp.
              </p>
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
