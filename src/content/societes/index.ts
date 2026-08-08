import type { SocieteContent } from './types';
import { buscot } from './buscot';
import { arteix } from './arteix';
import { gradient } from './gradient';
import { therac } from './therac';

// Registre du contenu fixe des pages société.
export const SOCIETE_CONTENT: Record<string, SocieteContent> = {
  buscot,
  arteix,
  gradient,
  therac,
};

export function getSocieteContent(slug: string): SocieteContent | undefined {
  return SOCIETE_CONTENT[slug];
}

export type { SocieteContent } from './types';
