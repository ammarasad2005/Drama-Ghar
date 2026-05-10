import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'DramaGhar',
  description: 'Track your favorite Pakistani dramas',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

import { UserProvider } from '@/context/UserContext';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#F9FAFB] text-slate-900 suppressHydrationWarning`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
