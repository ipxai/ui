// src/components/ui/content/ResultsGrid.tsx
'use client';

import { useResultsStore } from '@/store/resultsStore';
import { Search, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

type Card = { id: string | number; title: string; description?: string };

export default function ResultsGrid() {
  const results = useResultsStore((s) => s.results) as Card[];
  const [activeTab, setActiveTab] = useState<'exacta' | 'similar' | 'contiene'>('exacta');

  if (!results?.length) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay resultados</h3>
          <p className="text-gray-500">Intenta realizar una búsqueda para ver los resultados aquí</p>
        </div>
      </div>
    );
  }

  // Separar análisis IA y resultados de base de datos
  const analysisCard = results.find(r => r.id === 'analysis');
  const databaseResults = results.filter(r => r.id !== 'analysis' && !String(r.id).startsWith('header-'));
  
  // Agrupar resultados por tipo
  const exactaResults = databaseResults.filter(r => String(r.id).startsWith('exacta-'));
  const similarResults = databaseResults.filter(r => String(r.id).startsWith('similar-'));
  const contieneResults = databaseResults.filter(r => String(r.id).startsWith('contiene-'));
  const iaResults = databaseResults.filter(r => String(r.id).startsWith('ia-'));
  
  // Determinar si hay resultados de base de datos (exacta, similar, contiene)
  const hasDatabaseResults = exactaResults.length > 0 || similarResults.length > 0 || contieneResults.length > 0;

  // Configuración de tabs
  const tabs = [
    { 
      id: 'exacta' as const, 
      label: 'Exacta', 
      count: exactaResults.length,
      color: 'text-green-600',
      activeColor: 'border-green-500 text-green-600',
      inactiveColor: 'border-transparent text-gray-500 hover:text-gray-700'
    },
    { 
      id: 'similar' as const, 
      label: 'Similar', 
      count: similarResults.length,
      color: 'text-yellow-600',
      activeColor: 'border-yellow-500 text-yellow-600',
      inactiveColor: 'border-transparent text-gray-500 hover:text-gray-700'
    },
    { 
      id: 'contiene' as const, 
      label: 'Contiene', 
      count: contieneResults.length,
      color: 'text-blue-600',
      activeColor: 'border-blue-500 text-blue-600',
      inactiveColor: 'border-transparent text-gray-500 hover:text-gray-700'
    }
  ];

  const getCurrentResults = () => {
    switch (activeTab) {
      case 'exacta': return exactaResults;
      case 'similar': return similarResults;
      case 'contiene': return contieneResults;
      default: return exactaResults;
    }
  };

  const renderDatabaseCard = (item: Card) => (
    <article
      key={String(item.id)}
      className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-2xl p-6 shadow-sm transition-all duration-200"
    >
      <h3 className="font-semibold text-gray-900 leading-tight mb-3">
        {item.title}
      </h3>
      {item.description && (
        <div className="space-y-2">
          {item.description.split('\n').map((line, lineIdx) => {
            if (!line.trim()) return null;
            
            if (line.includes(':')) {
              const [key, ...valueParts] = line.split(':');
              const value = valueParts.join(':').trim();
              return (
                <div key={lineIdx} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">{key}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              );
            }
            
            return (
              <p key={lineIdx} className="text-sm text-gray-700">
                {line}
              </p>
            );
          })}
        </div>
      )}
    </article>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Análisis IA - Mostrar primero */}
      {analysisCard && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Análisis IA</h3>
          </div>
          
          <article className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 ring-2 ring-purple-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 leading-tight">
                {analysisCard.title}
              </h3>
              <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 ml-2" />
            </div>
            {analysisCard.description && (
              <div className="space-y-2">
                {analysisCard.description.split('\n').map((line, lineIdx) => {
                  if (!line.trim()) return null;
                  
                  if (line.includes('Puede inducir a error:')) {
                    const isError = line.includes('Sí');
                    return (
                      <div key={lineIdx} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isError ? <AlertCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        {line}
                      </div>
                    );
                  }
                  if (line.includes('Motivos:')) {
                    return (
                      <div key={lineIdx} className="text-sm text-gray-700 bg-gray-100 rounded-lg p-2">
                        <strong>Motivos:</strong> {line.replace('Motivos: ', '')}
                      </div>
                    );
                  }
                  
                  return (
                    <p key={lineIdx} className="text-sm text-gray-700">
                      {line}
                    </p>
                  );
                })}
              </div>
            )}
          </article>
        </div>
      )}

      {/* Resultados de la búsqueda - Solo mostrar tabs si hay resultados de base de datos */}
      {hasDatabaseResults && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resultados de la búsqueda</h3>
            <p className="text-gray-600">
              Se encontraron {exactaResults.length + similarResults.length + contieneResults.length} coincidencias
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? tab.activeColor
                      : tab.inactiveColor
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido del tab activo */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getCurrentResults().length > 0 ? (
              getCurrentResults().map(renderDatabaseCard)
            ) : (
              <div className="sm:col-span-2 lg:col-span-3 text-center py-8 text-gray-500">
                No hay resultados en esta categoría
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resultados IA - Mostrar cuando solo hay resultados de IA (sin tabs) */}
      {iaResults.length > 0 && !hasDatabaseResults && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resultados de la búsqueda</h3>
            <p className="text-gray-600">
              Se encontraron {iaResults.length} coincidencias
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {iaResults.map(renderDatabaseCard)}
          </div>
        </div>
      )}
    </div>
  );
}