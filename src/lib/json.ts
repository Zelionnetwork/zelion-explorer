// Safely convert BigInt & complex args to JSON
export function toJSON(value: any): any {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(toJSON);
  if (value && typeof value === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) out[k] = toJSON(v);
    return out;
  }
  return value;
}
