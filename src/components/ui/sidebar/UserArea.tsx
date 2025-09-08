'use client';
import { motion } from 'framer-motion';
import ColorBalloons from '@/components/animations/color-balloons';

interface UserAreaProps {
  isExpanded: boolean;
}

export default function UserArea({ isExpanded }: UserAreaProps) {
  const UserIcon = () => (
    <motion.div
      className="w-10 h-10 flex items-center justify-center mx-auto cursor-pointer"
      whileTap={{
        rotate: 360,
        scale: 0.95,
      }}
      transition={{
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1],
      }}
    >
      <ColorBalloons name="Juan Pérez" size={40} isExpanded={isExpanded} />
    </motion.div>
  );

  return (
    <div className="mt-auto pt-4 relative">
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
        <UserIcon />
      </div>
    </div>
  );
}
