import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { CTA } from '@/components/cta';
import { caseResults, images } from '@/lib/site-data';

export default function CaseResultsPage() {
  return (
    <>
      <PageHero 
        title="Case Results" 
        subtitle="A results-driven approach to complex legal matters, disputes and transactions." 
        backgroundImage="/images/court-of-appeal.jpeg" 
        breadcrumb="Case Results" 
      />
      <section className="bg-[#f6f7ff] py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <Image src={images.casesight} alt="Legal documentation" width={720} height={640} className="rounded object-cover shadow-2xl shadow-slate-200" />
          <div className="grid gap-5">
            {caseResults.map((item) => <article key={item.title} className="gold-rule rounded border border-slate-200 bg-white p-8 pl-10 shadow-sm"><p className="text-sm font-black uppercase tracking-[.2em] text-[#ab812b]">{item.metric}</p><h2 className="mt-2 font-display text-3xl font-bold text-[#2e3192]">{item.title}</h2><p className="mt-4 leading-7 text-slate-600">{item.body}</p></article>)}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
