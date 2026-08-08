// LISTE DES RÉFÉRENCES — design maquette (pulz-references.html) : filtres + grille.
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import RefGrid, { type Ref } from './RefGrid';
import './references.css';

export const revalidate = 60;

export const metadata = {
  title: 'Références du groupement PULZ — Nos réalisations en Hauts-de-France',
  description:
    "Logement, tertiaire, industrie, hospitalier, équipements sportifs : découvrez les réalisations du groupement de maîtrise d'œuvre PULZ en Hauts-de-France et Île-de-France.",
};

export default async function ReferencesPage() {
  const sb = createClient();
  const { data } = await sb
    .from('references_projets')
    .select('slug, titre, categorie, localisation, description')
    .eq('statut', 'publie')
    .order('created_at', { ascending: false });

  const refs = (data ?? []) as Ref[];

  return (
    <>
      <Nav />
      <header className="refhero">
        <div className="in">
          <div className="bc">
            <Link href="/">PULZ</Link> · Références
          </div>
          <span className="eyebrow">Nos réalisations</span>
          <h1>Des projets qui font notre fierté</h1>
          <p>
            Logement, bureaux et tertiaires, hôtellerie, industrie, hospitalier, équipements sportifs : le
            groupement PULZ met ses compétences au service de votre réussite, sur toute la région
            Hauts-de-France et l'Île-de-France.
          </p>
        </div>
      </header>

      {refs.length > 0 ? (
        <RefGrid refs={refs} />
      ) : (
        <div className="refwrap">
          <div className="refgrid">
            <div className="noresult">Aucune référence publiée pour le moment.</div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
