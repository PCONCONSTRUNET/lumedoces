import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Instagram, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Header } from "@/components/site/Header";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "sonner";

export const Route = createFileRoute("/contato")({
  component: ContatoPage,
  head: () => ({
    meta: [
      { title: "Contato — Mini Coxinhas" },
      { name: "description", content: "Endereço, WhatsApp e Instagram da Mini Coxinhas." },
      { property: "og:title", content: "Contato — Mini Coxinhas" },
      { property: "og:description", content: "Fale com a gente pelo WhatsApp, Instagram ou venha nos visitar." },
    ],
  }),
});

const WPP = "5548933806781";
const WPP_LABEL = "+55 48 93380-6781";
const IG = "minicoxinhaslm";
const ENDERECO = "R. Wâlter Vetterli — Lauro Müller, SC, 88880-000, Brasil";

const HORARIOS = [
  { dia: "Seg. a Sex.", hora: "14:00 – 22:00" },
  { dia: "Sábado", hora: "14:00 – 19:00" },
  { dia: "Domingo", hora: "Fechado" },
];

function ContatoPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Contato</h1>
          <p className="mt-2 text-foreground/70">Fale com a gente ou venha nos visitar.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href={`https://wa.me/${WPP}`}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-700">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-bold text-foreground">WhatsApp</h2>
                  <p className="text-sm text-foreground/70">{WPP_LABEL}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/60">Toque para abrir uma conversa.</p>
            </a>

            <a
              href={`https://instagram.com/${IG}`}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-pink-100 text-pink-600">
                  <Instagram className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold text-foreground">Instagram</h2>
                  <p className="text-sm text-foreground/70">@{IG}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/60">Veja novidades e cardápio.</p>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO)}`}
              target="_blank"
              rel="noreferrer"
              className="sm:col-span-2 group rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-brand">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold text-foreground">Endereço</h2>
                  <p className="text-sm text-foreground/70">{ENDERECO}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/60">Toque para abrir no Google Maps.</p>
            </a>

            <div className="sm:col-span-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold text-foreground">Horário de atendimento</h2>
                </div>
              </div>
              <div className="mt-3 grid gap-1">
                {HORARIOS.map((h) => (
                  <div key={h.dia} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/80">{h.dia}</span>
                    <span className={`font-medium ${h.hora === "Fechado" ? "text-red-500" : "text-foreground"}`}>{h.hora}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </div>
    </CartProvider>
  );
}
