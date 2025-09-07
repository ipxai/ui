
// src/app/layout.tsx
import './globals.css';
import { Public_Sans } from 'next/font/google';

const publicSans = Public_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'IPX',
  description: 'Next.js App con Tailwind',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={publicSans.className}>{children}</body>
    </html>
  );
}