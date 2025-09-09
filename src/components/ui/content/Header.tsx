'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Login from '@/components/auth/Login';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        padding: '12px 20px',
      }}
    >
      <motion.button
        onClick={() => setShowLogin(true)}
        className={`
          flex items-center gap-2 cursor-pointer
          px-5 py-2.5 rounded-full font-medium text-white
          bg-gradient-to-r from-[#1D24FC] to-[#FCBBDA]
          shadow-md shadow-[#1D24FC]/20
          transition-all duration-300
        `}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 6px 12px rgba(29,36,252,0.35)',
        }}
        whileTap={{ scale: 0.97 }}
      >
        <LogIn size={16} />
        Get IPX
      </motion.button>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </header>
  );
}
