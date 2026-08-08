'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { slugify } from '@/lib/slug';

export type UploadedPhoto = {
  id: string;
  url: string;
  nom_fichier: string;
  description?: string | null;
  a_renommer: boolean;
};

// Nom "type appareil photo" (IMG_1234, DSC0001…) → à renommer pour le SEO
function looksGeneric(name: string) {
  return /^(img|dsc|photo|image|capture|screenshot)[-_ ]?\d+/i.test(name) || /^\d{6,}/.test(name);
}

export default function PhotoUpload({
  folder,
  multiple = false,
  onUploaded,
}: {
  folder: 'references' | 'actus' | 'chantiers';
  multiple?: boolean;
  onUploaded: (photos: UploadedPhoto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr('');
    const sb = createClient();
    const out: UploadedPhoto[] = [];
    try {
      for (const file of Array.from(files)) {
        const dot = file.name.lastIndexOf('.');
        const ext = (dot >= 0 ? file.name.slice(dot + 1) : 'jpg').toLowerCase();
        const base = dot >= 0 ? file.name.slice(0, dot) : file.name;
        const generic = looksGeneric(file.name);
        const cleanBase = generic ? `photo-${Date.now()}` : slugify(base) || `photo-${Date.now()}`;
        const path = `${folder}/${cleanBase}.${ext}`;

        const { error: upErr } = await sb.storage.from('photos').upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || undefined,
        });
        if (upErr) throw upErr;

        const { data: pub } = sb.storage.from('photos').getPublicUrl(path);
        const url = pub.publicUrl;

        const { data: row, error: insErr } = await sb
          .from('photos')
          .insert({
            url,
            nom_fichier: `${cleanBase}.${ext}`,
            categorie: folder,
            taille_ko: Math.round(file.size / 1024),
            a_renommer: generic,
          })
          .select('id, url, nom_fichier, description, a_renommer')
          .single();
        if (insErr) throw insErr;
        out.push(row as UploadedPhoto);
      }
      onUploaded(out);
    } catch (e: any) {
      setErr(e?.message || "Échec de l'upload (politiques Storage en place ?)");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <label
        className="uploader"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="u-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </div>
        <p>{busy ? 'Envoi en cours…' : `Glissez ${multiple ? 'des photos' : 'une photo'} ici ou cliquez pour choisir`}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {err && <div className="notice err" style={{ marginTop: 12 }}>{err}</div>}
    </div>
  );
}
