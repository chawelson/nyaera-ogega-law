import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Quote, Star } from 'lucide-react';
import { CTA } from '@/components/cta';
import { images, insights, practiceAreas, process, stats, testimonials, values, whyUs, siteUrl } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Nyaera Ogega & Co. Advocates | Legal Advisors in Nairobi, Kenya',
  description:
    'Trusted advocates in Nairobi specialising in real estate, conveyancing, commercial law, civil litigation, employment and family law. Book a consultation today.',
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Nyaera Ogega & Co. Advocates | Legal Advisors in Nairobi, Kenya',
    description:
      'Trusted advocates in Nairobi specialising in real estate, conveyancing, commercial law, civil litigation, employment and family law.',
    url: siteUrl,
    images: [{ url: '/images/Main-HomeBanner-Herrolegal_office.jpeg', width: 1200, height: 630, alt: 'Nyaera Ogega & Co. Advocates' }],
  },
};

export default function HomePage() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative isolate overflow-hidden bg-[#090d3f] text-white">
        <Image src={images.hero} alt="Premium legal office" fill priority className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#05072c] via-[#2e3192]/85 to-[#000]/35" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-25" />

        <div className="site-container grid min-h-[620px] items-center gap-10 py-16 md:min-h-[720px] md:py-20 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-6 inline-flex rounded border border-[#ab812b]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur">
              Real Estate • Conveyancing • Commercial Law
            </div>
            <h1 className="text-balance text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl xl:text-7xl">
              Trusted legal advisors for property, business & growth.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
              Strategic legal solutions for developers, investors, businesses and property owners across Kenya, delivered with precision, integrity and commercial clarity.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded bg-[#ab812b] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2e3192]"
              >
                Book Consultation <ArrowRight className="ml-2 inline" size={16} />
              </Link>
              <Link
                href="/practice-areas"
                className="rounded border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-[#ab812b] hover:text-[#f0c675]"
              >
                View Practice Areas
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative rounded border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <Image
                src={images.office}
                alt="Modern legal chamber"
                width={720}
                height={520}
                className="h-[430px] w-full rounded object-cover"
              />
              <div className="absolute -bottom-8 -left-8 max-w-sm rounded bg-white p-6 text-[#111827] shadow-2xl">
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#ab812b]">Nyaera Ogega & Co. Advocates</p>
                <p className="mt-3 font-display text-2xl font-bold text-[#2e3192]">
                  Advocates | Commissioners for Oaths | Legal Consultants
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS BAR ===================== */}
      <section className="bg-[#2e3192] text-white">
        <div className="site-container grid grid-cols-2 divide-x divide-white/10 py-1 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center px-6 py-8 text-center">
              <span className="font-display text-4xl font-black text-[#f0c675] md:text-5xl">
                {stat.value}<span className="text-2xl">{stat.suffix}</span>
              </span>
              <span className="mt-2 text-xs font-bold uppercase tracking-widest text-white/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== ABOUT ===================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <Image
              src={images.aboutno}
              alt="Legal document signing"
              width={720}
              height={520}
              className="rounded object-cover shadow-2xl shadow-slate-200"
            />
            <div className="absolute -bottom-5 right-4 rounded bg-[#2e3192] p-6 text-white shadow-xl">
              <p className="text-4xl font-black">Kenya&apos;s</p>
              <p className="text-sm text-white/75">trusted legal counsel</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">About the firm</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#2e3192] sm:text-4xl md:text-5xl">
              Modern legal service with commercial focus.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              At Nyaera Ogega & Co. Advocates, we provide trusted legal counsel tailored to individuals, businesses and property investors. Our core practice is Real Estate and Conveyancing, complemented by expertise in litigation, employment law, commercial transactions and legal advisory services. We are driven by a commitment to protecting our clients&apos; interests through strategic and dependable legal representation.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {values.map((item) => (
                <div key={item.title} className="card-lift rounded border border-slate-200 bg-white p-5">
                  <item.icon className="mb-3 text-[#ab812b]" size={22} />
                  <p className="font-bold text-[#111827]">{item.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#2e3192] hover:text-[#ab812b] transition-colors"
              >
                Meet Our Team <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRACTICE AREAS ===================== */}
      <section className="bg-[#f6f7ff] py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Practice areas</p>
            <h2 className="mt-3 text-3xl font-bold text-[#2e3192] sm:text-4xl md:text-5xl">
              Legal precision. Architectural strategy.
            </h2>
            <p className="mt-4 text-slate-600">
              Focused legal support for individuals, businesses, institutions and property-sector clients.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area) => (
              <Link
                href="/practice-areas"
                key={area.slug}
                className="card-lift group overflow-hidden rounded border border-slate-200 bg-white"
              >
                <div className="img-zoom overflow-hidden">
                  <Image
                    src={area.image}
                    alt={area.title}
                    width={520}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <area.icon className="mb-4 text-[#ab812b]" size={24} />
                  <h3 className="font-display text-xl font-bold text-[#2e3192]">{area.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{area.summary}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#ab812b] transition-all group-hover:gap-2">
                    Learn more <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/practice-areas"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e3192] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#2e3192] transition-all hover:bg-[#2e3192] hover:text-white"
            >
              View All Practice Areas <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== HOW WE WORK ===================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Our process</p>
            <h2 className="mt-3 text-3xl font-bold text-[#2e3192] sm:text-4xl md:text-5xl">How we work with clients.</h2>
            <p className="mt-4 text-slate-600">Clear steps. No surprises. Your matter handled with expertise from start to finish.</p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <div key={step.step} className="relative">
                {i < process.length - 1 && (
                  <div className="absolute top-10 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] border-t-2 border-dashed border-[#2e3192]/15 lg:block" />
                )}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f6f7ff] border border-[#2e3192]/10 shadow-sm">
                    <step.icon className="text-[#2e3192]" size={32} />
                  </div>
                  <div className="mt-5">
                    <span className="text-xs font-black uppercase tracking-[.2em] text-[#ab812b]">Step {step.step}</span>
                    <h3 className="mt-2 text-lg font-bold text-[#111827]">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHO WE SERVE ===================== */}
      <section className="relative isolate overflow-hidden bg-[#0b1026] py-16 text-white md:py-24">
        <Image src={images.skyline} alt="Nairobi skyline" fill className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2e3192]/95 to-[#000]/70" />
        <div className="site-container grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#f0c675]">Who we serve</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
              Built for clients making important decisions.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/75">
              From individual homebuyers to large developers, we provide legal support scaled to your needs and delivered with the same commitment to excellence.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded bg-[#ab812b] px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#2e3192]"
            >
              Get in Touch <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Real estate developers',
              'Property investors',
              'Businesses & corporations',
              'Financial institutions',
              'Individual property owners',
              'Contractors & consultants',
              'Families & individuals',
              'NGOs & organisations',
            ].map((client) => (
              <div key={client} className="rounded border border-white/15 bg-white/10 p-4 font-bold backdrop-blur">
                <CheckCircle2 className="mr-2 inline text-[#f0c675]" size={18} />
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section className="bg-[#f6f7ff] py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Why choose us</p>
            <h2 className="mt-3 text-3xl font-bold text-[#2e3192] sm:text-4xl md:text-5xl">
              What sets Nyaera Ogega & Co. apart.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:border-[#ab812b]/30 hover:-translate-y-1"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2e3192] text-white">
                  <item.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Client feedback</p>
            <h2 className="mt-3 text-3xl font-bold text-[#2e3192] sm:text-4xl md:text-5xl">
              What our clients say.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="gold-rule relative rounded-xl border border-slate-200 bg-white p-8 pl-10 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <Quote className="mb-4 text-[#ab812b]/40" size={36} />
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-[#ab812b] text-[#ab812b]" />
                  ))}
                </div>
                <p className="text-sm leading-7 text-slate-600 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="font-bold text-[#111827]">{t.author}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#ab812b]">{t.area}</p>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== LEGAL INSIGHTS ===================== */}
      <section className="bg-[#f6f7ff] py-16 md:py-24">
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Legal insights</p>
              <h2 className="mt-3 text-3xl font-bold text-[#2e3192] sm:text-4xl">Updates that help clients act wisely.</h2>
            </div>
            <Link href="/insights" className="font-bold text-[#2e3192] hover:text-[#ab812b] transition-colors">
              View all insights →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {insights.map((post) => (
              <Link
                href="/insights"
                key={post.title}
                className="card-lift group overflow-hidden rounded border border-slate-200 bg-white"
              >
                <div className="img-zoom overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={520}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[.16em] text-[#ab812b]">{post.category}</p>
                  <h3 className="mt-3 font-display text-xl font-bold text-[#2e3192]">{post.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#ab812b] transition-all group-hover:gap-2">
                    Read more <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
