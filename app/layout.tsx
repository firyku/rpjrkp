import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Rumah Aplikasi | Solusi Digital Terpadu',
  description: 'Temukan, Beli, atau Sewa Aplikasi untuk Kebutuhan Bisnis Anda.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-gray-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
