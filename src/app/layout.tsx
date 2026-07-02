import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { JsonLd } from '@/components/JsonLd';
import { Providers } from '@/components/providers';
import { siteUrl } from '@/lib/site-data';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nyaera Ogega & Co. Advocates | Legal Advisors in Nairobi, Kenya',
    template: '%s | Nyaera Ogega & Co. Advocates',
  },
  description:
    'Trusted advocates in Nairobi specialising in real estate, conveyancing, commercial law, civil litigation, employment and family law. Book a consultation today.',
  keywords: [
    'advocates Nairobi',
    'lawyers Kenya',
    'conveyancing Kenya',
    'real estate lawyer Nairobi',
    'property lawyer Kenya',
    'commercial law Kenya',
    'litigation Kenya',
    'employment lawyer Nairobi',
    'family law Kenya',
    'legal services Nairobi',
    'Nyaera Ogega advocates',
  ],
  authors: [{ name: 'Nyaera Ogega & Co. Advocates', url: siteUrl }],
  creator: 'Nyaera Ogega & Co. Advocates',
  publisher: 'Nyaera Ogega & Co. Advocates',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: siteUrl,
    siteName: 'Nyaera Ogega & Co. Advocates',
    title: 'Nyaera Ogega & Co. Advocates | Legal Advisors in Nairobi, Kenya',
    description:
      'Trusted advocates in Nairobi specialising in real estate, conveyancing, commercial law, civil litigation, employment and family law. Book a consultation today.',
    images: [
      {
        url: '/images/Main-HomeBanner-Herrolegal_office.jpeg',
        width: 1200,
        height: 630,
        alt: 'Nyaera Ogega & Co. Advocates — Legal Advisors in Nairobi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyaera Ogega & Co. Advocates | Legal Advisors in Nairobi, Kenya',
    description:
      'Trusted advocates in Nairobi specialising in real estate, conveyancing, commercial law, civil litigation, employment and family law.',
    images: ['/images/Main-HomeBanner-Herrolegal_office.jpeg'],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <head>
        <JsonLd />
      </head>
      <body className={`${playfair.variable} ${jakarta.variable} antialiased`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
