// src/app/analisisderegistrabilidad/page.tsx
import AppShell from '@/components/layout/AppShell';
import AnalisisRegistrabilidad from '@/components/pages/analisisderegistrabilidad';

export default function AnalisisPage() {
  return (
    <AppShell>
      <AnalisisRegistrabilidad isExpanded={false} />
    </AppShell>
  );
}