import banner from "@/assets/banner1.jpg";

export function ExperimenteBanner() {
  return (
    <section className="w-full flex justify-center py-6 md:py-10">
      <img
        src={banner}
        alt="Experimente nossos doces e salgados"
        className="max-h-[70vh] w-auto h-auto rounded-2xl shadow-lg object-contain"
        loading="lazy"
      />
    </section>
  );
}
