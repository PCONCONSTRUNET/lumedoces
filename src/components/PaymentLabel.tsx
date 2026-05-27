import pixIcon from "@/assets/pix-icon.png";

export function PixIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <img src={pixIcon} alt="PIX" className={`inline-block object-contain ${className}`} />;
}

export function PaymentLabel({ name, className = "" }: { name?: string | null; className?: string }) {
  const label = name ?? "—";
  const isPix = (name ?? "").toLowerCase().includes("pix");
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {isPix && <PixIcon className="h-4 w-4" />}
      <span>{label}</span>
    </span>
  );
}
