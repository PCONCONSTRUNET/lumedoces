import pixIcon from "@/assets/pix-icon.png";

export function PixIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <img src={pixIcon} alt="PIX" className={`inline-block object-contain ${className}`} />;
}

export function PaymentLabel({ name, className = "" }: { name?: string | null; className?: string }) {
  const label = name ?? "—";
  const normalized = (name ?? "").toLowerCase();
  const isPix = normalized.includes("pix");
  const isCard = normalized.includes("cart") || normalized.includes("credit") || normalized.includes("debit");
  const isMoney = normalized.includes("dinheiro") || normalized.includes("money");

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {isPix && <PixIcon className="h-4 w-4" />}
      {isCard && <img src="https://img.icons8.com/fluency/48/bank-card-back-side.png" alt="Cartão" className="h-4 w-4 object-contain" />}
      {isMoney && <img src="https://img.icons8.com/fluency/48/money.png" alt="Dinheiro" className="h-4 w-4 object-contain" />}
      <span>{label}</span>
    </span>
  );
}
