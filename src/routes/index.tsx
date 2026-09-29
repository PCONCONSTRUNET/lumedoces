import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Menu } from "@/components/site/Menu";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lume Artesanais" },
      {
        name: "description",
        content:
          "Peça online as melhores mini coxinhas da região. Frango, catupiry, cheddar bacon e combos para festas com entrega rápida.",
      },
      { property: "og:title", content: "Lume Artesanais" },
      {
        property: "og:description",
        content: "Mini coxinhas crocantes, combos e doces. Faça seu pedido!",
      },
    ],
  }),
});

function Index() {
  const menuRef = useRef<HTMLDivElement | null>(null);

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main>
          <Hero />
          <Menu menuRef={menuRef} />
        </main>
        <Footer />
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </div>
    </CartProvider>
  );
}
