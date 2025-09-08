'use client';
import { motion } from 'framer-motion';
import Avatar from 'boring-avatars';

interface ColorBalloonsProps {
  name: string;
  size: number;
  isExpanded: boolean;
}

export default function ColorBalloons({ name, size }: ColorBalloonsProps) {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{
        // Animación sutil de "olas" en los colores
        background: [
          'linear-gradient(0deg, #FCBBDA 0%, #1D24FC 100%)',
          'linear-gradient(180deg, #FCBBDA 0%, #1D24FC 100%)',
          'linear-gradient(0deg, #FCBBDA 0%, #1D24FC 100%)',
        ],
      }}
      transition={{
        duration: 8, // Más lento para que sea sutil
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        borderRadius: '50%',
        padding: '2px', // Espacio para que se note el efecto
        backgroundSize: '200% 200%', // Para que el degradado sea más visible
      }}
    >
      <Avatar
        size={size}
        name={name}
        variant="marble"
        colors={['#FCBBDA', '#FCBBDA', '#1D24FC']} // Priorizando el rosa
      />
    </motion.div>
  );
}
