import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { contact, images, practiceAreas } from '@/lib/site-data';

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Speak to our legal team today." text="Send an enquiry, request a consultation or contact the firm directly for urgent property, commercial or litigation support." image={images.signing} />
      <section className="bg-[#f6f7ff] py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div className="rounded bg-[#2e3192] p-8 text-white shadow-2xl shadow-[#2e3192]/20">
            <Image src={images.skyline} alt="Nairobi" width={600} height={280} className="mb-8 h-56 w-full rounded object-cover opacity-90" />
            <h2 className="font-display text-3xl font-bold">Nyaera Ogega & Co. Advocates</h2>
            <div className="mt-6 space-y-4 text-white/80">
              <p className="flex gap-3"><MapPin className="text-[#f0c675]" />{contact.address}</p>
              <p className="flex gap-3"><Mail className="text-[#f0c675]" />{contact.email}</p>
              <p className="flex gap-3"><Phone className="text-[#f0c675]" />{contact.phone}</p>
            </div>
            <a href={contact.whatsapp} className="mt-8 inline-block rounded bg-[#ab812b] px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#2e3192]">Chat on WhatsApp</a>
          </div>
          <form className="rounded border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            <div className="grid gap-5 md:grid-cols-2"><input className="rounded border border-slate-200 px-4 py-3 outline-none focus:border-[#2e3192]" placeholder="Full name" /><input className="rounded border border-slate-200 px-4 py-3 outline-none focus:border-[#2e3192]" placeholder="Email address" /></div>
            <input className="mt-5 w-full rounded border border-slate-200 px-4 py-3 outline-none focus:border-[#2e3192]" placeholder="Phone number" />
            <select className="mt-5 w-full rounded border border-slate-200 px-4 py-3 outline-none focus:border-[#2e3192]"><option>Area of interest</option>{practiceAreas.map((area) => <option key={area.slug}>{area.title}</option>)}</select>
            <textarea className="mt-5 min-h-40 w-full rounded border border-slate-200 px-4 py-3 outline-none focus:border-[#2e3192]" placeholder="How can we help?" />
            <button className="mt-5 w-full rounded bg-[#ab812b] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#2e3192]">Send Enquiry</button>
          </form>
        </div>
      </section>
    </>
  );
}
