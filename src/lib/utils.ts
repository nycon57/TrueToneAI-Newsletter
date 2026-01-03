import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Obfuscate an ID for logging to protect PII.
 * Masks all but the last 4 characters with asterisks.
 * Returns a stable, non-reversible representation.
 *
 * @example
 * obfuscateId('kp_12345678abcdef') // => '***********cdef'
 * obfuscateId('abc') // => 'abc' (too short to mask)
 */
export function obfuscateId(id: string | undefined | null): string {
  if (!id) return '[unknown]';

  const visibleChars = 4;
  if (id.length <= visibleChars) {
    return id; // Too short to meaningfully mask
  }

  const masked = '*'.repeat(id.length - visibleChars);
  const visible = id.slice(-visibleChars);
  return `${masked}${visible}`;
}
