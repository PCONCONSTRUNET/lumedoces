export function formatOrderCode(orderId: string | null | undefined): string {
  if (!orderId) return "#----";
  
  // Mock IDs like "ord_001", "ord_002" → extract the trailing number
  const trailingNum = orderId.match(/(\d+)$/);
  if (trailingNum) {
    const num = parseInt(trailingNum[1], 10);
    return `#${String(num).padStart(4, "0")}`;
  }
  
  // UUID-style: use last 4 hex digits as a number
  const hexOnly = orderId.replace(/-/g, "").replace(/[^0-9a-fA-F]/g, "");
  if (hexOnly.length >= 4) {
    const num = parseInt(hexOnly.slice(-4), 16) % 10000;
    return `#${String(num).padStart(4, "0")}`;
  }
  
  return `#${orderId.slice(0, 4).toUpperCase()}`;
}
