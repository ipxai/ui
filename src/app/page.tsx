'use client';

import Iridescence from '@/components/animations/Iridescence';
import Sidebar from '@/components/ui/Sidebar';
import Content from '@/components/ui/Content';

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* 🎨 Background animado - Forzar que esté debajo */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <Iridescence
          colors={[
            [1.0, 1.0, 1.0],
            [0.114, 0.141, 0.988],
          ]}
          mouseReact={false}
          amplitude={0.3}
          speed={1.5}
          className="w-full h-full"
        />
      </div>

      {/* 💎 Shell responsivo encima del fondo */}
      <div className="relative z-10 grid min-h-dvh p-4 gap-4 md:gap-6
                      grid-cols-1 md:grid-cols-[88px_minmax(0,1fr)] items-stretch">
        <Sidebar />
        <Content />
      </div>
    </main>
  );
}