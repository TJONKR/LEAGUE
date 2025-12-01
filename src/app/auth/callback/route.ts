import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/";

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // Check if user has a claimed profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      // If no profile, redirect to onboarding
      if (!profile) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }

      // Has profile, go to intended destination
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Return to login page with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}


