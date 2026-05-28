import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone, Clock, MapPinned, MessageCircle } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { contact, siteUrl } from '@/lib/site-data';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — Book a Legal Consultation',
  description:
    'Get in touch with our legal team at Shelter Afrique Building, Mamlaka Road, Nairobi. Call, email or WhatsApp — we respond within 24 hours.',
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: 'Contact Us | Nyaera Ogega & Co. Advocates',
    description:
      'Get in touch with our legal team in Nairobi. Call, email or WhatsApp — we respond within 24 hours.',
    url: `${siteUrl}/contact`,
    images: [{ url: '/images/Main-HomeBanner-Herrolegal_office.jpeg', width: 1200, height: 630, alt: 'Contact Nyaera Ogega & Co.' }],
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Connect with Our Legal Experts"
        subtitle="Reach out to our Nairobi office for professional legal consultation and support."
        backgroundImage="/images/Main-HomeBanner-Herrolegal_office.jpeg"
        breadcrumb="Contact"
      />

      {/* Main Contact Section */}
      <section className="bg-[#f6f7ff] pb-24">
        <div className="site-container relative z-10 -mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">

          {/* Left Column: Contact Cards */}
          <div className="space-y-6">
            {/* Card 1: Our Office */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2e3192] text-white transition-transform group-hover:scale-110">
                <MapPinned size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2e3192]">Our Office</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{contact.address}</p>
              <a
                href="https://maps.google.com/?q=Shelter+Afrique+Building+Mamlaka+Road+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-bold uppercase tracking-wider text-[#ab812b] hover:text-[#2e3192]"
              >
                View on Google Maps →
              </a>
            </div>

            {/* Card 2: Direct Contact */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#ab812b] text-white transition-transform group-hover:scale-110">
                <Phone size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2e3192]">Direct Contact</h3>
              <div className="mt-4 space-y-3">
                <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-[#ab812b] transition-colors">
                  <Phone size={16} className="text-[#ab812b]" />
                  {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-slate-600 hover:text-[#ab812b] transition-colors">
                  <Mail size={16} className="text-[#ab812b]" />
                  {contact.email}
                </a>
              </div>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#ab812b] hover:text-[#2e3192]"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp →
              </a>
            </div>

            {/* Card 3: Working Hours */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2e3192] text-white transition-transform group-hover:scale-110">
                <Clock size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2e3192]">Working Hours</h3>
              <div className="mt-4 space-y-2 text-slate-600">
                <p className="flex justify-between">
                  <span>Mon — Fri:</span>
                  <span className="font-semibold text-slate-900">8:00 AM – 5:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-semibold text-slate-900">9:00 AM – 1:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold text-[#ab812b]">Closed</span>
                </p>
              </div>
              <div className="mt-6 rounded-lg bg-[#f6f7ff] px-4 py-3 text-sm text-slate-600">
                Urgent matters? WhatsApp us and we'll respond as soon as possible.
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form (Client Component) */}
          <ContactForm />
        </div>
      </section>

      {/* Map / Office Visual Section */}
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden bg-[#090d3f]">
        <Image
          src="/images/Nairobi_skyline_view.jpeg"
          alt="Nairobi Office Location"
          fill
          className="object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md border border-white/20 max-w-sm">
            <div className="mb-4 flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-[#ab812b] text-white shadow-lg mx-auto">
              <MapPin size={24} />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Nyaera Ogega & Co.</h2>
            <p className="mt-2 text-white/70">Shelter Afrique Building, Mamlaka Road</p>
            <p className="text-white/70">3rd Floor, Room 4, Nairobi</p>
            <a
              href="https://maps.google.com/?q=Shelter+Afrique+Building+Mamlaka+Road+Nairobi"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-lg bg-[#ab812b] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#2e3192]"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-white py-20 md:py-32">
        <div className="site-container max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold text-[#2e3192] md:text-5xl">
            Experience Elite Legal Representation
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Our advocates are ready to assist you with precision and unwavering dedication to justice.
            Contact us to schedule a strategic meeting today.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-full bg-[#2e3192] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[#ab812b] hover:shadow-xl"
            >
              WhatsApp Us Now
            </Link>
            <Link
              href="/practice-areas"
              className="w-full sm:w-auto rounded-full border-2 border-[#ab812b] px-10 py-4 text-sm font-bold uppercase tracking-widest text-[#ab812b] transition-all hover:bg-[#ab812b] hover:text-white"
            >
              View Practice Areas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
