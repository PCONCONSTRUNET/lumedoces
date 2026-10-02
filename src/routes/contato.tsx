import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Instagram, Clock, ArrowLeft } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Header } from "@/components/site/Header";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "sonner";

export const Route = createFileRoute("/contato")({
  component: ContatoPage,
  head: () => ({
    meta: [
      { title: "Contato — Lume Artesanais" },
      { name: "description", content: "Endereço, WhatsApp e Instagram da Lume Artesanais." },
      { property: "og:title", content: "Contato — Lume Artesanais" },
      { property: "og:description", content: "Fale com a gente pelo WhatsApp, Instagram ou venha nos visitar." },
    ],
  }),
});

const WPP = "5548996915303";
const WPP_LABEL = "48 99691-5303";
const IG = "nutrindomomentosc";
const ENDERECO = "Lauro Müller, Santa Catarina (KM1 ATRAS DO FUBICA CAR)";

const HORARIOS = [
  { dia: "Terça a Quinta", hora: "19:00 – 00:00" },
  { dia: "Sexta e Sábado", hora: "19:00 – 01:15" },
  { dia: "Domingo", hora: "19:00 – 00:00" },
  { dia: "Segunda-feira", hora: "Fechado" },
];

function ContatoPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/perfil" className="p-2 -ml-2 text-brand hover:bg-brand/10 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Contato</h1>
          </div>
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
              href="https://www.google.com/maps/place/28%C2%B024'22.9%22S+49%C2%B024'25.2%22W/@-28.4063492,-49.407153,20.75z/data=!4m4!3m3!8m2!3d-28.4063606!4d-49.4069977"
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
