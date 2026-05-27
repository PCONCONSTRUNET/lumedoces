import mascot from "@/assets/mascot.png";

export function MascotStrip() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-highlight/15 via-highlight/25 to-highlight/15 py-10">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 sm:gap-8">
        <img
          src={mascot}
          alt="Coxinho — mascote Mini Coxinhas"
          className="h-32 w-auto shrink-0 object-contain drop-shadow-xl animate-mascot-wave sm:h-44"
        />
        <div className="flex-1">
          <p className="font-hand text-xs uppercase tracking-widest text-brand/80">Oi, eu sou o Coxinho!</p>
          <h2 className="mt-1 font-display text-3xl text-brand sm:text-4xl">
            Bem-vindo à <span className="text-highlight">Mini Coxinhas</span>!
          </h2>
          <p className="mt-2 max-w-md text-sm text-foreground/80 sm:text-base">
            Feitas à mão, fritas na hora e prontas pra alegrar sua festa. Escolhe o seu sabor favorito que eu preparo com carinho! 🧡
          </p>
        </div>
      </div>
    </section>
  );
}
