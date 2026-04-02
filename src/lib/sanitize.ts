/**
 * Escape XML entities to keep SVG output safe.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Validate a hex color string (without #).
 */
export function isValidHex(hex: string): boolean {
  return /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?$/.test(hex);
}

/**
 * Validate and normalize GitHub username.
 */
export function sanitizeUsername(username: string): string | null {
  const clean = username.trim();
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(clean)) {
    return clean;
  }
  return null;
}

/**
 * Normalize a hex query parameter.
 */
export function sanitizeHexParam(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  const clean = value.replace(/^#/, "");
  return isValidHex(clean) ? clean : undefined;
}

/**
 * Clamp integer values with fallback.
 */
export function clampInteger(
  value: string | null,
  min: number,
  max: number,
  fallback: number,
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

/**
 * Parse exact owner/repo exclusions.
 */
export function parseExcludeList(value: string | null): Set<string> {
  if (!value) return new Set();
  return new Set(
    value
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter((entry) => /^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(entry)),
  );
}

export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}
