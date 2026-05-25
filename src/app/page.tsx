import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CTA } from '@/components/cta';
import { images, insights, practiceAreas, values } from '@/lib/site-data';

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#090d3f] text-white">
        <Image src={images.hero} alt="Premium legal office" fill priority className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#05072c] via-[#2e3192]/85 to-[#000]/35" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-25" />
        <div className="site-container grid min-h-[620px] items-center gap-10 py-16 md:min-h-[720px] md:py-20 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-6 inline-flex rounded border border-[#ab812b]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur">Real Estate • Conveyancing • Commercial Law</div>
            <h1 className="text-balance text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl xl:text-7xl">Trusted legal advisors for property, business & growth.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 text-white/82">Strategic legal solutions for developers, investors, businesses and property owners across Kenya, delivered with precision, integrity and commercial clarity.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/contact" className="rounded bg-[#ab812b] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2e3192]">Book Consultation <ArrowRight className="ml-2 inline" size={16} /></Link>
              <Link href="/practice-areas" className="rounded border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-[#ab812b] hover:text-[#f0c675]">View Practice Areas</Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative rounded border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <Image src={images.office} alt="Modern legal chamber" width={720} height={520} className="h-[430px] w-full rounded object-cover" />
              <div className="absolute -bottom-8 -left-8 max-w-sm rounded bg-white p-6 text-[#111827] shadow-2xl">
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#ab812b]">Nyaera Ogega & Co. Advocates</p>
                <p className="mt-3 font-display text-2xl font-bold text-[#2e3192]">Practical counsel for high-value legal decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <Image src={images.signing} alt="Legal document signing" width={720} height={520} className="rounded object-cover shadow-2xl shadow-slate-200" />
            <div className="absolute -bottom-5 right-4 rounded bg-[#2e3192] p-6 text-white shadow-xl">
              <p className="text-4xl font-black">Kenya</p>
              <p className="text-sm text-white/75">Property and commercial legal support</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">About the firm</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#2e3192] sm:text-4xl md:text-5xl">Modern legal service with commercial focus.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">Nyaera Ogega & Co. Advocates is a modern law firm committed to practical, efficient and results-driven legal solutions in conveyancing, real estate, sectional properties, commercial advisory and dispute representation.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {values.map((item) => <div key={item.title} className="card-lift rounded border border-slate-200 bg-white p-5"><item.icon className="mb-3 text-[#ab812b]" /><p className="font-bold text-[#111827]">{item.title}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7ff] py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Practice areas</p>
            <h2 className="mt-3 text-3xl font-bold text-[#2e3192] sm:text-4xl md:text-5xl">Legal precision. Architectural strategy.</h2>
            <p className="mt-4 text-slate-600">Focused legal support for individuals, businesses, institutions and property-sector clients.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area) => <Link href="/practice-areas" key={area.slug} className="card-lift overflow-hidden rounded border border-slate-200 bg-white"><Image src={area.image} alt={area.title} width={520} height={300} className="h-48 w-full object-cover" /><div className="p-6"><area.icon className="mb-4 text-[#ab812b]" /><h3 className="font-display text-2xl font-bold text-[#2e3192]">{area.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{area.summary}</p></div></Link>)}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#0b1026] py-16 text-white md:py-24">
        <Image src={images.skyline} alt="Nairobi skyline" fill className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2e3192]/95 to-[#000]/70" />
        <div className="site-container grid gap-10 md:grid-cols-2 md:items-center">
          <div><p className="text-sm font-black uppercase tracking-[.25em] text-[#f0c675]">Who we serve</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">Built for clients making important decisions.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Real estate developers', 'Investors', 'Businesses', 'Financial institutions', 'Property owners', 'Contractors', 'Families', 'Organizations'].map((client) => <div key={client} className="rounded border border-white/15 bg-white/10 p-4 font-bold backdrop-blur"><CheckCircle2 className="mr-2 inline text-[#f0c675]" size={18} />{client}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Legal insights</p><h2 className="mt-3 text-3xl font-bold text-[#2e3192] sm:text-4xl">Updates that help clients act wisely.</h2></div><Link href="/insights" className="font-bold text-[#2e3192] hover:text-[#ab812b]">View insights →</Link></div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">{insights.map((post) => <Link href="/insights" key={post.title} className="card-lift overflow-hidden rounded border border-slate-200 bg-white"><Image src={post.image} alt={post.title} width={520} height={300} className="h-48 w-full object-cover" /><div className="p-6"><p className="text-xs font-black uppercase tracking-[.16em] text-[#ab812b]">{post.category}</p><h3 className="mt-3 font-display text-2xl font-bold text-[#2e3192]">{post.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p></div></Link>)}</div>
        </div>
      </section>
      <CTA />
    </>
  );
}
