// src/components/ui/Content.tsx
'use client';

interface ContentProps {
  isExpanded: boolean;
  children?: React.ReactNode;
}

export default function Content({ isExpanded, children }: ContentProps) {
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
        flexGrow: 1,
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        background: 'radial-gradient(86% 100% at 50% 11.3%, #fffffffe 90%, #ffffff80)',
        overflow: 'auto',
        height: '96vh',
        transition: 'all .3s cubic-bezier(.215,.61,.355,1)',
        position: 'fixed',
        top: '2vh',
        left: isExpanded ? '264px' : '112px',
        right: '12px',
        borderRadius: '24px',
        margin: '0',
        width: 'auto',
      }}
    >
      {children}
    </section>
  );
}