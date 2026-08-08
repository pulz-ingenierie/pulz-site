'use client';

import { useEffect, useState } from 'react';

export type Experience = { d: string; t: string; desc: string };
export type Membre = {
  slug: string;
  nom: string;
  role: string;
  accroche?: string | null;
  profil?: string | null;
  experiences: Experience[];
  formation?: string | null;
  competences: string[];
  photo?: string;
  groupe?: boolean; // badge "Groupement PULZ"
};

function initials(nom: string) {
  return nom
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Equipe({ membres, titre = 'Vos interlocuteurs' }: { membres: Membre[]; titre?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const m = openIdx !== null ? membres[openIdx] : null;

  useEffect(() => {
    document.body.style.overflow = m ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [m]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section className="team">
      <div className="in">
        <div className="head">
          <span className="eyebrow">L'équipe</span>
          <h2>{titre}</h2>
        </div>
        <div className="team-grid">
          {membres.map((mb, i) => (
            <button key={mb.slug} type="button" className="member clickable" onClick={() => setOpenIdx(i)}>
              {mb.photo ? (
                <img className="pic" src={mb.photo} alt={mb.nom} />
              ) : (
                <div className="pic-init">{initials(mb.nom)}</div>
              )}
              <div className="bd">
                <div className="nm">{mb.nom}</div>
                <div className="role">{mb.role}</div>
                {mb.groupe && <span className="grp">Groupement PULZ</span>}
                {mb.accroche && <div className="desc">{mb.accroche}</div>}
                <span className="seemore">Voir le CV →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Volet latéral CV */}
      <div className={`cv-ov${m ? ' on' : ''}`} onClick={() => setOpenIdx(null)} />
      <aside className={`cv${m ? ' on' : ''}`} aria-hidden={!m}>
        <button className="cv-x" onClick={() => setOpenIdx(null)} aria-label="Fermer">
          ×
        </button>
        {m && (
          <>
            <div className="cv-top">
              {m.photo ? (
                <img className="cv-photo" src={m.photo} alt={m.nom} />
              ) : (
                <div className="cv-photo-init">{initials(m.nom)}</div>
              )}
              <div className="cv-id">
                <div className="r">{m.role}</div>
                <h3>{m.nom}</h3>
                {m.accroche && <div className="acc">{m.accroche}</div>}
              </div>
            </div>
            <div className="cv-body">
              {m.profil && (
                <div className="cv-sec">
                  <div className="h">Profil</div>
                  <p>{m.profil}</p>
                </div>
              )}
              {m.experiences.length > 0 && (
                <div className="cv-sec">
                  <div className="h">Expériences clés</div>
                  <div className="cv-xp">
                    {m.experiences.map((x, i) => (
                      <div key={i} className="cv-xp-item">
                        <div className="d">{x.d}</div>
                        <div className={`t${x.t.includes('PULZ') ? ' accent' : ''}`}>{x.t}</div>
                        <div className="dd">{x.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {m.formation && (
                <div className="cv-sec">
                  <div className="h">Formation</div>
                  <p>{m.formation}</p>
                </div>
              )}
              {m.competences.length > 0 && (
                <div className="cv-sec">
                  <div className="h">Compétences</div>
                  <div className="cv-skills">
                    {m.competences.map((s, i) => (
                      <span key={i} className="cv-skill">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </section>
  );
}
