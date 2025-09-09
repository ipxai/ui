'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ContentAR from '@/components/ui/content/content-ar';
import { Search, Sparkles } from 'lucide-react';

interface AnalisisRegistrabilidadProps {
  isExpanded: boolean;
}

interface RegistrabilidadResponse {
  // Define aquí la estructura de respuesta de tu API
  [key: string]: any;
}

export default function AnalisisRegistrabilidad({ isExpanded }: AnalisisRegistrabilidadProps) {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<RegistrabilidadResponse | null>(null);

  const { mutate: analyzeRegistrabilidad, isPending } = useMutation<
    RegistrabilidadResponse,
    Error,
    { prompt: string }
  >({
    mutationFn: async ({ prompt }) => {
      const response = await fetch('https://api.ipxbase.com/api/registrabilidadResumen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
      console.log('Respuesta de la API:', data);
    },
    onError: (error) => {
      console.error('Error en la consulta:', error);
      alert(`Error al conectar con la API: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    analyzeRegistrabilidad({ prompt: prompt.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <ContentAR isExpanded={isExpanded}>
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Análisis de Registrabilidad
          </h1>
          <p className="text-gray-600">
            Analiza si tu marca puede ser registrada
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2"></div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ingresa el nombre de la marca a analizar..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
                  disabled={isPending}
                />
              </div>

              <button
                type="submit"
                disabled={isPending || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Analizar Registrabilidad
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Indicador de carga */}
          {isPending && (
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <div className="animate-pulse flex items-center gap-2">
                  <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">Conectando con la API...</span>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {results && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Resultado del Análisis
            </h2>
            
            {results.results && results.results.length > 0 && (
              <div className="space-y-6">
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="space-y-4">
                    {/* Header con la marca analizada */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 rounded-xl p-4 border">
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">
                        Análisis para: "{result.promptId}"
                      </h3>
                    </div>
                    
                    {/* Contenido del análisis parseado */}
                    <div className="prose max-w-none">
                      <div 
                        className="bg-gray-50 rounded-lg p-6 text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: result.generated_text
                            .replace(/# /g, '<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-6">')
                            .replace(/## /g, '<h2 class="text-xl font-semibold text-gray-800 mb-3 mt-5">')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                            .replace(/- \*\*(.*?)\*\*/g, '<li class="mb-2"><strong class="font-semibold text-gray-900">$1</strong>')
                            .replace(/^- /gm, '<li class="mb-1">')
                            .replace(/\n\n/g, '</p><p class="mb-4">')
                            .replace(/^([^<])/gm, '<p class="mb-4">$1')
                            .replace(/([^>])$/gm, '$1</p>')
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Respuesta cruda como fallback */}
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Ver respuesta completa (JSON)
              </summary>
              <div className="mt-3 bg-gray-100 rounded-lg p-4">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </ContentAR>
  );
}