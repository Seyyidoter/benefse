import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header, Footer, MobileNav } from '@/components/layout';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from '@/components/providers/session-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'Benefse - Ev Dekorasyon & Mobilya | Trendyol Mağazası',
    template: '%s | Benefse',
  },
  description: 'Mutfak rafları, runner masa örtüleri, dekoratif lambalar ve ev aksesuarları. Trendyol\'da güvenle satış yapan Benefse mağazasının resmi web sitesi.',
  keywords: ['ev dekorasyon', 'mutfak rafı', 'runner', 'masa örtüsü', 'lamba', 'ev aksesuarları', 'trendyol', 'benefse', 'guhef'],
  authors: [{ name: 'Benefse' }],
  creator: 'Benefse',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://benefse.vercel.app',
    siteName: 'Benefse',
    title: 'Benefse - Ev Dekorasyon & Mobilya',
    description: 'Mutfak rafları, runner masa örtüleri, dekoratif lambalar ve ev aksesuarları. Evinize şıklık katın!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Benefse - Ev Dekorasyon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benefse - Ev Dekorasyon & Mobilya',
    description: 'Mutfak rafları, runner masa örtüleri, dekoratif lambalar ve ev aksesuarları.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
          <Toaster richColors position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
}

