// API : réception du formulaire de contact
//  1) enregistre le message en base
//  2) route l'email vers le bon destinataire selon le sujet
//  3) envoie via Resend
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, societe, email, telephone, sujet, message, consent } = body;

    if (!nom || !email || !sujet || !message || !consent) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const sb = createAdminClient();

    // 1) enregistrer le message
    await sb.from('messages').insert({ nom, societe, email, telephone, sujet, message });

    // 2) trouver le destinataire selon le sujet (routage)
    const { data: route } = await sb.from('routage_contact').select('destinataire').eq('sujet', sujet).single();
    const { data: params } = await sb.from('parametres').select('valeur').eq('cle', 'email').single();
    const destinataire = route?.destinataire || params?.valeur || 'contact@pulz-ingenierie.fr';

    // 3) envoyer l'email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL || 'site@pulz-ingenierie.fr',
        to: destinataire,
        replyTo: email,
        subject: `[Contact site] ${sujet} — ${nom}`,
        text: `Nouveau message depuis le site PULZ\n\nNom : ${nom}\nSociété : ${societe || '—'}\nEmail : ${email}\nTéléphone : ${telephone || '—'}\nSujet : ${sujet}\n\nMessage :\n${message}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
