import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { contact, navLinks, practiceAreas } from '@/lib/site-data';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#090d3f] to-[#11175a] text-white border-t border-white/5">
      <div className="site-container grid gap-12 py-16 lg:py-15 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr]">
        
        {/* Column 1: Brand Identity */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Image 
              src="/logos/Nyaera-Ogega-New-Logo-light.png" 
              alt="Nyaera Ogega & Co. Advocates" 
              width={150} 
              height={60} 
              className="h-8 w-auto object-contain" 
            />
          </Link>
        </div>

        {/* Column 2: Navigation */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="mb-7 text-[11px] font-black uppercase tracking-[.3em] text-[#ab812b]">Pages</h3>
          <div className="flex flex-col items-center lg:items-start gap-4 text-sm text-white/70">
            {navLinks.map((l) => (
              <Link 
                key={l.href} 
                href={l.href}
                className="transition-all duration-300 hover:text-[#ab812b] hover:translate-x-1 inline-block"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Legal Services */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="mb-7 text-[11px] font-black uppercase tracking-[.3em] text-[#ab812b]">Practice Areas</h3>
          <div className="flex flex-col items-center lg:items-start gap-4 text-sm text-white/70">
            {practiceAreas.slice(0, 5).map((p) => (
              <Link 
                key={p.slug} 
                href="/practice-areas"
                className="transition-all duration-300 hover:text-[#ab812b] hover:translate-x-1 inline-block"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 4: Contact Information */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="mb-7 text-[11px] font-black uppercase tracking-[.3em] text-[#ab812b]">Contact</h3>
          <div className="flex flex-col items-center lg:items-start space-y-6 text-sm text-white/70">
            <div className="flex items-start gap-4 group justify-center lg:justify-start">
              <MapPin className="mt-1 shrink-0 text-[#ab812b] group-hover:scale-110 transition-transform" size={18} />
              <span className="text-center lg:text-left leading-relaxed">{contact.address}</span>
            </div>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-4 group transition-colors hover:text-[#ab812b] justify-center lg:justify-start">
              <Mail className="shrink-0 text-[#ab812b] group-hover:scale-110 transition-transform" size={18} />
              <span>{contact.email}</span>
            </a>
            <a href={`tel:${contact.phone}`} className="flex items-center gap-4 group transition-colors hover:text-[#ab812b] justify-center lg:justify-start">
              <Phone className="shrink-0 text-[#ab812b] group-hover:scale-110 transition-transform" size={18} />
              <span>{contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-10 text-center">
        <div className="site-container">
          <p className="text-[10px] font-medium uppercase tracking-[.3em] text-white/25">
            © 2026 Nyaera Ogega & Co. Advocates. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
