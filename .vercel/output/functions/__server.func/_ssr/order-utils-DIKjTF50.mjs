function formatOrderCode(orderId, orderNumber) {
  if (typeof orderNumber === "number") {
    return `#${String(orderNumber).padStart(4, "0")}`;
  }
  if (!orderId) return "#----";
  const trailingNum = orderId.match(/(\d+)$/);
  if (trailingNum) {
    const num = parseInt(trailingNum[1], 10);
    return `#${String(num).padStart(4, "0")}`;
  }
  const hexOnly = orderId.replace(/-/g, "").replace(/[^0-9a-fA-F]/g, "");
  if (hexOnly.length >= 4) {
    const num = parseInt(hexOnly.slice(-4), 16) % 1e4;
    return `#${String(num).padStart(4, "0")}`;
  }
  return `#${orderId.slice(0, 4).toUpperCase()}`;
}
export {
  formatOrderCode as f
};
