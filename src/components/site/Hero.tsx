import { ChevronDown } from "lucide-react";
import hero from "@/assets/capa-rafa.png";
import logo from "@/assets/logo.png";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function Hero({ onOrder }: { onOrder: () => void }) {
  return (
    <section id="top" className="relative flex min-h-[90vh] sm:min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden pb-12 pt-28">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero}
          alt="Rafa Lanches Delivery"
          className="h-full w-full object-cover object-center"
          width={1280}
          height={1600}
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center px-6 sm:px-12 mt-12 md:mt-0">
        {/* Logo and Titles */}
        <div className="flex flex-col max-w-2xl text-center">
          <img
            src={logo}
            alt="Rafa Lanches Delivery Logo"
            className="mb-8 h-28 sm:h-36 w-auto object-contain drop-shadow-xl mx-auto"
            width={280}
            height={140}
          />
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-widest text-foreground uppercase drop-shadow-md mt-4 text-center">
            RAFA LANCHES DELIVERY
          </h1>
          
          <p className="mt-4 max-w-lg mx-auto text-lg sm:text-xl text-foreground/90 font-medium">
            Os melhores hambúrgueres artesanais e lanches da região 🍔
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:gap-4 w-full">
            <button
              onClick={onOrder}
              className="inline-flex h-12 sm:h-14 w-[75%] max-w-[260px] sm:w-auto sm:max-w-none sm:min-w-[300px] items-center justify-center rounded-full bg-[#d97706] px-6 sm:px-8 text-base sm:text-lg font-bold text-white shadow-lg hover:bg-[#b45309] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wide"
            >
              FAZER PEDIDO 🍔
            </button>
            
            <div className="flex flex-col items-center gap-2 sm:gap-3 mt-2 sm:mt-4 w-[75%] max-w-[260px] sm:w-auto sm:max-w-none sm:min-w-[280px]">
              <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                <span>Fechado · abre hoje 14:00</span>
              </div>
              <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm backdrop-blur-md">
                <span className="text-xs sm:text-sm">💳 💠</span>
                <span>Pix, Cartão, Dinheiro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
