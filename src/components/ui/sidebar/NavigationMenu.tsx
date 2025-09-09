'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, BookOpen, Search } from 'lucide-react';
import Avatar from 'boring-avatars';

interface NavigationMenuProps {
  isExpanded: boolean;
}

export default function NavigationMenu({ isExpanded }: NavigationMenuProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'descubre',
      label: 'Descubre',
      icon: <Globe size={32} strokeWidth={1.10} />,
      name: 'Descubre',
      href: '/descubre'
    },
    {
      id: 'analisis-registrabilidad',
      label: 'Analiza tu marca',
      icon: <Search size={32} strokeWidth={1.10} />,
      name: 'Analiza tu marca',
      href: '/analisis-de-registrabilidad'
    },
    {
      id: 'faqs',
      label: 'FAQs',
      icon: <BookOpen size={32} strokeWidth={1.10} />,
      name: 'FAQs',
      href: '/faqs'
    }
  ];

  return (
    <nav className="flex-1 py-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-out group hover:bg-white/10 ${
                activeItem === item.id
                  ? 'bg-white/15 text-white'
                  : 'text-white hover:text-white/90'
              }`}
              onClick={() => setActiveItem(item.id)}
            >
              <div className="flex-shrink-0 w-[40px] h-[40px] flex items-center justify-center relative">
                {/* Ícono de Lucide (siempre visible) */}
                <div className={`relative z-10 transition-all duration-300 ease-out ${
                  activeItem === item.id ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {item.icon}
                </div>

                {/* Avatar de boring-avatars (solo en hover) */}
                <AnimatePresence>
                  {activeItem !== item.id && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <motion.div
                        animate={{
                          filter: [
                            'hue-rotate(0deg) brightness(1)',
                            'hue-rotate(5deg) brightness(1.05)',
                            'hue-rotate(0deg) brightness(1)',
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Avatar
                          size={36}
                          name={item.name}
                          variant="marble"
                          colors={['#FCBBDA', '#1D24FC', '#FCBBDA']}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className={`font-medium transition-all duration-300 ease-out ${
                isExpanded
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-2 pointer-events-none'
              } ${
                activeItem === item.id
                  ? 'font-semibold text-transparent bg-gradient-to-r from-[#1D24FC] to-[#FCBBDA] bg-clip-text'
                  : 'group-hover:font-medium'
              }`}>
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}