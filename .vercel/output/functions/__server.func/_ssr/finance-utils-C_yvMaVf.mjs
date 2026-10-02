const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});
function formatBRL(n) {
  return BRL.format(Number(n ?? 0));
}
function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function formatDateBR(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}
function periodRange(preset, customFrom, customTo) {
  const today = /* @__PURE__ */ new Date();
  const to = toISODate(today);
  if (preset === "today") return { from: to, to };
  if (preset === "7d") {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 6);
    return { from: toISODate(d), to };
  }
  if (preset === "30d") {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - 29);
    return { from: toISODate(d), to };
  }
  if (preset === "month") {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: toISODate(d), to };
  }
  return { from: customFrom || to, to: customTo || to };
}
function downloadBlob(content, filename, mime) {
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
function toCSV(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = v === null || v === void 0 ? "" : String(v);
    if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const head = headers.join(";");
  const body = rows.map((r) => headers.map((h) => escape(r[h])).join(";")).join("\n");
  return `${head}
${body}`;
}
export {
  formatDateBR as a,
  toISODate as b,
  downloadBlob as d,
  formatBRL as f,
  periodRange as p,
  toCSV as t
};
