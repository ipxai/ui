'use client';
import ContentAR from '@/components/ui/content/content-ar';

interface AnalisisRegistrabilidadProps {
  isExpanded: boolean;
}

export default function AnalisisRegistrabilidad({ isExpanded }: AnalisisRegistrabilidadProps) {
  return (
    <ContentAR isExpanded={isExpanded}>
      {/* Completamente vacío, listo para contenido personalizado */}
    </ContentAR>
  );
}