// src/components/ui/content/SearchSection.tsx
"use client";
import { useMutation } from '@tanstack/react-query';
import { useResultsStore } from '@/store/resultsStore';
import { Search, Sparkles, Database } from 'lucide-react';
import { useState } from 'react';

type OptionType = '1' | '3';

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
  ia: NormItem[];
};

type Analysis = {
  marca?: string;
  puede_inducir_a_error?: boolean;
  motivo_de_posible_confusion?: string[];
  observaciones?: string;
};

export default function SearchSection() {
  const setResults = useResultsStore.getState().setResults;
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'database' | 'ai'>('database');

  const { mutate: run, isPending } = useMutation<
    { groups?: Groups; analysis?: Analysis | null } | unknown,
    Error,
    { query: string; option: OptionType; dedupe?: boolean }
  >({
    mutationFn: async (vars) => {
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status} – ${text}`);
      return JSON.parse(text);
    },
    onSuccess: (payload) => {
      const typedPayload = payload as { groups?: Groups; analysis?: Analysis | null };
      const g: Groups | undefined = typedPayload?.groups;
      const analysis: Analysis | null | undefined = typedPayload?.analysis;

      const cards: { id: string; title: string; description: string }[] = [];

      // IA: card de análisis
      if (analysis && (analysis.observaciones || analysis.marca)) {
        const flag = typeof analysis.puede_inducir_a_error === 'boolean'
          ? `Puede inducir a error: ${analysis.puede_inducir_a_error ? 'Sí' : 'No'}`
          : '';
        const motivos = Array.isArray(analysis.motivo_de_posible_confusion) && analysis.motivo_de_posible_confusion.length
          ? `Motivos: ${analysis.motivo_de_posible_confusion.join(', ')}`
          : '';
        const obs = (analysis.observaciones ?? '').toString().trim();
        const resumen = obs.length > 480 ? obs.slice(0, 480) + '…' : obs;

        cards.push({
          id: 'analysis',
          title: `Análisis IA${analysis.marca ? ` para "${analysis.marca}"` : ''}`,
          description: [resumen, flag, motivos].filter(Boolean).join('\n'),
        });
      }

      // Helper para crear sección + items formateados
      const pushSection = (label: string) => {
        cards.push({ id: `header-${label.toLowerCase()}`, title: label, description: '' });
      };

      const fmtBD = (it: NormItem) =>
        `id: ${it.id}\nMarca: ${it.marca}\nresultado: ${it.resultado ?? '-'}`;

      const fmtIA = (it: NormItem) =>
        `marca: ${it.marca}\nnizza: ${it.nizza ?? '-'}\ndescripcion: ${it.descripcion ?? '-'}\nphonetic_distance: ${it.phonetic_distance ?? '-'}`;

      if (g) {
        // Base de datos (exacta/similar/contiene)
        if (g.exacta.length) {
          pushSection('Exacta');
          g.exacta.forEach((it, i) =>
            cards.push({ id: `exacta-${it.id}-${i}`, title: it.marca, description: fmtBD(it) })
          );
        }
        if (g.similar.length) {
          pushSection('Similar');
          g.similar.forEach((it, i) =>
            cards.push({ id: `similar-${it.id}-${i}`, title: it.marca, description: fmtBD(it) })
          );
        }
        if (g.contiene.length) {
          pushSection('Contiene');
          g.contiene.forEach((it, i) =>
            cards.push({ id: `contiene-${it.id}-${i}`, title: it.marca, description: fmtBD(it) })
          );
        }
        // IA (si hubo extracción anidada)
        if (g.ia.length) {
          pushSection('IA');
          g.ia.forEach((it, i) =>
            cards.push({ id: `ia-${it.id}-${i}`, title: it.marca, description: fmtIA(it) })
          );
        }
      }

      setResults(cards);
    },
    onError: (e) => {
      console.error(e);
      alert(`Error al buscar: ${e.message}`);
      setResults([]);
    },
  });

  function submit(query: string, option: OptionType, dedupe = false) {
    if (!query || query.trim().length < 2) return;
    run({ query: query.trim(), option, dedupe });
  }

  const handleSearch = () => {
    const option = searchType === 'ai' ? '3' : '1';
    submit(query, option, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const isDisabled = isPending || !query.trim() || query.trim().length < 2;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header mínimo solo para el borde superior */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2">
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Input de búsqueda */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ingresa el nombre de la marca a buscar..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
                disabled={isPending}
              />
            </div>

            {/* Select y botón en la misma fila */}
            <div className="flex gap-3">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'database' | 'ai')}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white"
                disabled={isPending}
              >
                <option value="database">Buscar en Base de Datos</option>
                <option value="ai">Analizar con IA</option>
              </select>

              <button
                onClick={handleSearch}
                disabled={isDisabled}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {searchType === 'ai' ? 'Analizando...' : 'Buscando...'}
                  </>
                ) : (
                  <>
                    {searchType === 'ai' ? <Sparkles className="h-5 w-5" /> : <Database className="h-5 w-5" />}
                    Buscar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Indicador de carga */}
        {isPending && (
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="animate-pulse flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-gray-600">Procesando búsqueda...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}