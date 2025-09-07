// Content.tsx
'use client';
export default function Content() {
  return (
    <section
      aria-label="Contenido principal"
      className="rounded-3xl h-full w-full overflow-y-auto z-10"
      role="region"
      tabIndex={-1}
      style={{
        background: 'radial-gradient(ellipse 180% 100% at top, #FFFFFF 98%, rgba(255, 255, 255, 0) 100%)',
        backdropFilter: 'blur(600px)',
        WebkitBackdropFilter: 'blur(180px)',
        borderRadius: '24px',
      }}
    />
  );
}
