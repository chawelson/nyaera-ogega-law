import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { CTA } from '@/components/cta';
import { insights, siteUrl } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Legal Insights — Property, Commercial & Kenyan Law Updates',
  description:
    'Practical legal articles on Kenyan property law, conveyancing, commercial transactions and business compliance. Published by Nyaera Ogega & Co. Advocates, Nairobi.',
  alternates: { canonical: `${siteUrl}/insights` },
  openGraph: {
    title: 'Legal Insights | Nyaera Ogega & Co. Advocates',
    description:
      'Practical legal articles on Kenyan property law, conveyancing, commercial transactions and business compliance.',
    url: `${siteUrl}/insights`,
    images: [{ url: '/images/Conveyancing_Real_Estate.jpeg', width: 1200, height: 630, alt: 'Legal Insights — Nyaera Ogega & Co.' }],
  },
};

export default function InsightsPage() {
  return (
    <>
      <PageHero 
        title="Legal Insights" 
        subtitle="Practical legal updates for developers, businesses, investors and property owners." 
        backgroundImage="/images/Nairobi_skyline_view.jpeg" 
        breadcrumb="Insights" 
      />
      <section className="bg-white py-24">
        <div className="site-container grid gap-7 md:grid-cols-3">
          {insights.map((post) => <article key={post.title} className="card-lift overflow-hidden rounded border border-slate-200 bg-white"><Image src={post.image} alt={post.title} width={520} height={320} className="h-56 w-full object-cover" /><div className="p-7"><p className="text-xs font-black uppercase tracking-[.18em] text-[#ab812b]">{post.category}</p><h2 className="mt-3 font-display text-3xl font-bold text-[#2e3192]">{post.title}</h2><p className="mt-4 leading-7 text-slate-600">{post.excerpt}</p></div></article>)}
        </div>
      </section>
      <CTA />
    </>
  );
}
