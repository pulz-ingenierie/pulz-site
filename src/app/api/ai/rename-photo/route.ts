// API IA : propose un nom de fichier + description SEO pour une photo
//  Reçoit l'URL d'une image, Claude l'analyse et propose un nom clair.
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl manquant' }, { status: 400 });

    // récupérer l'image et la convertir en base64
    const imgRes = await fetch(imageUrl);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const b64 = buf.toString('base64');
    const mime = imgRes.headers.get('content-type') || 'image/jpeg';

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mime as any, data: b64 } },
          { type: 'text', text: `Tu es l'assistant SEO du groupement d'ingénierie PULZ (bureaux d'études, bâtiment, Hauts-de-France). Analyse cette photo et propose, en JSON strict et rien d'autre : {"nom_fichier":"nom-clair-avec-tirets.jpg","description":"phrase courte décrivant l'image pour le référencement et l'accessibilité"}. Le nom de fichier doit être en minuscules, sans accents, mots séparés par des tirets, pertinent pour du BTP/ingénierie.` },
        ],
      }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur analyse IA' }, { status: 500 });
  }
}
