'use client';
import { motion } from 'framer-motion';
import TopSection from './TopSection';
import NavigationMenu from './NavigationMenu';
import UserArea from './UserArea';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  return (
    <motion.aside
      aria-label="Navegación lateral"
      className="rounded-3xl h-full cursor-pointer overflow-hidden"
      role="complementary"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      initial={false}
      animate={{
        width: isExpanded ? '264px' : '88px', // <-- Ajustado a 264px
        minWidth: isExpanded ? '264px' : '88px',
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 200,
      }}
      style={{
        position: 'fixed',
        left: '12px',
        top: '2vh',
        height: '96vh',
        zIndex: 20,
      }}
    >
      <div className="p-4 h-full flex flex-col">
        <TopSection isExpanded={isExpanded} />
        <motion.div
          className="flex-1"
          initial={false}
          animate={{ opacity: 1 }}
        >
          <NavigationMenu isExpanded={isExpanded} />
        </motion.div>
        <UserArea isExpanded={isExpanded} />
      </div>
    </motion.aside>
  );
}
