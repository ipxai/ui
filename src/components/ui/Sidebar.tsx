// Sidebar.tsx
'use client';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  return (
    <aside
      aria-label="Navegación lateral"
      className="glass rounded-3xl h-full bg-white cursor-pointer transition-all duration-300 ease-in-out"
      role="complementary"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        backgroundColor: 'white',
        width: isExpanded ? '240px' : '88px', // Ancho expandido vs colapsado
        minWidth: isExpanded ? '240px' : '88px',
        position: 'fixed',
        left: '12px',
        top: '2vh',
        height: '96vh',
        zIndex: 20,
      }}
    >
      {/* Contenido del sidebar */}
      <div className="p-4 h-full flex flex-col">
        {/* Botón toggle visual */}
        <div className="flex items-center justify-between mb-4">
          <span className={`font-medium transition-opacity duration-200 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            {isExpanded ? 'Menú' : ''}
          </span>
          <div className="w-6 h-6 flex items-center justify-center">
            <div className={`transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}>
              →
            </div>
          </div>
        </div>
        
        {/* Items del menú */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-5 h-5 bg-blue-500 rounded"></div>
                <span className={`transition-opacity duration-200 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}>
                  {isExpanded ? 'Dashboard' : ''}
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-5 h-5 bg-green-500 rounded"></div>
                <span className={`transition-opacity duration-200 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}>
                  {isExpanded ? 'Proyectos' : ''}
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-5 h-5 bg-purple-500 rounded"></div>
                <span className={`transition-opacity duration-200 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}>
                  {isExpanded ? 'Settings' : ''}
                </span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
