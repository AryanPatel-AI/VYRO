import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'VYRO — AI Social & Brand OS',
  description:
    'An AI-powered social media and brand-deal operating system. Turn your content into platform-specific posts, identify growth opportunities, and track brand deals from first contact to completion.',
  keywords: ['social media management', 'sponsorship management', 'creator tools', 'AI content'],
  openGraph: {
    title: 'VYRO — AI Social & Brand OS',
    description: 'The AI-powered operating system for creators and their brand deals.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
