import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#fff8ec',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'pinit.lol: Put your product on the map',
  description:
    'Discover what people are building around the world. Pin your product and stake to compete for the top spot in any country.',
  keywords: [
    'pinit',
    'pinit.lol',
    'product map',
    'indie hackers',
    'startup directory',
    'pay to rank',
    'ai tools map',
    'interactive globe',
  ],
  authors: [{ name: 'pinit' }],
  metadataBase: new URL('https://pinit.lol'),
  openGraph: {
    title: 'pinit.lol: Put your product on the map',
    description:
      'Discover what people are building around the world. Pin your product and stake to compete for the top spot in any country.',
    url: 'https://pinit.lol',
    siteName: 'pinit.lol',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pinit.lol: Put your product on the map',
    description:
      'Discover what people are building around the world. Pin your product and stake to compete for the top spot in any country.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full font-sans antialiased bg-[#fff8ec] text-[#1a1614] overflow-x-hidden selection:bg-[#FF5722]/20 selection:text-[#FF5722]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
