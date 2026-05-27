import banner from "@/assets/banner1.jpg";

export function ExperimenteBanner() {
  return (
    <section className="w-full">
      <img
        src={banner}
        alt="Experimente nossas mini coxinhas"
        className="w-full h-auto block"
        loading="lazy"
      />
    </section>
  );
}
