const AUTH_ROUTES = new Set(["/login", "/signup"]);

/**
 * Validates and normalizes an internal redirect target.
 * Rejects external URLs, protocol-relative paths (e.g. //example.com),
 * backslash/control-character tricks, and auth routes to prevent redirect loops.
 */
export function sanitizeRedirectPath(
  candidate: unknown,
  fallback = "/"
): string {
  if (typeof candidate !== "string") {
    return fallback;
  }

  const trimmed = candidate.trim();
  if (!trimmed) {
    return fallback;
  }

  // Must start with a single forward slash and contain no backslashes or control chars
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(trimmed)
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, "http://fitstack.local");
    if (parsed.origin !== "http://fitstack.local") {
      return fallback;
    }

    if (!parsed.pathname.startsWith("/") || parsed.pathname.startsWith("//")) {
      return fallback;
    }

    if (AUTH_ROUTES.has(parsed.pathname)) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

/**
 * Normalizes Next.js searchParams values (string | string[] | undefined) to a single string.
 */
export function getSingleSearchParam(
  value: string | string[] | undefined
): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }
  return undefined;
}
