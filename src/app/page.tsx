// src/app/page.tsx
import AppShell from '@/components/layout/AppShell';
import Content from '@/components/ui/content/Content';

export default function HomePage() {
  return (
    <AppShell>
      <Content isExpanded={false} />
    </AppShell>
  );
}
