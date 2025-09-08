
// src/app/layout.tsx
// src/app/layout.tsx
import './globals.css';
import { Public_Sans } from 'next/font/google';
import { GoogleOAuthProvider } from "@react-oauth/google";

const publicSans = Public_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'IPX',
  description: 'Next.js App con Tailwind',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={publicSans.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
