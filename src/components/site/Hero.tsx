import { MapPin, CreditCard } from "lucide-react";
import hero from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";
import mascot from "@/assets/mascot.png";
import { PixIcon } from "@/components/PaymentLabel";

export function Hero({ onOrder }: { onOrder: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative h-[78vh] min-h-[560px] w-full">
        <img
          src={hero}
          alt="Mini coxinhas crocantes Mini Coxinhas"
          className="absolute inset-0 h-full w-full object-cover"
          width={1280}
          height={1600}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/75" />

        {/* Floating mascot — desktop right side */}
        <img
          src={mascot}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-6 right-4 hidden h-[78%] max-h-[520px] w-auto object-contain drop-shadow-2xl animate-mascot-float md:block"
        />

        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <img
            src={logo}
            alt=""
            className="mb-4 h-32 sm:h-40 w-auto object-contain drop-shadow-2xl"
            width={320}
            height={160}
          />
          <h1 className="font-display text-5xl sm:text-6xl text-white drop-shadow-lg">
            MINI <span className="text-highlight">COXINHAS</span>
          </h1>
          <p className="mt-3 text-white/90 text-base sm:text-lg">
            Crocantes por fora, cremosas por dentro 🤤
          </p>
          {/* Address hidden by request */}


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
              <PixIcon className="h-3.5 w-3.5" />
              Pix, Cartão, Dinheiro
            </span>
          </div>
        </div>

        {/* Mobile mascot peeking from bottom */}
        <img
          src={mascot}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-4 right-2 z-10 h-40 w-auto object-contain drop-shadow-2xl animate-mascot-float md:hidden"
        />
      </div>
    </section>
  );
}
