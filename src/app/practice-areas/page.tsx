import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { CTA } from '@/components/cta';
import { practiceAreas, contact } from '@/lib/site-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function PracticeAreasPage() {
  return (
    <>
      <PageHero
        title="Legal Practice Areas"
        subtitle="Strategic legal support across property, commercial, litigation, family, employment and advisory matters."
        backgroundImage="/images/Conveyancing_Real_Estate.jpeg"
        breadcrumb="Practice Areas"
      />

      {/* Practice Areas - Alternating Layout */}
      <section className="bg-white py-24">
        <div className="site-container grid gap-16">
          {practiceAreas.map((area, index) => (
            <article
              key={area.slug}
              id={area.slug}
              className="grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2"
            >
              {/* Image */}
              <div
                className={`relative min-h-[340px] img-zoom overflow-hidden ${
                  index % 2 ? 'md:order-2' : ''
                }`}
              >
                <Image src={area.image} alt={area.title} fill className="object-cover" />
                {/* Overlay badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#090d3f]/80 to-transparent p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#ab812b] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    <area.icon size={14} />
                    {area.title}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6f7ff]">
                  <area.icon className="text-[#ab812b]" size={22} />
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-[#2e3192] md:text-3xl">{area.title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{area.description}</p>

                {/* Services grid */}
                <div className="mt-6">
                  <p className="mb-3 text-xs font-black uppercase tracking-[.2em] text-[#ab812b]">Services included</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {area.services.map((service) => (
                      <div key={service} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2
                          className="mt-0.5 shrink-0 text-[#2e3192]"
                          size={15}
                        />
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Accordion */}
                {area.faqs && area.faqs.length > 0 && (
                  <div className="mt-8">
                    <p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-[#ab812b]">
                      Common questions
                    </p>
                    <Accordion type="single" collapsible className="divide-y divide-slate-100 border-t border-slate-100">
                      {area.faqs.map((faq, fi) => (
                        <AccordionItem key={fi} value={`${area.slug}-faq-${fi}`} className="border-b border-slate-100">
                          <AccordionTrigger className="py-3.5 text-left text-sm font-semibold text-[#111827] hover:no-underline hover:text-[#2e3192]">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 text-sm leading-7 text-slate-600">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Contact prompt */}
                <div className="mt-8 flex items-center gap-4">
                  <Link
                    href="/contact"
                    className="rounded-lg bg-[#2e3192] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#ab812b]"
                  >
                    Get Legal Advice
                  </Link>
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-[#ab812b] hover:text-[#2e3192] transition-colors"
                  >
                    WhatsApp us →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* General FAQ / Process Note */}
      <section className="bg-[#f6f7ff] py-16 md:py-24">
        <div className="site-container max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Getting started</p>
            <h2 className="mt-3 text-3xl font-bold text-[#2e3192] sm:text-4xl">
              Have a legal matter to discuss?
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Every matter begins with a confidential consultation. We listen first, advise second — giving you a clear picture of your options before any commitment is made.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Call or WhatsApp',
                description: 'Speak directly to our team. We respond within 24 hours and can schedule an in-person or virtual consultation.',
                cta: 'Call now',
                href: 'tel:+254791646341',
              },
              {
                title: 'Send an email',
                description: 'Send us a brief description of your matter and we will get back to you with initial guidance and next steps.',
                cta: 'Email us',
                href: 'mailto:info@nyaeraogegaadvocates.com',
              },
              {
                title: 'Visit our office',
                description: 'We are at Shelter Afrique Building, Mamlaka Road, 3rd Floor, Room 4 in Nairobi. Walk-ins welcome during working hours.',
                cta: 'Get directions',
                href: 'https://maps.google.com/?q=Shelter+Afrique+Building+Mamlaka+Road+Nairobi',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-[#111827]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-6 inline-block text-sm font-bold uppercase tracking-wider text-[#ab812b] hover:text-[#2e3192] transition-colors"
                >
                  {item.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
