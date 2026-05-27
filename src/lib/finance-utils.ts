export const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(n: number | null | undefined) {
  return BRL.format(Number(n ?? 0));
}

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateBR(iso: string | null | undefined) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export type PeriodPreset = "today" | "7d" | "30d" | "month" | "custom";

export function periodRange(
  preset: PeriodPreset,
  customFrom?: string,
  customTo?: string,
): { from: string; to: string } {
  const today = new Date();
  const to = toISODate(today);
  if (preset === "today") return { from: to, to };
  if (preset === "7d") {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return { from: toISODate(d), to };
  }
  if (preset === "30d") {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return { from: toISODate(d), to };
  }
  if (preset === "month") {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: toISODate(d), to };
  }
  return { from: customFrom || to, to: customTo || to };
}

export function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function toCSV(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const head = headers.join(";");
  const body = rows.map((r) => headers.map((h) => escape(r[h])).join(";")).join("\n");
  return `${head}\n${body}`;
}
