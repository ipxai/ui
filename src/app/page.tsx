// src/app/page.tsx
import AppShell from '@/components/layout/AppShell';

export default function HomePage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold mb-6">¡Bienvenido a IPX!</h1>
        <p className="text-gray-600 mb-8">
          Este contenido se ajusta automáticamente cuando el sidebar se expande o colapsa.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold mb-3 text-lg">Dashboard</h3>
            <p className="text-sm text-gray-600">
              Visualiza métricas importantes de tu aplicación
            </p>
          </div>
          
          <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold mb-3 text-lg">Proyectos</h3>
            <p className="text-sm text-gray-600">
              Gestiona todos tus proyectos activos
            </p>
          </div>
          
          <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold mb-3 text-lg">Configuración</h3>
            <p className="text-sm text-gray-600">
              Personaliza tu experiencia en la plataforma
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}