'use client';
// Gestion de la bibliothèque de logos clients (photos/clients/).
//  - Liste tous les logos (réutilise listClientLogos).
//  - Suppression avec garde-fou : avant de supprimer, on cherche les références
//    dont client_logo_url = l'URL du logo. S'il y en a, une modale les liste.
//    À la confirmation : le fichier est retiré du Storage ET le logo est vidé
//    (client_logo_url = null) sur ces références.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { listClientLogos, busted, type ClientLogo } from '@/lib/client-logos';

type RefLite = { id: string; titre: string; slug: string | null };

export default function LogosManager() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Modale de confirmation de suppression
  const [target, setTarget] = useState<ClientLogo | null>(null);
  const [impacted, setImpacted] = useState<RefLite[]>([]);
  const [checking, setChecking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const sb = createClient();
      setLogos(await listClientLogos(sb));
    } catch (e: any) {
      setErr(e?.message || 'Chargement impossible');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { reload(); }, []);

  // Ouvre la modale : cherche les références qui utilisent ce logo.
  async function askDelete(logo: ClientLogo) {
    setTarget(logo);
    setImpacted([]);
    setChecking(true);
    try {
      const sb = createClient();
      // client_logo_url stocke l'URL PROPRE (sans ?v) = logo.url
      const { data } = await sb
        .from('references_projets')
        .select('id, titre, slug')
        .eq('client_logo_url', logo.url);
      setImpacted((data ?? []) as RefLite[]);
    } catch (e: any) {
      setErr(e?.message || 'Vérification impossible');
    } finally {
      setChecking(false);
    }
  }

  function closeModal() {
    if (deleting) return;
    setTarget(null);
    setImpacted([]);
  }

  // Confirme : vide le logo sur les références impactées, puis supprime le fichier.
  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    setErr('');
    try {
      const sb = createClient();
      // 1) Détacher le logo des références (client_logo_url -> null)
      if (impacted.length > 0) {
        const { error: upErr } = await sb
          .from('references_projets')
          .update({ client_logo_url: null })
          .eq('client_logo_url', target.url);
        if (upErr) throw upErr;
      }
      // 2) Supprimer le fichier du Storage
      const { error: rmErr } = await sb.storage.from('photos').remove([`clients/${target.name}`]);
      if (rmErr) throw rmErr;
      // 3) Régénère la home + /groupe (bandes « Ils nous font confiance »)
      try { await fetch('/api/admin/revalidate', { method: 'POST' }); } catch { /* non bloquant */ }

      setNotice(
        impacted.length > 0
          ? `Logo « ${target.alt} » supprimé. Détaché de ${impacted.length} référence(s) — pense à leur réassigner un logo.`
          : `Logo « ${target.alt} » supprimé.`,
      );
      setTarget(null);
      setImpacted([]);
      await reload();
    } catch (e: any) {
      setErr(e?.message || 'Suppression impossible (droits Storage ?)');
    } finally {
      setDeleting(false);
    }
  }

  const shown = q.trim()
    ? logos.filter((l) => l.alt.toLowerCase().includes(q.trim().toLowerCase()))
    : logos;

  return (
    <>
      {notice && <div className="notice ok" style={{ marginBottom: 14 }}>{notice}</div>}
      {err && <div className="notice err" style={{ marginBottom: 14 }}>{err}</div>}

      <div className="acard">
        <h2>Bibliothèque de logos clients</h2>
        <p className="hint" style={{ marginTop: 0 }}>
          Ces logos alimentent les bandes « Ils nous font confiance » (home et page Groupe) et le sélecteur de logo des références.
          Avant toute suppression, les références utilisant le logo sont listées.
        </p>

        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un logo…"
          style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, marginBottom: 14 }}
        />

        {loading ? (
          <span className="hint">Chargement…</span>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
            {shown.map((l) => (
              <div key={l.name} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 10, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={busted(l)} alt={l.alt} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--grey)', textAlign: 'center', wordBreak: 'break-word' }}>{l.alt}</div>
                <button type="button" className="mini del" onClick={() => askDelete(l)} style={{ alignSelf: 'center' }}>
                  Supprimer
                </button>
              </div>
            ))}
            {shown.length === 0 && <span className="hint">Aucun logo{q ? ' pour cette recherche' : ''}.</span>}
          </div>
        )}
      </div>

      {/* Modale de confirmation */}
      {target && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,64,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 480, width: '100%', boxShadow: '0 24px 60px rgba(10,37,64,.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <img src={busted(target)} alt={target.alt} style={{ height: 40, maxWidth: 120, objectFit: 'contain' }} />
              <h3 style={{ margin: 0, fontSize: 18, color: 'var(--deep)' }}>Supprimer « {target.alt} » ?</h3>
            </div>

            {checking ? (
              <p className="hint">Vérification des références…</p>
            ) : impacted.length > 0 ? (
              <>
                <div className="notice warn" style={{ marginBottom: 12 }}>
                  Ce logo est utilisé par {impacted.length} référence(s). Il en sera retiré (elles resteront, mais sans logo client) :
                </div>
                <ul style={{ margin: '0 0 16px', paddingLeft: 18, maxHeight: 200, overflowY: 'auto' }}>
                  {impacted.map((r) => (
                    <li key={r.id} style={{ marginBottom: 6, fontSize: 14 }}>
                      <Link href={`/admin/references/${r.id}`} target="_blank" style={{ color: 'var(--blue)' }}>
                        {r.titre}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="hint" style={{ marginTop: 0 }}>
                  Note ces références : tu pourras leur réassigner un logo ensuite.
                </p>
              </>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--grey)', marginBottom: 16 }}>
                Ce logo n'est utilisé par aucune référence. La suppression est sans impact sur les fiches projets.
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="abtn ghost" onClick={closeModal} disabled={deleting}>Annuler</button>
              <button
                type="button"
                className="abtn"
                onClick={confirmDelete}
                disabled={deleting || checking}
                style={{ color: '#fff', background: '#C0392B', borderColor: '#C0392B' }}
              >
                {deleting ? 'Suppression…' : 'Supprimer le logo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
