import experimente from "@/assets/experimente.jpg";

export function ExperimenteBanner() {
  return (
    <section className="w-full">
      <img
        src={experimente}
        alt="Experimente, apaixone-se e repita!"
        className="w-full h-auto object-cover"
      />
    </section>
  );
}
