// Revalidation à la demande des pages qui listent la bibliothèque de logos clients.
//  Appelée par l'admin après ajout/suppression d'un logo dans photos/clients/,
//  pour que /groupe et la home reflètent le changement tout de suite (sans attendre l'ISR).
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  // Auth obligatoire (action d'admin).
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  // Chemins par défaut (logos clients) ; on accepte une liste optionnelle.
  let paths: string[] = ['/groupe', '/'];
  try {
    const body = await req.json();
    if (Array.isArray(body?.paths) && body.paths.length) paths = body.paths;
  } catch { /* pas de body : on garde les chemins par défaut */ }

  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ ok: true, revalidated: paths });
}
