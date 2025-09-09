// src/components/ui/content/Content.tsx
'use client';
import Header from './Header';
import Hero from './Hero';
import SearchSection from './SearchSection';
import ResultsGrid from './ResultsGrid';

interface ContentProps {
  isExpanded?: boolean; // Opcional ya que no se usa
  children?: React.ReactNode;
}

export default function Content({ children }: ContentProps) {
  return (
    <section
      aria-label="Contenido principal"
      role="region"
      tabIndex={-1}
      style={{
        userSelect: 'none',
        fontSize: '14px',
        padding: '20px',
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'transparent',
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        background: 'radial-gradient(86% 100% at 50% 11.3%, #fffffffe 90%, #ffffff80)',
        overflow: 'auto',
        height: '96vh',
        transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
        position: 'relative',
        top: '2vh',
        left: '-12px',
        right: '12px',
        borderRadius: '24px',
        margin: '0',
        maxWidth: 'calc(100vw - 0px)', // Sin restricción de ancho
      }}
    >
      <Header />
      <Hero />
      <SearchSection />
      <ResultsGrid />
      {children}
    </section>
  );
}