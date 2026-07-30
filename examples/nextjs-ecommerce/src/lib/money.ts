// The single place where cents become display strings. Money is integer
// cents everywhere else in the codebase.
export function formatCents(cents: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(
    cents / 100,
  );
}
