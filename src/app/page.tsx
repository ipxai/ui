// src/app/page.tsx
// src/app/page.tsx
import AppShell from '@/components/layout/AppShell';
import SearchAI from '@/components/ui/searchai/SearchAI';
import Login from '@/components/auth/Login';

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
        {/* Bienvenida */}
        <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm mb-6 text-center">
          <h1 className="text-3xl font-bold">¡Bienvenido a IPX!</h1>
        </div>
        {/* Login (centrado y con estilo consistente) */}
        <div className="w-full max-w-md mb-6">
          <Login />
        </div>
        {/* SearchAI centrado */}
        <SearchAI />
        {/* Grid (opcional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Contenido del grid */}
        </div>
      </div>
    </AppShell>
  );
}
