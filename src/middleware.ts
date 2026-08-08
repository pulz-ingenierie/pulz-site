// Protège toutes les routes /admin : redirige vers /admin/login si non connecté
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseUrl } from '@/lib/supabase-url';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(
    supabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(list: { name: string; value: string; options?: any }[]) {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;

  if (path.startsWith('/admin') && !path.startsWith('/admin/login') && !user) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return res;
}

export const config = { matcher: ['/admin/:path*'] };
