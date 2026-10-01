import { useEffect, useState } from "react";
import { Moon, ShoppingCart, Sun, Menu as MenuIcon, X, ArrowRight, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo_lume.png";
import { useCart } from "@/store/cart";

const WPP = "5548996915303";

export function Header() {
  const { count, setOpen } = useCart();
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-white/80 px-4 sm:px-8 py-2 shadow-sm backdrop-blur-md border-b border-gray-200 transition-all duration-300`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Lume Artesanais" className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm" width={144} height={48} />
          </Link>
          
          <div className="flex items-center">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="grid h-10 w-11 place-items-center rounded-xl border-2 border-highlight bg-white text-highlight shadow-sm transition hover:bg-highlight/10 dark:bg-transparent"
              aria-label="Menu"
            >
              {navOpen ? <X className="h-6 w-6 stroke-[2.5]" /> : <MenuIcon className="h-6 w-6 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Dropdown Menu directly in navbar */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${navOpen ? 'max-h-96 opacity-100 mt-4 pb-2' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col space-y-2 px-2">
            <Link
              to="/"
              onClick={() => setNavOpen(false)}
              className="flex items-center justify-between py-2 text-foreground/90 font-bold hover:text-foreground transition"
            >
              <span>Início</span>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </Link>
            <Link
              to="/"
              hash="menu"
              onClick={() => setNavOpen(false)}
              className="flex items-center justify-between py-2 text-foreground/90 font-bold hover:text-foreground transition"
            >
              <span>Produtos</span>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </Link>
            <Link
              to="/contato"
              onClick={() => setNavOpen(false)}
              className="flex items-center justify-between py-2 text-foreground/90 font-bold hover:text-foreground transition"
            >
              <span>Contato</span>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </Link>
            <Link
              to="/rastreio"
              onClick={() => setNavOpen(false)}
              className="flex items-center justify-between py-2 text-highlight font-bold hover:text-highlight/80 transition bg-highlight/5 px-3 rounded-lg"
            >
              <span>Rastrear Pedido</span>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </Link>
            <Link
              to="/historico"
              onClick={() => setNavOpen(false)}
              className="flex items-center justify-between py-2 text-brand font-bold hover:text-brand/80 transition bg-brand/5 px-3 rounded-lg"
            >
              <span>Meus Pedidos</span>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </Link>
            
            <a
              href={`https://wa.me/${WPP}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-highlight hover:bg-highlight/90 text-white font-bold py-3 shadow-sm transition mt-2"
            >
              <MessageCircle className="h-5 w-5 fill-white" />
              Fazer pedido
            </a>
          </nav>
        </div>
      </header>

      {/* Floating green whatsapp button at the bottom right */}
      <a
        href={`https://wa.me/${WPP}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </>
  );
}
