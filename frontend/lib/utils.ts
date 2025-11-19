// frontend/lib/utils.ts

// Minimal utility — no external dependencies
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
