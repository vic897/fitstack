import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getSingleSearchParam,
  sanitizeRedirectPath,
} from "@/lib/auth/redirects";

export type AuthSearchParams = Promise<{
  error?: string | string[];
  redirectTo?: string | string[];
}>;

function safeDecodeParam(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Awaits Next.js 16 searchParams, sanitizes redirectTo, and redirects
 * already-authenticated users away from auth pages.
 */
export async function resolveAuthPageProps(searchParams: AuthSearchParams): Promise<{
  redirectTo: string;
  initialError?: string;
}> {
  const resolved = await searchParams;
  const rawRedirect = getSingleSearchParam(resolved?.redirectTo);
  const redirectTo = sanitizeRedirectPath(rawRedirect, "/");
  const initialError = safeDecodeParam(getSingleSearchParam(resolved?.error));

  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAuthenticated = Boolean(user);
  } catch {
    // Allow auth UI to render even when Supabase env vars are unconfigured
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    redirect(redirectTo);
  }

  return { redirectTo, initialError };
}
