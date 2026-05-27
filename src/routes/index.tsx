import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Menu } from "@/components/site/Menu";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Demarch Lanches — Delivery de hambúrgueres artesanais" },
      {
        name: "description",
        content:
          "Peça online os melhores lanches artesanais da região. Hambúrgueres, porções, combos e tábuas com entrega rápida.",
      },
      { property: "og:title", content: "Demarch Lanches — Delivery" },
      {
        property: "og:description",
        content: "Hambúrgueres artesanais, porções e combos. Faça seu pedido!",
      },
    ],
  }),
});

function Index() {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const scrollToMenu = () =>
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main>
          <Hero onOrder={scrollToMenu} />
          <Menu menuRef={menuRef} />
        </main>
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </div>
    </CartProvider>
  );
}
