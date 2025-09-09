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
          <div className="space-y-8">
            {results.results && results.results.length > 0 && (
              <>
                {results.results.map((result: any, index: number) => {
                  // Extraer secciones del texto
                  const sections = result.generated_text.split('##').slice(1);
                  const veredicto = sections[0]?.includes('No registrable') ? 'negative' : 
                                   sections[0]?.includes('Registrable') ? 'positive' : 'neutral';
                  
                  return (
                    <div key={index} className="space-y-8">
                      
                      {/* Header con veredicto - Más compacto */}
                      <div className={`rounded-3xl p-8 border-2 shadow-xl ${
                        veredicto === 'negative' 
                          ? 'bg-gradient-to-br from-red-50 via-pink-25 to-red-25 border-red-200' 
                          : veredicto === 'positive'
                          ? 'bg-gradient-to-br from-green-50 via-emerald-25 to-green-25 border-green-200'
                          : 'bg-gradient-to-br from-blue-50 via-indigo-25 to-blue-25 border-blue-200'
                      }`}>
                        <div className="text-center space-y-4">
                          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-lg ${
                            veredicto === 'negative' ? 'bg-red-100 border-4 border-red-200' : 
                            veredicto === 'positive' ? 'bg-green-100 border-4 border-green-200' : 'bg-blue-100 border-4 border-blue-200'
                          }`}>
                            {veredicto === 'negative' ? '🚫' : 
                             veredicto === 'positive' ? '✅' : '🔍'}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">
                              Marca "{result.promptId}"
                            </h3>
                            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold shadow-lg ${
                              veredicto === 'negative'
                                ? 'bg-red-500 text-white'
                                : veredicto === 'positive' 
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}>
                              {veredicto === 'negative' ? 'NO REGISTRABLE' : 
                               veredicto === 'positive' ? 'REGISTRABLE' : 'EN ANÁLISIS'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Grid de análisis - 2 columnas para evitar scroll */}
                      <div className="grid lg:grid-cols-2 gap-6">
                        {sections.map((section: string, secIndex: number) => {
                          const lines = section.trim().split('\n');
                          const title = lines[0]?.replace(/^\d+_/, '').replace(/_/g, ' ').trim();
                          const content = lines.slice(1).join('\n').trim();
                          
                          if (!title || !content) return null;
                          
                          // Iconos y colores mejorados
                          const getSectionConfig = (title: string) => {
                            if (title.includes('veredicto')) return { icon: '⚖️', color: 'from-purple-400 to-purple-600', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200' };
                            if (title.includes('clase')) return { icon: '📋', color: 'from-blue-400 to-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200' };
                            if (title.includes('distintividad')) return { icon: '🎯', color: 'from-orange-400 to-orange-600', bg: 'from-orange-50 to-orange-100', border: 'border-orange-200' };
                            if (title.includes('prohibiciones absolutas')) return { icon: '🚫', color: 'from-red-400 to-red-600', bg: 'from-red-50 to-red-100', border: 'border-red-200' };
                            if (title.includes('prohibiciones relativas')) return { icon: '⚠️', color: 'from-yellow-400 to-yellow-600', bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200' };
                            if (title.includes('normativa')) return { icon: '📖', color: 'from-indigo-400 to-indigo-600', bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200' };
                            if (title.includes('conclusion')) return { icon: '💡', color: 'from-green-400 to-green-600', bg: 'from-green-50 to-green-100', border: 'border-green-200' };
                            return { icon: '📄', color: 'from-gray-400 to-gray-600', bg: 'from-gray-50 to-gray-100', border: 'border-gray-200' };
                          };

                          const config = getSectionConfig(title);

                          return (
                            <div key={secIndex} className={`bg-gradient-to-br ${config.bg} border-2 ${config.border} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                              {/* Header de la sección */}
                              <div className={`bg-gradient-to-r ${config.color} px-6 py-4`}>
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                                    {config.icon}
                                  </span>
                                  <h4 className="text-lg font-bold text-white capitalize truncate">
                                    {title}
                                  </h4>
                                </div>
                              </div>
                              
                              {/* Contenido de la sección */}
                              <div className="p-6">
                                <div 
                                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm"
                                  dangerouslySetInnerHTML={{
                                    __html: content
                                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 bg-white/70 px-1 py-0.5 rounded text-xs">$1</strong>')
                                      .replace(/^- /gm, '• ')
                                      .replace(/\n\n/g, '<br><br>')
                                      .replace(/\n/g, '<br>')
                                      .replace(/Clase\s+(\d+)/g, '<span class="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">Clase $1</span>')
                                      .replace(/Art\.\s+(\d+)/g, '<span class="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">Art. $1</span>')
                                      .slice(0, 800) + (content.length > 800 ? '...' : '') // Limitar texto para evitar scroll excesivo
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </ContentAR>
  );
}