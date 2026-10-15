import { useState, useEffect } from "react";
import bannerMobile01 from "@/assets/banner_mobile_01.png";
import bannerPc01 from "@/assets/banner_pc_01.png";

export function Hero({ onOrder }: { onOrder?: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mobileBanners = [bannerMobile01];
  const desktopBanners = [bannerPc01];

  useEffect(() => {
    if (desktopBanners.length <= 1 && mobileBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [desktopBanners.length, mobileBanners.length]);

  return (
    <section id="top" className="relative w-full">
      {/* Desktop Banners Carousel */}
      <div className="hidden sm:grid grid-cols-1 grid-rows-1 w-full aspect-[21/9] md:aspect-[21/7] overflow-hidden bg-muted">
        {desktopBanners.map((src, index) => (
          <img 
            key={src}
            src={src} 
            alt={`Banner PC ${index + 1}`} 
            className={`col-start-1 row-start-1 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide % desktopBanners.length ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          />
        ))}
      </div>

      {/* Mobile Banners Carousel */}
      <div className="grid sm:hidden grid-cols-1 grid-rows-1 w-full relative">
        {mobileBanners.map((src, index) => (
          <img 
            key={src}
            src={src} 
            alt={`Banner mobile ${index + 1}`} 
            className={`col-start-1 row-start-1 w-full h-auto transition-opacity duration-1000 ${
              index === currentSlide % mobileBanners.length ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          />
        ))}
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none flex flex-col items-center justify-center">
        <h1 className="sr-only">Lume Artesanais</h1>
      </div>
    </section>
  );
}
