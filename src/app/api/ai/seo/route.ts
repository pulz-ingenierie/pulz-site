// API IA : optimise le titre + la description SEO d'un contenu
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    const { type, titre, contenu, localisation } = await req.json();
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Tu es l'expert SEO du groupement PULZ (maîtrise d'œuvre & bureaux d'études, Hauts-de-France : fluides, électricité, bâtiment, VRD, thermique). Pour ce ${type === 'reference' ? 'projet de référence' : 'article'}, rédige un titre SEO (max 60 caractères) et une méta-description (max 155 caractères) optimisés pour le référencement local. Réponds en JSON strict et rien d'autre : {"seo_titre":"...","seo_description":"..."}.\n\nTitre : ${titre}\nLocalisation : ${localisation || '—'}\nContenu : ${(contenu || '').slice(0, 800)}`,
      }],
    });
    const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json(parsed);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur IA SEO' }, { status: 500 });
  }
}
