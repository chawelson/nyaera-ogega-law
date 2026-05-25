import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { CTA } from '@/components/cta';
import { images, insights } from '@/lib/site-data';

export default function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="Insights" title="Legal updates for confident property and business decisions." text="Practical articles designed for developers, investors, property buyers, businesses and institutional clients." image={images.skyline} />
      <section className="bg-white py-24">
        <div className="site-container grid gap-7 md:grid-cols-3">
          {insights.map((post) => <article key={post.title} className="card-lift overflow-hidden rounded border border-slate-200 bg-white"><Image src={post.image} alt={post.title} width={520} height={320} className="h-56 w-full object-cover" /><div className="p-7"><p className="text-xs font-black uppercase tracking-[.18em] text-[#ab812b]">{post.category}</p><h2 className="mt-3 font-display text-3xl font-bold text-[#2e3192]">{post.title}</h2><p className="mt-4 leading-7 text-slate-600">{post.excerpt}</p></div></article>)}
        </div>
      </section>
      <CTA />
    </>
  );
}
