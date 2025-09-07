// Sidebar.tsx
'use client';

export default function Sidebar() {
  return (
    <aside
      aria-label="Navegación lateral"
      className="glass rounded-3xl h-full w-full bg-white"
      role="complementary"
      tabIndex={-1}
      style={{ backgroundColor: 'white' }}
    />
  );
}

