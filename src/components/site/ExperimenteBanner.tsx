import { useState, useEffect, useCallback } from "react";
import banner1 from "@/assets/banner1.jpg";
import banner2 from "@/assets/banner2.jpg";

const banners = [
  { src: banner1, alt: "Promoção Mini Coxinhas" },
  { src: banner2, alt: "Experimente nossas coxinhas" },
];

export function ExperimenteBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="w-full relative overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-white scale-110 shadow-md"
                : "bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Ir para banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
