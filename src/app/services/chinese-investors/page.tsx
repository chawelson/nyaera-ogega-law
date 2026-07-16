'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, type Variants } from 'framer-motion';
import {
  Building2,
  Briefcase,
  FileText,
  Users,
  Globe,
  Home,
  Landmark,
  Gavel,
  ShieldCheck,
  Lightbulb,
  MessageSquare,
  Award,
  ChevronRight,
  Star,
} from 'lucide-react';

// ─── Service Data ───────────────────────────────────────────────────────────

const services = [
  {
    title: 'Company Registration',
    chinese: '\u516c\u53f8\u6ce8\u518c',
    icon: Building2,
    description:
      'Full-service company incorporation in Kenya \u2014 from name reservation and document preparation to certificate issuance and post-registration compliance.',
  },
  {
    title: 'Foreign Investment Advisory',
    chinese: '\u5916\u56fd\u6295\u8d44\u54a8\u8be2',
    icon: Globe,
    description:
      'Strategic guidance on Kenya\u2019s foreign investment regulations, sector-specific incentives, joint ventures, and market entry structures for Chinese enterprises.',
  },
  {
    title: 'Commercial Contracts',
    chinese: '\u5546\u4e1a\u5408\u540c',
    icon: FileText,
    description:
      'Drafting, review, and negotiation of cross-border commercial agreements \u2014 including distribution, supply, agency, and joint venture contracts.',
  },
  {
    title: 'Employment Law',
    chinese: '\u52b3\u52a8\u6cd5',
    icon: Users,
    description:
      'Comprehensive employment law support \u2014 compliant contracts, HR policies, disciplinary procedures, and representation before the Employment and Labour Relations Court.',
  },
  {
    title: 'Immigration & Work Permits',
    chinese: '\u79fb\u6c11\u4e0e\u5de5\u4f5c\u8bb8\u53ef',
    icon: Briefcase,
    description:
      'Work permit applications, special passes, dependent passes, and immigration compliance for Chinese executives, managers, and technical staff relocating to Kenya.',
  },
  {
    title: 'Real Estate Acquisition',
    chinese: '\u623f\u5730\u4ea7\u6536\u8d2d',
    icon: Home,
    description:
      'End-to-end legal support for property acquisition \u2014 due diligence, sale agreements, title transfers, lease negotiations, and development approvals.',
  },
  {
    title: 'Debt Recovery',
    chinese: '\u503a\u52a1\u8ffd\u8ba8',
    icon: Landmark,
    description:
      'Aggressive yet strategic debt recovery services \u2014 demand letters, statutory notices, court proceedings, and enforcement of judgments.',
  },
  {
    title: 'Litigation & Dispute Resolution',
    chinese: '\u8bc9\u8bbc\u4e0e\u4e89\u8bae\u89e3\u51b3',
    icon: Gavel,
    description:
      'Representation in Kenyan courts and tribunals for commercial disputes, contractual breaches, and cross-border legal conflicts \u2014 plus arbitration and mediation.',
  },
  {
    title: 'Tax & Regulatory Compliance',
    chinese: '\u7a0e\u52a1\u4e0e\u6cd5\u89c4\u5408\u89c4',
    icon: ShieldCheck,
    description:
      'Tax registration, filing compliance, transfer pricing advisory, and regulatory licensing to ensure your business operates within Kenya\u2019s legal framework.',
  },
  {
    title: 'Intellectual Property Protection',
    chinese: '\u77e5\u8bc6\u4ea7\u6743\u4fdd\u62a4',
    icon: Lightbulb,
    description:
      'Trademark registration, patent filings, copyright protection, and IP enforcement to safeguard your brand and innovations in the Kenyan market.',
  },
];

// ─── Why Choose Us Data ─────────────────────────────────────────────────────

const whyChooseUs = [
  {
    title: 'Bilingual Legal Team',
    chinese: '\u53cc\u8bed\u6cd5\u5f8b\u56e2\u961f',
    icon: MessageSquare,
    description:
      'Our team communicates fluently in English and Mandarin, ensuring clear, accurate legal advice with no language barriers.',
  },
  {
    title: 'Deep Understanding of Chinese Business Culture',
    chinese: '\u6df1\u5165\u4e86\u89e3\u4e2d\u56fd\u5546\u4e1a\u6587\u5316',
    icon: Award,
    description:
      'We understand how Chinese enterprises operate \u2014 from decision-making structures to negotiation styles \u2014 and tailor our approach accordingly.',
  },
  {
    title: 'Kenyan Law Expertise',
    chinese: '\u80af\u5c3c\u4e9a\u6cd5\u5f8b\u4e13\u4e1a\u77e5\u8bc6',
    icon: Gavel,
    description:
      'Deep knowledge of Kenyan statutory and case law across corporate, property, employment, and dispute resolution practice areas.',
  },
  {
    title: 'Proven Track Record',
    chinese: '\u53ef\u9760\u7684\u4e1a\u7ee9\u8bb0\u5f55',
    icon: Star,
    description:
      'We have successfully guided numerous Chinese-funded projects and businesses through Kenya\u2019s legal and regulatory landscape.',
  },
];

// ─── Animation Variants ─────────────────────────────────────────────────────

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// ─── Reusable Section Wrapper ───────────────────────────────────────────────

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );
}

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, delay, ease: easeOut },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ChineseInvestorsPage() {
  return (
    <>
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#090d3f] via-[#2e3192] to-[#090d3f] py-20 md:py-32">
        {/* Decorative gold accent lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ab812b] to-transparent opacity-40" />
          <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-[#ab812b]/20 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ab812b] to-transparent opacity-40" />
          <div className="absolute right-8 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-[#ab812b]/20 to-transparent" />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="site-container relative z-10">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              {/* Gold accent line above title */}
              <div className="mb-6 h-1 w-16 rounded-full bg-[#ab812b]" />

              <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                Legal Services for Chinese Investors and Businesses in Kenya
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base md:mt-6 md:text-lg">
                \u4e3a\u4e2d\u56fd\u6295\u8d44\u8005\u548c\u4f01\u4e1a\u63d0\u4f9b\u4e13\u4e1a\u7684\u80af\u5c3c\u4e9a\u6cd5\u5f8b\u670d\u52a1
              </p>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                Expert legal guidance for Chinese enterprises expanding into Kenya \u2014 from company
                registration to dispute resolution. Our bilingual team bridges the gap between
                Chinese business culture and Kenyan legal requirements.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded bg-[#ab812b] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ab812b]/25 transition-all hover:bg-white hover:text-[#090d3f]"
                >
                  Get Started
                  <ChevronRight size={16} />
                </Link>
                <Link
                  href="#services"
                  className="inline-flex items-center gap-2 rounded border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition-all hover:border-[#ab812b] hover:text-[#ab812b]"
                >
                  View Services
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-black/30">
                <Image
                  src="/images/chinese-investors-hero.jpg"
                  alt="Chinese Investors and Businesses in Kenya \u2014 Legal Services"
                  width={640}
                  height={480}
                  className="h-auto w-full object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090d3f]/60 via-transparent to-transparent" />
              </div>
              {/* Gold accent border */}
              <div className="pointer-events-none absolute -bottom-3 -right-3 h-full w-full rounded-xl border-2 border-[#ab812b]/30" />
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── SERVICES GRID ────────────────────────────────────────────── */}
      <Section id="services" className="bg-[#f6f7ff]">
        <div className="site-container">
          <AnimatedSection>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-[.22em] text-[#ab812b]">
                Our Services
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-[#090d3f] sm:text-4xl">
                Comprehensive Legal Support
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Tailored legal services designed specifically for Chinese enterprises navigating
                Kenya's business and regulatory environment.
              </p>
            </div>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                custom={i}
                className="group card-lift rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#ab812b]/40 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f6f7ff] text-[#2e3192] transition-colors group-hover:bg-[#2e3192] group-hover:text-white">
                  <service.icon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#090d3f]">{service.title}</h3>
                <p className="mt-1 text-sm font-medium text-[#ab812b]">{service.chinese}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ─── WHY CHOOSE US ────────────────────────────────────────────── */}
      <Section className="bg-white">
        <div className="site-container">
          <AnimatedSection>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-[.22em] text-[#ab812b]">
                Why Choose Us
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-[#090d3f] sm:text-4xl">
                Trusted by Chinese Enterprises
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                We combine Kenyan legal expertise with a deep appreciation for Chinese business
                culture \u2014 delivering advice that is both legally sound and commercially practical.
              </p>
            </div>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-8 sm:grid-cols-2"
          >
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                className="gold-rule flex gap-5 rounded-xl bg-[#f6f7ff] p-6 pl-8"
              >
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2e3192] text-white">
                  <item.icon size={22} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#090d3f]">{item.title}</h3>
                  <p className="mt-0.5 text-sm font-medium text-[#ab812b]">{item.chinese}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ─── TESTIMONIAL ──────────────────────────────────────────────── */}
      <Section className="bg-[#090d3f]">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="site-container relative z-10">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-[#ab812b] text-[#ab812b]" />
              ))}
            </div>
            <blockquote className="font-display text-xl leading-relaxed text-white/90 sm:text-2xl md:text-3xl">
              &ldquo;Nyaera Ogega & Co. provided exceptional legal support for our company's
              entry into the Kenyan market. Their bilingual team made the entire process seamless,
              and their understanding of both Chinese and Kenyan business practices was invaluable.&rdquo;
            </blockquote>
            <div className="mt-8">
              <p className="text-sm font-bold text-[#ab812b]">\u2014 Chinese Enterprise Client</p>
              <p className="mt-1 text-xs text-white/50">Nairobi, Kenya</p>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* ─── CTA SECTION ──────────────────────────────────────────────── */}
      <Section className="bg-[#f6f7ff]">
        <div className="site-container">
          <AnimatedSection className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#090d3f] via-[#2e3192] to-[#090d3f] p-8 shadow-2xl shadow-[#2e3192]/20 sm:p-12 md:p-16">
            {/* Decorative gold lines */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ab812b]/40 to-transparent" />
              <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#ab812b]/40 to-transparent" />
            </div>

            <div className="relative z-10 text-center">
              <span className="text-xs font-black uppercase tracking-[.22em] text-[#f0c675]">
                Get Started Today
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Ready to Expand into Kenya?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                Let our bilingual legal team guide you through every step of establishing and growing
                your business in Kenya. Schedule a confidential consultation today.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded bg-[#ab812b] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#ab812b]/25 transition-all hover:bg-white hover:text-[#090d3f]"
                >
                  Book a Consultation
                  <ChevronRight size={16} />
                </Link>
                <Link
                  href="tel:+254791646341"
                  className="inline-flex items-center gap-2 rounded border border-white/25 px-8 py-4 text-sm font-bold text-white transition-all hover:border-[#ab812b] hover:text-[#ab812b]"
                >
                  Call +254 791 646 341
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </Section>
    </>
  );
}
