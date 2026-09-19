import { Heart, Droplet, Box, Wheat, Smile } from "lucide-react";
import React from "react";

const features = [
  { text: "ZERO LACTOSE", icon: Droplet },
  { text: "ZERO ADIÇÃO DE AÇÚCAR", icon: Box },
  { text: "ZERO GLÚTEN", icon: Wheat },
  { text: "SABOR INTENSO", icon: Smile },
  { text: "SAUDÁVEL", icon: Heart },
];

export function MascotStrip() {
  return (
    <section className="relative overflow-hidden bg-[#50C8B5] py-3 shadow-sm z-10">
      <div className="flex w-max animate-marquee">
        {/* Render repeated blocks for infinite loop */}
        {[...Array(6)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex min-w-max items-center justify-around px-4">
            {features.map((item, index) => (
              <div key={index} className="flex items-center gap-4 px-4 whitespace-nowrap">
                <span className="text-white font-bold tracking-wider text-sm md:text-base">
                  {item.text}
                </span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-yellow-400 text-yellow-400">
                  <item.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
