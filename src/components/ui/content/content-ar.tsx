// src/components/ui/content/content-ar.tsx
'use client';

interface ContentARProps {
  isExpanded: boolean;
  children?: React.ReactNode;
}

export default function ContentAR({ isExpanded, children }: ContentARProps) {
  return (
    <section
      aria-label="Contenido de análisis de registrabilidad"
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
        maxWidth: 'calc(100vw - 0px)',
      }}
    >
      {/* Contenedor completamente vacío, listo para contenido personalizado */}
      {children}
    </section>
  );
}