import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatOrderCode } from "@/lib/order-utils";
import { formatBRL } from "@/store/cart";

const PIX_EXPIRY_SECONDS = 30 * 60;

type Props = {
  logo: string;
  orderId: string;
  orderNumber: number | null;
  pixQrCode: string | null;
  pixCopyPaste: string | null;
  confirmedTotal: number;
  onPaid: () => void;
};

export function PixPaymentScreen({ logo, orderId, orderNumber, pixQrCode, pixCopyPaste, confirmedTotal, onPaid }: Props) {
  const [paid, setPaid] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(PIX_EXPIRY_SECONDS);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      const { data } = await supabase.from("orders").select("status").eq("id", orderId).single();
      if (data?.status === "confirmed" || data?.status === "preparing" || data?.status === "ready") {
        setPaid(true);
        if (pollRef.current) clearInterval(pollRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        toast.success("Pagamento confirmado! 🎉");
      }
    };

    const channel = supabase
      .channel(`order_pix_${orderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` }, (payload) => {
        const status = (payload.new as any)?.status;
        if (status === "confirmed" || status === "preparing" || status === "ready") {
          setPaid(true);
          if (pollRef.current) clearInterval(pollRef.current);
          if (intervalRef.current) clearInterval(intervalRef.current);
          toast.success("Pagamento confirmado! 🎉");
        }
      })
      .subscribe();

    pollRef.current = setInterval(checkStatus, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const handleCopy = () => {
    if (!pixCopyPaste) return;
    navigator.clipboard.writeText(pixCopyPaste);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const expired = secondsLeft === 0;

  if (paid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="relative">
          <img src={logo} alt="Lume Artesanais" className="w-20 h-20 rounded-full object-contain border-4 border-brand/20 mb-4" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-brand font-hand">Pagamento Confirmado!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pedido {formatOrderCode(orderId, orderNumber)} foi pago com sucesso. Já estamos preparando tudo! 🍫
        </p>
        <p className="mt-1 font-bold text-brand text-lg">{formatBRL(confirmedTotal)}</p>
        <Link to="/historico" onClick={onPaid} className="mt-8 w-full flex items-center justify-center bg-brand text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand/90 transition shadow-md">
          Acompanhar meu pedido
        </Link>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <img src={logo} alt="Lume Artesanais" className="h-10 w-auto object-contain mb-4 opacity-60 mix-blend-multiply" />
        <h2 className="text-xl font-bold text-foreground">QR Code expirado</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">O tempo para pagamento via PIX expirou. Faça um novo pedido para gerar um novo código.</p>
        <Link to="/historico" onClick={onPaid} className="mt-8 w-full flex items-center justify-center border border-brand text-brand font-bold py-3 px-4 rounded-xl hover:bg-brand/5 transition">
          Ver meu pedido
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center pb-6">
      <div className="w-full bg-white border border-brand/10 rounded-2xl p-6 shadow-sm flex flex-col items-center">
        <img src={logo} alt="Lume Artesanais" className="h-12 sm:h-14 w-auto object-contain mb-3" />
        <p className="text-xl font-bold text-foreground">{formatBRL(confirmedTotal)}</p>
        <p className="text-muted-foreground text-xs mb-6">Pedido {formatOrderCode(orderId, orderNumber)}</p>
        
        <p className="text-sm font-semibold text-foreground/70 mb-3">Escaneie o QR Code para pagar</p>
        {pixQrCode ? (
          <div className="flex justify-center">
            <img src={pixQrCode} alt="QR Code PIX" className="w-52 h-52 rounded-xl border-4 border-brand/10" />
          </div>
        ) : (
          <div className="flex justify-center items-center w-52 h-52 mx-auto rounded-xl border-4 border-brand/10 bg-brand/5">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className={`text-sm font-bold tabular-nums ${secondsLeft < 120 ? "text-red-500" : "text-amber-600"}`}>{minutes}:{seconds}</span>
          <span className="text-xs text-muted-foreground">para expirar</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
          <span className="text-xs text-muted-foreground">Aguardando pagamento...</span>
        </div>
      </div>

      {pixCopyPaste && (
        <div className="w-full mt-3">
          <p className="text-xs text-muted-foreground mb-2">Ou use o Pix Copia e Cola</p>
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all ${copied ? "bg-emerald-500 text-white" : "bg-brand text-white hover:bg-brand/90 active:scale-95"}`}
          >
            {copied ? <><CheckCircle2 className="h-4 w-4" /> Código copiado!</> : <><Copy className="h-4 w-4" /> Copiar código PIX</>}
          </button>
          <p className="text-xs text-muted-foreground mt-2">Cole no app do seu banco em "Pix → Copia e Cola"</p>
        </div>
      )}

      <Link to="/historico" onClick={onPaid} className="mt-5 text-sm text-brand/70 underline underline-offset-2 hover:text-brand transition">
        Já paguei, acompanhar pedido
      </Link>
    </div>
  );
}
