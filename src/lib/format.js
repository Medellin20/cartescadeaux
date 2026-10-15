export const euro = (cents) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);

export const maskEmail = (e = "") => e.replace(/^(.).*(@.*)$/, "$1•••$2");
