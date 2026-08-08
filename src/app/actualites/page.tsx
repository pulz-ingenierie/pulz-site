// LISTE ACTUALITÉS — design maquette (pulz-actualites.html) : 1 à la une + grille 3 col, filtres.
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-server';
import ActuFeed, { type Actu } from './ActuFeed';
import './actualites.css';

export const revalidate = 60;

export const metadata = {
  title: 'Actualités du groupement PULZ — Chantiers, vie du groupe & événements',
  description:
    "Suivez l'actualité du groupement de maîtrise d'œuvre PULZ : chantiers livrés, vie des bureaux d'études, certifications et événements en Hauts-de-France.",
};

export default async function ActualitesPage() {
  const sb = createClient();
  const { data } = await sb
    .from('actualites')
    .select('slug, titre, categorie, date_publication, extrait, image_url')
    .eq('statut', 'publie')
    .order('date_publication', { ascending: false });

  const actus = (data ?? []) as Actu[];

  return (
    <>
      <Nav />
      <header className="ac-hero">
        <div className="wrap">
          <span className="eyebrow">Le fil PULZ</span>
          <div className="fluo" />
          <h1>Nos actualités</h1>
          <p>
            Chantiers livrés, vie du groupe, certifications et événements : suivez l'actualité du groupement
            PULZ et de ses bureaux d'études.
          </p>
        </div>
      </header>

      {actus.length > 0 ? (
        <ActuFeed actus={actus} />
      ) : (
        <div className="ac-feed">
          <div className="ac-empty">Aucune actualité publiée pour le moment.</div>
        </div>
      )}

      <Footer />
    </>
  );
}
