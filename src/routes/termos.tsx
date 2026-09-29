import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/termos")({
  component: TermosPage,
});

function TermosPage() {
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
            <h1 className="text-3xl font-bold text-zinc-900 mb-6">Termos de Uso</h1>
            
            <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6">
              <p>
                Bem-vindo aos Termos de Uso da Lume Doces. Ao acessar ou usar nosso site para fazer pedidos, você concorda em cumprir e se sujeitar aos seguintes termos.
              </p>
              
              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">1. Aceitação dos Termos</h2>
              <p>
                O uso dos nossos serviços está sujeito a estes Termos de Uso. Caso não concorde, pedimos que não utilize a nossa plataforma de pedidos.
              </p>

              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">2. Pedidos e Entregas</h2>
              <p>
                Todos os pedidos estão sujeitos à disponibilidade de estoque e à viabilidade de entrega na sua região. 
                Os prazos de entrega informados são estimativas e podem variar conforme condições climáticas, trânsito ou alta demanda.
              </p>

              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">3. Preços e Pagamentos</h2>
              <p>
                Os preços dos produtos podem sofrer alterações sem aviso prévio. O valor final a ser pago será o informado no momento do fechamento do carrinho.
              </p>

              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">4. Cancelamentos</h2>
              <p>
                Como trabalhamos com alimentos perecíveis preparados sob demanda, o cancelamento do pedido só poderá ser efetuado antes do preparo ter sido iniciado.
              </p>

              <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">5. Privacidade</h2>
              <p>
                * Coletamos seu nome e telefone apenas para garantir a entrega e identificação correta do seu pedido. Para mais detalhes, consulte nossa Política de Privacidade.
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
