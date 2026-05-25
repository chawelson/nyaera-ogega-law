import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone, Clock, Send, MapPinned, MessageCircle } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { contact, images, practiceAreas } from '@/lib/site-data';

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
              <a href="#" className="mt-4 inline-block text-sm font-bold uppercase tracking-wider text-[#ab812b] hover:text-[#2e3192]">
                View on Google Maps
              </a>
            </div>

            {/* Card 2: Direct Contact */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#ab812b] text-white transition-transform group-hover:scale-110">
                <Phone size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2e3192]">Direct Contact</h3>
              <div className="mt-4 space-y-2">
                <a href={`tel:${contact.phone}`} className="block text-slate-600 hover:text-[#ab812b]">{contact.phone}</a>
                <a href={`mailto:${contact.email}`} className="block text-slate-600 hover:text-[#ab812b]">{contact.email}</a>
              </div>
              <a href={contact.whatsapp} className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#ab812b] hover:text-[#2e3192]">
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Card 3: Working Hours */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2e3192] text-white transition-transform group-hover:scale-110">
                <Clock size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2e3192]">Working Hours</h3>
              <div className="mt-4 space-y-1 text-slate-600">
                <p className="flex justify-between"><span>Mon — Fri:</span> <span className="font-semibold text-slate-900">8:00 AM - 5:00 PM</span></p>
                <p className="flex justify-between"><span>Saturday:</span> <span className="font-semibold text-slate-900">9:00 AM - 1:00 PM</span></p>
                <p className="flex justify-between"><span>Sunday:</span> <span className="font-semibold text-[#ab812b]">Closed</span></p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <form className="rounded-2xl bg-white p-8 shadow-2xl shadow-slate-200 md:p-12">
            <div className="mb-10">
              <h2 className="font-display text-3xl font-bold text-[#2e3192]">Inquiry Form</h2>
              <p className="mt-2 text-slate-500">Professional counsel for your legal needs. We typically respond within 24 hours.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900">Full Name</label>
                <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-[#2e3192] focus:ring-2 focus:ring-[#2e3192]/10" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900">Email Address</label>
                <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-[#2e3192] focus:ring-2 focus:ring-[#2e3192]/10" placeholder="john@example.com" />
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900">Phone Number</label>
                <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-[#2e3192] focus:ring-2 focus:ring-[#2e3192]/10" placeholder="+254 700 000 000" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900">Subject of Inquiry</label>
                <select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-[#2e3192] focus:ring-2 focus:ring-[#2e3192]/10">
                  <option>General Legal Inquiry</option>
                  {practiceAreas.map((area) => <option key={area.slug}>{area.title}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900">Message</label>
              <textarea className="min-h-40 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-[#2e3192] focus:ring-2 focus:ring-[#2e3192]/10" placeholder="Please describe your legal requirements..." />
            </div>

            <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#2e3192] px-8 py-5 text-sm font-black uppercase tracking-[.2em] text-white transition-all duration-300 hover:bg-[#ab812b] hover:shadow-xl">
              <Send size={18} />
              Send Enquiry
            </button>
          </form>
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
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md border border-white/20">
            <h2 className="font-display text-2xl font-bold text-white">Nyaera Ogega & Co.</h2>
            <p className="mt-1 text-white/70">Nairobi Headquarters</p>
            <div className="mt-6 flex flex-col items-center">
              <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-[#ab812b] text-white shadow-lg">
                <MapPin size={24} />
              </div>
              <div className="mt-2 h-2 w-2 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-white py-20 md:py-32">
        <div className="site-container max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold text-[#2e3192] md:text-5xl">Experience Elite Legal Representation</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Our advocates are ready to assist you with precision and unwavering dedication to justice. Contact us to schedule a strategic meeting today.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              href="/contact" 
              className="w-full sm:w-auto rounded-full bg-[#2e3192] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[#ab812b] hover:shadow-xl"
            >
              Schedule Meeting
            </Link>
            <Link 
              href="#" 
              className="w-full sm:w-auto rounded-full border-2 border-[#ab812b] px-10 py-4 text-sm font-bold uppercase tracking-widest text-[#ab812b] transition-all hover:bg-[#ab812b] hover:text-white"
            >
              Download Brochure
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
