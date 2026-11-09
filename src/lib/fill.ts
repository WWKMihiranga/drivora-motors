/** Fills `{name}` placeholders in an editable template string, e.g. "Show {count} cars". Unknown keys stay as-is. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return (template ?? "").replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}
