// Content.tsx
'use client';
export default function Content() {
  return (
    <section
      aria-label="Contenido principal"
      role="region"
      tabIndex={-1}
      style={{
        
        userSelect: 'none',
        fontSize: '14px',
        padding: '0',
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'transparent',
        flexGrow: 1,
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        background: 'radial-gradient(86% 100% at 50% 11.3%, #fffffff6 90%, #ffffff80)',
        overflow: 'hidden',
        height: '96vh',
        transition: 'transform .3s cubic-bezier(.215,.61,.355,1)',
        position: 'fixed',
        top: '2vh',
        left: '110px', // 88px (ancho del sidebar) + 12px (margen)
        right: '12px', // Margen derecho
        borderRadius: '24px',
        margin: '0',
        transform: 'translate(0)',
        width: 'auto', // Ancho automático para respetar los márgenes
      }}
    />
  );
}
