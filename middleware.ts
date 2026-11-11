import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectPath } from "@/lib/auth/redirects";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session — do not remove this
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Protected routes
    const protectedPaths = ["/my-workouts", "/progress"];
    const isProtected = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      const safeTarget = sanitizeRedirectPath(
        `${pathname}${request.nextUrl.search}`,
        "/"
      );
      url.searchParams.set("redirectTo", safeTarget);
      return NextResponse.redirect(url);
    }

    // Redirect already-authenticated users away from auth pages
    const authPaths = ["/login", "/signup"];
    const isAuthRoute = authPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isAuthRoute && user) {
      const safeTarget = sanitizeRedirectPath(
        request.nextUrl.searchParams.get("redirectTo"),
        "/"
      );
      const url = new URL(safeTarget, request.url);
      return NextResponse.redirect(url);
    }
  } catch (e) {
    console.error("Middleware error:", e);
    // On error — allow request through rather than breaking the app
    return NextResponse.next({ request });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
