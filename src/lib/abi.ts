// Robustly handle abis whether exported as { abi } or as full array
export function extractAbi(mod: any) {
  return (mod?.abi ?? mod) as any[];
}
