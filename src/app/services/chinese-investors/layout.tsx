import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site-data';

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
};

export default function ChineseInvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
