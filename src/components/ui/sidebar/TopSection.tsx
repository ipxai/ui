// ===== src/components/ui/sidebar/TopSection.tsx =====
'use client';
import Image from 'next/image';

interface TopSectionProps {
  isExpanded: boolean;
}

export default function TopSection({ isExpanded }: TopSectionProps) {
  return (
    <div className="flex items-center justify-center mb-6 pt-2">
      <div className="flex items-center">
        <Image
          src="/get-ipx.svg"
          alt="Logo"
          width={isExpanded ? 40 : 32}
          height={isExpanded ? 40 : 32}
        />
      </div>
    </div>
  );
}
