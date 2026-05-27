import { useEffect, useState } from "react";
import { Moon, ShoppingCart, Sun, Menu as MenuIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/store/cart";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";

export function Header() {
  const { count, setOpen } = useCart();
  const [dark, setDark] = useState(false);
  const status = useBusinessStatus();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-cream/85 border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-2">
          <img src={logo} alt="Mini Coxinhas" className="h-10 w-auto object-contain" width={120} height={40} />
          {!status.loading && (
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                status.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status.isOpen ? "bg-green-600 animate-pulse" : "bg-red-600"
                }`}
              />
              {status.label}
            </span>
          )}
        </a>
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
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-muted transition"
            aria-label="Menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
