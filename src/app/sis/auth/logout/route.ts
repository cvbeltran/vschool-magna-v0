import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  await supabase.auth.signOut();
  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/sis/auth/login", url.origin));
}

