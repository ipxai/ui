// src/app/api/buscar/route.ts
import { NextResponse } from 'next/server';

type OptionType = '1' | '3';

type RawItem = {
  id?: number | string;
  nombre?: string;        // BD
  marca?: string;         // IA
  resultado?: string;     // 'exacta' | 'contiene' | 'fonetica' | 'ia'
  similarity?: number | string;
  nizza?: number | string;
  descripcion?: string;
  phonetic_distance?: number | string;
};

type Analysis = {
  marca?: string;
  puede_inducir_a_error?: boolean;
  motivo_de_posible_confusion?: any[];
  observaciones?: string;
};

type RawResponse =
  | { exacta?: RawItem[]; similar?: RawItem[]; contiene?: RawItem[]; resultado_analisis?: Analysis }
  | RawItem[]
  | Record<string, any>;

type NormItem = {
  id: string;
  marca: string;
  resultado?: string;
  similarity?: number;
  nizza?: string | null;
  descripcion?: string | null;
  phonetic_distance?: number | null;
};

type Groups = {
  exacta: NormItem[];
  similar: NormItem[];
  contiene: NormItem[];
  ia:     NormItem[];  // Items IA “anidados” (si los hay)
};

export async function POST(req: Request) {
  try {
    const { query, option, nizza, dedupe = false } = (await req.json().catch(() => ({}))) as {
      query?: string;
      option?: OptionType;
      nizza?: string | number;
      dedupe?: boolean;
    };
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: "Field 'query' is required" }, { status: 400 });
    }

    const opt: OptionType = option === '3' ? '3' : '1';

    const upstream = await fetch('https://api.ipxbase.com/api/searchbrand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // Enviamos ambas claves por si el backend distingue mayúsculas
      body: JSON.stringify({ query, option: opt, Option: opt, nizza: nizza ?? '' }),
      cache: 'no-store',
    });

    const rawText = await upstream.text();
    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Backend error', status: upstream.status, details: safeJson(rawText) },
        { status: upstream.status }
      );
    }

    const raw = safeJson(rawText) as RawResponse;

    // 1) Primero intentamos leer grupos top-level (exacta/similar/contiene)
    const exactaRaw  = toArray((raw as any)?.exacta);
    const similarRaw = toArray((raw as any)?.similar);
    const contieneRaw = toArray((raw as any)?.contiene);

    const analysis: Analysis | null = (raw as any)?.resultado_analisis ?? null;

    let groups: Groups = {
      exacta:  exactaRaw.map(mapItem),
      similar: similarRaw.map(mapItem).sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0)),
      contiene: contieneRaw.map(mapItem),
      ia: [],
    };

    // 2) Si NO hay grupos top-level, pero es IA, recolectamos arrays anidados como IA
    if (!groups.exacta.length && !groups.similar.length && !groups.contiene.length) {
      const nested = collectIAItems(raw as any).map(mapItem);
      groups.ia = nested.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
    }

    // 3) Dedupe opcional por (id+marca) PERO por sección (no mezclamos secciones)
    if (dedupe) {
      groups.exacta  = dedupByKey(groups.exacta,  (x) => `${x.id}::${x.marca}`);
      groups.similar = dedupByKey(groups.similar, (x) => `${x.id}::${x.marca}`);
      groups.contiene= dedupByKey(groups.contiene,(x) => `${x.id}::${x.marca}`);
      groups.ia      = dedupByKey(groups.ia,      (x) => `${x.id}::${x.marca}`);
    }

    return NextResponse.json(
      { groups, analysis, meta: buildMeta(groups, opt, dedupe) },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: 'Internal error', details: e?.message || String(e) }, { status: 500 });
  }
}

/* ---------------- helpers ---------------- */

function safeJson(text: string) { try { return JSON.parse(text); } catch { return { raw: text }; } }
function toArray<T = any>(val: any): T[] { return Array.isArray(val) ? val : []; }
function asNum(n: any): number | null {
  if (n === null || n === undefined || n === '') return null;
  const v = typeof n === 'string' ? parseFloat(n) : (n as number);
  return Number.isFinite(v) ? v : null;
}
function asStr(v: any): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}
function mapItem(it: RawItem): NormItem {
  const marca = asStr(it.nombre) ?? asStr(it.marca) ?? 'Sin nombre';
  const id = asStr(it.id) ?? `${marca}-tmp`;
  return {
    id,
    marca,
    resultado: asStr(it.resultado) ?? undefined,
    similarity: asNum(it.similarity) ?? undefined,
    nizza: asStr(it.nizza),
    descripcion: asStr(it.descripcion),
    phonetic_distance: asNum((it as any).phonetic_distance) ?? null,
  };
}
function dedupByKey<T>(arr: T[], keyFn: (t: T) => string) {
  const seen = new Set<string>(); const out: T[] = [];
  for (const x of arr) { const k = keyFn(x); if (!k || seen.has(k)) continue; seen.add(k); out.push(x); }
  return out;
}
/** Recorre recursivamente y recoge objetos con 'marca' o 'nombre' */
function collectIAItems(root: Record<string, any>): RawItem[] {
  const out: RawItem[] = [];
  const visit = (node: any) => {
    if (Array.isArray(node)) {
      for (const el of node) {
        if (el && typeof el === 'object') {
          if ('marca' in el || 'nombre' in el || 'title' in el) out.push(el as RawItem);
          else visit(el);
        }
      }
      return;
    }
    if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) visit(node[k]);
    }
  };
  visit(root);
  return out;
}
function buildMeta(groups: Groups, opt: OptionType, dedupe: boolean) {
  const sum = (a: number, b: number) => a + b;
  return {
    option: opt,
    dedupe,
    counts: {
      exacta: groups.exacta.length,
      similar: groups.similar.length,
      contiene: groups.contiene.length,
      ia: groups.ia.length,
      total: [groups.exacta.length, groups.similar.length, groups.contiene.length, groups.ia.length].reduce(sum, 0),
    },
  };
}
