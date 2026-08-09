// FICHE RÉFÉRENCE — gabarit dynamique (reference-*.html), depuis la base.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { createPublicClient } from '@/lib/supabase-public';
import { societeLogo } from '@/lib/images';
import './reference.css';

export const revalidate = 60;

// Pré-génère au build les fiches publiées (les nouvelles restent rendues à la demande puis mises en cache).
export async function generateStaticParams() {
  const sb = createPublicClient();
  const { data } = await sb.from('references_projets').select('slug').eq('statut', 'publie');
  return (data ?? []).map((r: any) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const sb = createPublicClient();
  const { data: ref } = await sb
    .from('references_projets')
    .select('titre, seo_titre, seo_description, description')
    .eq('slug', params.slug)
    .single();
  if (!ref) return {};
  return { title: ref.seo_titre || `${ref.titre} | Références PULZ`, description: ref.seo_description || ref.description };
}

export default async function ReferenceDetail({ params }: { params: { slug: string } }) {
  const sb = createPublicClient();
  const { data: ref } = await sb
    .from('references_projets')
    .select('*')
    .eq('slug', params.slug)
    .eq('statut', 'publie')
    .single();
  if (!ref) notFound();

  const intervenants: string[] = Array.isArray(ref.intervenants) ? ref.intervenants : [];
  const specificites: string[] = Array.isArray(ref.specificites) ? ref.specificites : [];

  // Membres impliqués + mission
  const { data: membres } = await sb
    .from('reference_membres')
    .select('mission, societes(nom, domaine, couleur, slug)')
    .eq('reference_id', ref.id);

  // Photos de la référence (galerie) — deux requêtes (pas de FK déclarée sur photo_id)
  const { data: rp } = await sb
    .from('reference_photos')
    .select('photo_id, ordre')
    .eq('reference_id', ref.id)
    .order('ordre');
  let photos: string[] = [];
  const photoIds = (rp ?? []).map((x: any) => x.photo_id).filter(Boolean);
  if (photoIds.length) {
    const { data: ph } = await sb.from('photos').select('id, url').in('id', photoIds);
    const map = Object.fromEntries((ph ?? []).map((p: any) => [p.id, p.url]));
    photos = (rp ?? []).map((x: any) => map[x.photo_id]).filter(Boolean);
  }

  // Réalisations similaires (même catégorie)
  const { data: similaires } = await sb
    .from('references_projets')
    .select('slug, titre, categorie, localisation')
    .eq('statut', 'publie')
    .eq('categorie', ref.categorie)
    .neq('slug', params.slug)
    .limit(3);

  const showPhotos = photos.length > 0 || specificites.length > 0;
  const cells = photos.length > 0 ? photos : [null, null, null];

  return (
    <>
      <Nav />

      {/* HERO + faits */}
      <section className="ri">
        <div className="wrap">
          <div className="bc">
            <Link href="/">PULZ</Link> · <Link href="/references">Références</Link>
          </div>
          <span className="cat">{ref.categorie}</span>
          <h1>{ref.titre}</h1>
          {ref.description && <p className="desc">{ref.description}</p>}
          <div className="ri-facts">
            {ref.maitrise_ouvrage && (
              <div className="ri-fact">
                <div className="k">Maîtrise d'ouvrage</div>
                <div className="v">{ref.maitrise_ouvrage}</div>
              </div>
            )}
            {ref.localisation && (
              <div className="ri-fact">
                <div className="k">Localisation</div>
                <div className="v">{ref.localisation}</div>
              </div>
            )}
            {intervenants.length > 0 && (
              <div className="ri-fact">
                <div className="k">Intervenants</div>
                <div className="v">
                  <ul className="ri-list">
                    {intervenants.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {ref.client_logo_url && (
            <div className="ri-clientwrap">
              <div className="ri-clientbox">
                <img src={ref.client_logo_url} alt={ref.maitrise_ouvrage || 'Client'} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Le projet en images / spécificités */}
      {showPhotos && (
        <section className="rphotos">
          <div className="wrap">
            <span className="eyebrow">Le projet en images</span>
            <div className="fluo" />
            <h2>Le projet en détail</h2>
            {ref.description && <p className="sub">{ref.description}</p>}
            {specificites.length > 0 && (
              <div className="spectext">
                <strong>Spécificités du projet :</strong>
                <ul style={{ margin: '10px 0 0', paddingLeft: 20, lineHeight: 1.9 }}>
                  {specificites.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rphotos-grid">
              {cells.map((src, i) =>
                src ? (
                  <img key={i} className="cell" src={src} alt={`${ref.titre} — photo ${i + 1}`} style={{ display: 'block' }} />
                ) : (
                  <div key={i} className="cell" />
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Membres impliqués */}
      {membres && membres.length > 0 && (
        <section className="rmembers">
          <div className="wrap">
            <span className="eyebrow">Le groupement</span>
            <div className="fluo" />
            <h2>Les membres PULZ impliqués</h2>
            <p className="rm-lead">
              Cette réalisation a mobilisé l'expertise d'un ou plusieurs bureaux du groupement, chacun sur sa
              mission.
            </p>
            <div className="scards">
              {membres.map((m: any, i: number) => {
                const s = m.societes;
                if (!s) return null;
                return (
                  <Link key={i} className={`scard ${s.slug}`} href={`/membres/${s.slug}`}>
                    <div className="logobox">
                      <img src={societeLogo(s.slug)} alt={s.nom} />
                    </div>
                    <div className="bd">
                      <h3>{s.nom}</h3>
                      <div className="role">{s.domaine}</div>
                      {m.mission && <p>{m.mission}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Réalisations similaires */}
      <section className="rmore">
        <div className="wrap">
          <span className="eyebrow">Références</span>
          <div className="fluo" />
          <h2>Réalisations similaires</h2>
          <p className="subt">D'autres projets de la catégorie « {ref.categorie} »</p>
          {similaires && similaires.length > 0 ? (
            <div className="rmore-grid">
              {similaires.map((s: any) => (
                <Link key={s.slug} className="rmini" href={`/references/${s.slug}`}>
                  <div className="ph">
                    <span className="cat">{s.categorie}</span>
                  </div>
                  <div className="bd">
                    <h3>{s.titre}</h3>
                    {s.localisation && <div className="loc">{s.localisation}</div>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--grey-lt)', fontSize: 15 }}>D'autres réalisations arrivent bientôt.</p>
          )}
          <div className="rback">
            <Link href="/references">← Retour à toutes les références</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rcta">
        <div className="wrap">
          <h2>Un projet similaire ?</h2>
          <p>Parlons de votre besoin — le groupement PULZ vous accompagne de la conception à la livraison.</p>
          <Link className="btn p" href="/contact">Nous contacter</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
