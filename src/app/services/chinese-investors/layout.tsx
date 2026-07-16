import type { Metadata } from 'next';
import { Noto_Sans_SC } from 'next/font/google';
import { siteUrl } from '@/lib/site-data';

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Legal Services for Chinese Investors in Kenya | Nyaera Ogega & Co. Advocates',
  description:
    'Expert legal services for Chinese businesses and investors in Kenya. Company registration, immigration, commercial contracts, and dispute resolution.',
  keywords: [
    'Chinese investors Kenya',
    'foreign investment Kenya',
    'company registration Kenya',
    'work permits Kenya',
    'legal services Chinese businesses',
  ],
  alternates: { canonical: `${siteUrl}/services/chinese-investors` },
  openGraph: {
    title: 'Legal Services for Chinese Investors in Kenya | Nyaera Ogega & Co. Advocates',
    description:
      'Expert legal services for Chinese businesses and investors in Kenya. Company registration, immigration, commercial contracts, and dispute resolution.',
    url: `${siteUrl}/services/chinese-investors`,
    images: [
      {
        url: '/images/chinese-investors-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Legal Services for Chinese Investors and Businesses in Kenya',
      },
    ],
  },
  other: {
    'google-fonts': 'Noto+Sans+SC:wght@300;400;700',
  },
};

export default function ChineseInvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={notoSansSC.variable}>
      {/* Google Fonts preconnect and stylesheet for Noto Sans SC */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
