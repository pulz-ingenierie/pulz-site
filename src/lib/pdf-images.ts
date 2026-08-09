// Extraction des images intégrées d'un PDF, page par page, via pdf-lib.
//  - JPEG (DCTDecode) : les octets bruts SONT un fichier JPEG.
//  - PNG  (FlateDecode, 8 bits, RGB/Gris, + transparence SMask) : reconstruits en PNG.
//  Les images répétées de page en page (logo membre, filigrane) sont écartées ;
//  on garde les photos ET les logos "one-shot" (logo client) pour arbitrage manuel.
import { PDFDocument, PDFName, PDFRawStream, PDFDict, PDFArray, type PDFRef } from 'pdf-lib';
import zlib from 'node:zlib';

export type PdfImage = { page: number; width: number; height: number; bytes: Uint8Array; ext: 'jpg' | 'png' };

// ---------- utilitaires ----------
function num(dict: PDFDict, key: string): number {
  const v: any = dict.lookup(PDFName.of(key));
  return typeof v?.asNumber === 'function' ? v.asNumber() : 0;
}
function filterStr(dict: PDFDict): string {
  const f: any = dict.lookup(PDFName.of('Filter'));
  return f ? f.toString() : '';
}
function streamBytes(stream: PDFRawStream): Uint8Array {
  const s: any = stream;
  return typeof s.getContents === 'function' ? s.getContents() : s.contents;
}

// Empreinte rapide (FNV-1a échantillonné) pour repérer les images répétées.
function hashBytes(b: Uint8Array): string {
  let h = 0x811c9dc5;
  const step = b.length > 4096 ? Math.floor(b.length / 4096) : 1;
  for (let i = 0; i < b.length; i += step) { h ^= b[i]; h = (h * 0x01000193) >>> 0; }
  return `${b.length}:${h.toString(16)}`;
}

// ---------- encodeur PNG (sans dépendance) ----------
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; }
  return t;
})();
function crc32(buf: Uint8Array): number {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function u32(n: number): Buffer { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0, 0); return b; }
function pngChunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  return Buffer.concat([u32(data.length), body, u32(crc32(body))]);
}
function encodePng(width: number, height: number, channels: 1 | 2 | 3 | 4, samples: Uint8Array): Uint8Array {
  const colorType = channels === 1 ? 0 : channels === 2 ? 4 : channels === 3 ? 2 : 6;
  const ihdr = Buffer.concat([u32(width), u32(height), Buffer.from([8, colorType, 0, 0, 0])]);
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  const src = Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filtre "none"
    src.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw);
  return new Uint8Array(Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0)),
  ]));
}

// Nombre de composantes couleur (null = colorspace non géré : Indexed, CMYK, Separation…).
function channelsForColorSpace(pdf: PDFDocument, dict: PDFDict): number | null {
  const cs: any = dict.lookup(PDFName.of('ColorSpace'));
  if (!cs) return null;
  const name = cs.toString();
  if (name === '/DeviceRGB' || name === '/RGB' || name === '/CalRGB') return 3;
  if (name === '/DeviceGray' || name === '/G' || name === '/CalGray') return 1;
  if (name === '/DeviceCMYK') return null;
  if (cs instanceof PDFArray) {
    const head = cs.lookup(0)?.toString();
    if (head === '/ICCBased') {
      const icc: any = pdf.context.lookup(cs.get(1) as PDFRef);
      const n = typeof icc?.dict?.lookup(PDFName.of('N'))?.asNumber === 'function' ? icc.dict.lookup(PDFName.of('N')).asNumber() : 0;
      return n === 1 ? 1 : n === 3 ? 3 : null;
    }
    if (head === '/CalRGB') return 3;
    if (head === '/CalGray') return 1;
    return null; // Indexed / Separation / DeviceN : non géré
  }
  return null;
}

// Reconstruit un PNG à partir d'une image FlateDecode (+ SMask si présent). null si non géré.
function flateToPng(pdf: PDFDocument, stream: PDFRawStream, width: number, height: number): Uint8Array | null {
  const dict = stream.dict;
  if (num(dict, 'BitsPerComponent') !== 8) return null;
  // Prédicteur PNG non géré (données pré-filtrées) -> on saute pour ne pas produire d'image cassée.
  const dp: any = dict.lookup(PDFName.of('DecodeParms')) ?? dict.lookup(PDFName.of('DP'));
  if (dp && typeof dp.lookup === 'function') {
    const pred: any = dp.lookup(PDFName.of('Predictor'));
    if (typeof pred?.asNumber === 'function' && pred.asNumber() > 1) return null;
  }
  const ch = channelsForColorSpace(pdf, dict);
  if (!ch) return null;

  let raw: Buffer;
  try { raw = zlib.inflateSync(Buffer.from(streamBytes(stream))); } catch { return null; }
  const needed = width * height * ch;
  if (raw.length < needed) return null;
  let samples: Uint8Array = raw.subarray(0, needed);
  let channels = ch;

  // Transparence : SMask = image de gris (alpha) même taille.
  const smaskRef = dict.get(PDFName.of('SMask'));
  if (smaskRef) {
    const sm: any = pdf.context.lookup(smaskRef as PDFRef);
    if (sm instanceof PDFRawStream) {
      const sw = num(sm.dict, 'Width'), sh = num(sm.dict, 'Height');
      if (sw === width && sh === height && filterStr(sm.dict).includes('FlateDecode') && num(sm.dict, 'BitsPerComponent') === 8) {
        try {
          const alpha = zlib.inflateSync(Buffer.from(streamBytes(sm)));
          if (alpha.length >= width * height) {
            const outCh = channels + 1;
            const out = Buffer.alloc(width * height * outCh);
            for (let i = 0; i < width * height; i++) {
              for (let c = 0; c < channels; c++) out[i * outCh + c] = samples[i * channels + c];
              out[i * outCh + channels] = alpha[i];
            }
            samples = out;
            channels = outCh;
          }
        } catch { /* alpha illisible : on garde l'image opaque */ }
      }
    }
  }

  try { return encodePng(width, height, channels as 1 | 2 | 3 | 4, samples); } catch { return null; }
}

// Parcourt les XObject d'un dictionnaire de ressources (récursif pour les Form XObject).
function collect(
  pdf: PDFDocument, resources: PDFDict | undefined, page: number,
  out: PdfImage[], minW: number, minH: number, depth: number,
) {
  if (!resources || depth > 4) return;
  const xobjects = resources.lookup(PDFName.of('XObject'), PDFDict);
  if (!xobjects) return;

  for (const [, ref] of xobjects.entries()) {
    const obj = pdf.context.lookup(ref as PDFRef);
    if (!(obj instanceof PDFRawStream)) continue;
    const d = obj.dict;
    const subtype = d.lookup(PDFName.of('Subtype'))?.toString();

    if (subtype === '/Image') {
      const width = num(d, 'Width'), height = num(d, 'Height');
      if (width < minW || height < minH) continue;
      const filter = filterStr(d);
      if (filter.includes('DCTDecode')) {
        try { out.push({ page, width, height, bytes: streamBytes(obj), ext: 'jpg' }); } catch { /* ignore */ }
      } else if (filter.includes('FlateDecode')) {
        const png = flateToPng(pdf, obj, width, height);
        if (png) out.push({ page, width, height, bytes: png, ext: 'png' });
      }
    } else if (subtype === '/Form') {
      collect(pdf, d.lookup(PDFName.of('Resources'), PDFDict), page, out, minW, minH, depth + 1);
    }
  }
}

/**
 * Extrait les images d'un PDF (JPEG + PNG), avec leur numéro de page (1-indexé).
 * Écarte les images répétées de page en page (logos/filigranes récurrents).
 */
export async function extractPageImages(
  bytes: Uint8Array,
  opts?: { minW?: number; minH?: number },
): Promise<PdfImage[]> {
  const minW = opts?.minW ?? 40;
  const minH = opts?.minH ?? 40;
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  const out: PdfImage[] = [];
  pdf.getPages().forEach((p, idx) => collect(pdf, p.node.Resources(), idx + 1, out, minW, minH, 0));

  const totalPages = pdf.getPageCount();
  const withHash = out.map((im) => ({ im, h: hashBytes(im.bytes) }));

  const pagesByHash = new Map<string, Set<number>>();
  for (const { im, h } of withHash) {
    const set = pagesByHash.get(h) ?? new Set<number>();
    set.add(im.page);
    pagesByHash.set(h, set);
  }
  // Une image sur plusieurs pages = logo/filigrane récurrent -> écartée.
  const boilerplate = new Set<string>();
  for (const [h, pages] of pagesByHash) {
    if (pages.size >= 3 || (totalPages > 1 && pages.size / totalPages >= 0.6)) boilerplate.add(h);
  }

  const kept: PdfImage[] = [];
  const seen = new Set<string>();
  for (const { im, h } of withHash) {
    if (boilerplate.has(h)) continue;
    const key = `${im.page}:${h}`;
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(im);
  }
  return kept;
}
