import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'outbidking.lol — The Public Pay-to-Rank Leaderboard',
  description:
    'A public pay-to-rank leaderboard for modern AI agents, SaaS products, developer tools, and creators. $1 to join. Outbid to claim #1 rank.',
  keywords: [
    'outbid',
    'outbidking',
    'pay to rank',
    'leaderboard',
    'ai tools directory',
    'saas rankings',
    'marketing attention market',
  ],
  authors: [{ name: 'outbidking' }],
  metadataBase: new URL('https://outbidking.lol'),
  openGraph: {
    title: 'outbidking.lol — The Public Pay-to-Rank Leaderboard',
    description: 'Claim your live rank on the public board. Outbid competitors to take #1.',
    url: 'https://outbidking.lol',
    siteName: 'outbidking.lol',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'outbidking.lol — The Public Pay-to-Rank Leaderboard',
    description: 'Claim your live rank on the public board. Outbid competitors to take #1.',
  },
  icons: {
    icon: '/icon',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-white dark:bg-[#0e0d0b] text-zinc-900 dark:text-white min-h-screen selection:bg-[#ea6c52]/20 selection:text-[#ea6c52]`}
      >
        {children}
      </body>
    </html>
  );
}
