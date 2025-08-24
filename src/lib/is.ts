export const isTxHash = (s: string) => /^0x([A-Fa-f0-9]{64})$/.test(s);
