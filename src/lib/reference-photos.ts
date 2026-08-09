// Récupère l'URL de la photo de couverture pour un lot de références.
//  Deux requêtes car il n'y a pas de FK déclarée entre reference_photos.photo_id
//  et photos.id (la jointure imbriquée PostgREST échouerait).
export async function coverPhotoMap(sb: any, refIds: string[]): Promise<Record<string, string>> {
  const ids = Array.from(new Set(refIds.filter(Boolean)));
  if (ids.length === 0) return {};

  const { data: rp } = await sb
    .from('reference_photos')
    .select('reference_id, photo_id, ordre, couverture')
    .in('reference_id', ids)
    .order('ordre');

  // Couverture = la ligne "couverture", sinon la 1re par ordre.
  const chosen = new Map<string, string>();
  for (const r of rp ?? []) {
    if (!r.photo_id) continue;
    if (r.couverture) chosen.set(r.reference_id, r.photo_id);
    else if (!chosen.has(r.reference_id)) chosen.set(r.reference_id, r.photo_id);
  }

  const photoIds = Array.from(new Set(chosen.values()));
  if (photoIds.length === 0) return {};
  const { data: ph } = await sb.from('photos').select('id, url').in('id', photoIds);
  const urlById = Object.fromEntries((ph ?? []).map((p: any) => [p.id, p.url]));

  const out: Record<string, string> = {};
  for (const [refId, photoId] of chosen) {
    const url = urlById[photoId];
    if (url) out[refId] = url;
  }
  return out;
}
