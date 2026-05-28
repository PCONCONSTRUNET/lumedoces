import { useEffect, useState } from "react";
import { Moon, ShoppingCart, Sun, Menu as MenuIcon, X, ArrowRight, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { useCart } from "@/store/cart";

const WPP = "5548933806781";

export function Header() {
  const { count, setOpen } = useCart();
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <header className="fixed left-1/2 top-4 z-50 w-[95%] max-w-5xl -translate-x-1/2 rounded-[2rem] bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md border border-white/40 dark:bg-black/30 dark:border-white/10 transition-all duration-300">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Mini Coxinhas" className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm" width={144} height={48} />
          </Link>
          
          <div className="flex items-center">
            <button
              onClick={() => setNavOpen(true)}
              className="grid h-10 w-11 place-items-center rounded-xl border-2 border-highlight bg-white text-highlight shadow-sm transition hover:bg-highlight/10 dark:bg-transparent"
              aria-label="Menu"
            >
              <MenuIcon className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Side nav drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay fundo escuro leve */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
          {/* Drawer glassmorphism */}
          <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white/30 backdrop-blur-md shadow-2xl flex flex-col dark:bg-black/40">
            
            <div className="flex items-center justify-between px-6 py-8">
              <img src={logo} alt="Mini Coxinhas" className="h-10 w-auto object-contain drop-shadow-sm" />
              <button
                onClick={() => setNavOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-foreground/10 bg-white/20 text-foreground hover:bg-white/40 transition"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>
            
            <nav className="flex-1 px-6 space-y-4 mt-4">
              <Link
                to="/"
                onClick={() => setNavOpen(false)}
                className="flex items-center justify-between py-3 text-foreground/90 font-medium hover:text-foreground transition"
              >
                <span>Início</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
              <Link
                to="/"
                hash="menu"
                onClick={() => setNavOpen(false)}
                className="flex items-center justify-between py-3 text-foreground/90 font-medium hover:text-foreground transition"
              >
                <span>Produtos</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
              <Link
                to="/contato"
                onClick={() => setNavOpen(false)}
                className="flex items-center justify-between py-3 text-foreground/90 font-medium hover:text-foreground transition"
              >
                <span>Contato</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
              
              <hr className="my-6 border-foreground/10" />
              
              <a
                href={`https://wa.me/${WPP}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-highlight hover:bg-highlight/90 text-white font-bold py-4 shadow-lg transition"
              >
                <MessageCircle className="h-5 w-5 fill-white" />
                Fazer pedido
              </a>
            </nav>

            {/* Floating green whatsapp button at the bottom right */}
            <a
              href={`https://wa.me/${WPP}`}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-8 right-6 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition"
            >
              <WhatsAppIcon className="h-7 w-7" />
            </a>
          </aside>
        </div>
      )}
    </>
  );
}
