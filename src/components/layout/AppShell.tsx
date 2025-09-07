// src/components/layout/AppShell.tsx
'use client';
import { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import Content from '../ui/Content';
import Iridescence from '../animations/Iridescence';

interface AppShellProps {
  children?: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsSidebarExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarExpanded(false);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Iridescence */}
      <div className="absolute inset-0 z-0">
        <Iridescence
          colors={[
            [1.0, 1.0, 1.0],
            [0.114, 0.141, 0.988],
          ]}
          speed={0.8}
          amplitude={0.15}
          mouseReact={true}
        />
      </div>

      {/* Hover area para el sidebar */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: isSidebarExpanded ? '264px' : '100px',
          height: '100vh',
          zIndex: 25,
          pointerEvents: 'auto',
        }}
      >
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          onToggle={() => {}}
        />
      </div>

      {/* Content */}
      <Content isExpanded={isSidebarExpanded}>
        {children}
      </Content>
    </div>
  );
}