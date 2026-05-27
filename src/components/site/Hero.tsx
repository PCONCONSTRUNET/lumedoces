import { MapPin, CreditCard } from "lucide-react";
import hero from "@/assets/hero-coxinha.jpg";
import logo from "@/assets/logo.png";

export function Hero({ onOrder }: { onOrder: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative h-[78vh] min-h-[520px] w-full">
        <img
          src={hero}
          alt="Mini coxinhas crocantes Mini Coxinhas"
          className="absolute inset-0 h-full w-full object-cover"
          width={1280}
          height={1600}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <img
            src={logo}
            alt=""
            className="mb-4 h-24 w-auto object-contain drop-shadow-2xl"
            width={240}
            height={96}
          />
          <h1 className="font-display text-5xl sm:text-6xl text-white drop-shadow-lg">
            MINI <span className="text-highlight">COXINHAS</span>
          </h1>
          <p className="mt-3 text-white/90 text-base sm:text-lg">
            Crocantes por fora, cremosas por dentro 🤤
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-white/85 text-sm">
            <MapPin className="h-4 w-4 text-highlight" />
            Praça Henrique Lage, ao lado da lotérica — LM
          </p>

          <button
            onClick={onOrder}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-highlight px-8 py-4 text-base font-bold text-highlight-foreground shadow-xl hover:scale-[1.02] active:scale-[0.98] transition"
          >
            FAZER PEDIDO 🍗
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur px-3 py-1.5 text-xs text-white border border-white/15">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Fechado <span className="text-white/70">abre às 18:00</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur px-3 py-1.5 text-xs text-white border border-white/15">
              <CreditCard className="h-3.5 w-3.5" />
              Pix, Cartão, Dinheiro
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
