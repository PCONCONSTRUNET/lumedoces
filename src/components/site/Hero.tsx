import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import bannerDesktop from "@/assets/banner.png";
import bannerDesktop02 from "@/assets/banner_pc_0004.png";
import bannerDesktop03 from "@/assets/banner_pc_2030.png";
import bannerMobile from "@/assets/mobile_nova.png";
import bannerMobile02 from "@/assets/banner_mobile_02.png";
import bannerMobile03 from "@/assets/banner_mobile_2030.png";
import logo from "@/assets/logo.png";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function Hero({ onOrder }: { onOrder: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mobileBanners = [bannerMobile, bannerMobile02, bannerMobile03];
  const desktopBanners = [bannerDesktop, bannerDesktop02, bannerDesktop03];

  useEffect(() => {
    const interval = setInterval(() => {
      // Use Math.max to cycle through the longest array, so the slide index works for both
      const totalSlides = Math.max(mobileBanners.length, desktopBanners.length);
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" className="relative w-full">
      {/* Desktop Banners Carousel */}
      <div className="hidden sm:grid grid-cols-1 grid-rows-1 w-full">
        {desktopBanners.map((src, index) => (
          <img 
            key={src}
            src={src} 
            alt={`Banner de fundo (Desktop) ${index + 1}`} 
            className={`col-start-1 row-start-1 w-full h-auto object-contain transition-opacity duration-1000 ${
              index === currentSlide % desktopBanners.length ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Mobile Banners Carousel */}
      <div className="grid sm:hidden grid-cols-1 grid-rows-1 w-full">
        {mobileBanners.map((src, index) => (
          <img 
            key={src}
            src={src} 
            alt={`Banner de fundo (Mobile) ${index + 1}`} 
            className={`col-start-1 row-start-1 w-full h-auto object-contain transition-opacity duration-1000 ${
              index === currentSlide % mobileBanners.length ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none flex flex-col items-center justify-center">
        <h1 className="sr-only">Nutrindo Momentos</h1>
      </div>
    </section>
  );
}
