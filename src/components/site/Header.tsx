import { useEffect, useState } from "react";
import { Moon, ShoppingCart, Sun, Menu as MenuIcon, X, Home, UtensilsCrossed, Phone } from "lucide-react";
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
    <header className="sticky top-0 z-40 backdrop-blur bg-cream/85 border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Mini Coxinhas" className="h-12 sm:h-14 w-auto object-contain" width={168} height={56} />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground/70 hover:bg-muted/70 transition"
            aria-label="Alternar tema"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground shadow-md hover:opacity-90 transition"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-highlight px-1 text-[11px] font-bold text-highlight-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setNavOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-muted transition"
            aria-label="Menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Side nav drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setNavOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm shadow-2xl flex flex-col bg-background" style={{ backgroundColor: "#fbf7ec" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <img src={logo} alt="Mini Coxinhas" className="h-14 w-auto object-contain" />
              <button
                onClick={() => setNavOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <Link
                to="/"
                onClick={() => setNavOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-foreground hover:bg-muted transition"
              >
                <Home className="h-5 w-5 text-foreground/60" />
                <span className="font-medium">Início</span>
              </Link>
              <Link
                to="/"
                hash="menu"
                onClick={() => setNavOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-foreground hover:bg-muted transition"
              >
                <UtensilsCrossed className="h-5 w-5 text-foreground/60" />
                <span className="font-medium">Cardápio</span>
              </Link>
              <Link
                to="/contato"
                onClick={() => setNavOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-foreground hover:bg-muted transition"
              >
                <Phone className="h-5 w-5 text-foreground/60" />
                <span className="font-medium">Contato</span>
              </Link>
            </nav>
            <div className="p-4 border-t border-border">
              <a
                href={`https://wa.me/${WPP}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 shadow-md transition"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chamar no WhatsApp
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
