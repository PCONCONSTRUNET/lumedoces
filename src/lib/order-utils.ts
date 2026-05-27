export function formatOrderCode(orderId: string | null | undefined) {
  if (!orderId) return "#------";
  return `#${orderId.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}
