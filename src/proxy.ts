import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let supabaseResponse = NextResponse.next({ request });

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

  const { data: { user } } = await supabase.auth.getUser();

  // Public paths that don't need profile check
  const publicPaths = ["/login", "/signup", "/onboarding", "/auth/callback"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If user is logged in and on a non-public path, check for profile
  if (user && !isPublicPath) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", user.id)
      .maybeSingle();

    // No profile = needs onboarding
    if (!profile) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Protected paths need login
  const protectedPaths = ["/settings", "/hackathons/new", "/bounties/new", "/projects/new"];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  
  if (isProtectedPath && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
