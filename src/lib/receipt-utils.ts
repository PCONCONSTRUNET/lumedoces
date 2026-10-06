import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ReceiptData = {
  redemptionId: string;
  customerName: string;
  customerPhone?: string | null;
  itemName: string;
  pointsSpent: number;
  date: string;
  status: string;
};

/** Loads an image URL and returns an HTMLImageElement with decoded data */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draws the receipt onto a canvas and returns the canvas */
async function drawReceiptToCanvas(data: ReceiptData): Promise<HTMLCanvasElement> {
  const W = 520;
  const HEADER_H = 140;
  const BODY_H = 340;
  const H = HEADER_H + BODY_H;

  const canvas = document.createElement("canvas");
  canvas.width = W * 2;   // retina
  canvas.height = H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);         // scale for retina

  // ── HEADER ──────────────────────────────────────────────────────────
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, HEADER_H);

  // Logo
  try {
    const logoModule = await import("@/assets/logo_lume.png");
    const logoSrc = logoModule.default ?? logoModule;
    const logo = await loadImage(logoSrc as string);
    const logoH = 56;
    const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
    ctx.drawImage(logo, (W - logoW) / 2, 14, logoW, logoH);
  } catch {
    // Fallback text if logo fails
    ctx.fillStyle = "#ad172b";
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Lume Artesanais", W / 2, 50);
  }

  // Subtitle
  ctx.fillStyle = "#ad172b";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Comprovante de Resgate de Prêmio", W / 2, HEADER_H - 16);

  // ── BODY ─────────────────────────────────────────────────────────────
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, HEADER_H, W, BODY_H);

  const formattedDate = format(new Date(data.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  const statusLabel = data.status === "completed" ? "Concluído" : data.status === "pending" ? "Pendente" : data.status;
  const statusColor = data.status === "completed" ? "#059669" : "#d97706";

  let y = HEADER_H + 28;
  const LEFT = 28;
  const RIGHT = W - 28;

  const drawSection = (title: string) => {
    ctx.fillStyle = "#ad172b";
    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(title, LEFT, y);
    y += 6;
    ctx.strokeStyle = "#f0d8db";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(LEFT, y);
    ctx.lineTo(RIGHT, y);
    ctx.stroke();
    y += 14;
  };

  const drawRow = (label: string, value: string, valueColor?: string) => {
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, LEFT, y);
    ctx.fillStyle = valueColor ?? "#1e293b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(value, RIGHT, y);
    y += 20;
  };

  // Section: Detalhes do Resgate
  drawSection("Detalhes do Resgate");
  drawRow("Código:", data.redemptionId.split("-")[0].toUpperCase());
  drawRow("Data:", formattedDate);
  drawRow("Cliente:", data.customerName || "Não informado");
  if (data.customerPhone) drawRow("Telefone:", data.customerPhone);
  y += 10;

  // Section: Prêmio Resgatado
  drawSection("Prêmio Resgatado");
  drawRow("Item:", data.itemName);
  drawRow("Pontos utilizados:", `${data.pointsSpent} pts`, "#d97706");
  drawRow("Status:", statusLabel, statusColor);
  y += 20;

  // Footer divider
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(LEFT, y);
  ctx.lineTo(RIGHT, y);
  ctx.stroke();
  y += 18;

  // Footer text
  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Apresente este comprovante na loja se solicitado.", W / 2, y);
  y += 14;
  ctx.fillText("Lume Artesanais · Sistema de Pontos e Recompensas", W / 2, y);

  return canvas;
}

/** Downloads a PNG image of the redemption receipt */
export async function generateRedemptionReceiptImage(data: ReceiptData) {
  try {
    const canvas = await drawReceiptToCanvas(data);
    const link = document.createElement("a");
    link.download = `resgate_lume_${data.redemptionId.split("-")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Failed to generate image receipt", err);
    throw err;
  }
}

/** Downloads a PDF of the redemption receipt */
export async function generateRedemptionReceipt(data: ReceiptData) {
  try {
    const canvas = await drawReceiptToCanvas(data);
    const imgData = canvas.toDataURL("image/png");

    // Physical dimensions: canvas is 520×480 logical px → convert to mm (96dpi ≈ 3.78px/mm)
    const PX_TO_MM = 25.4 / 96;
    const W_MM = 520 * PX_TO_MM;
    const H_MM = canvas.height / 2 * PX_TO_MM;

    const doc = new jsPDF({ unit: "mm", format: [W_MM, H_MM], orientation: "portrait" });
    doc.addImage(imgData, "PNG", 0, 0, W_MM, H_MM);
    doc.save(`resgate_lume_${data.redemptionId.split("-")[0]}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF receipt", err);
    throw err;
  }
}
