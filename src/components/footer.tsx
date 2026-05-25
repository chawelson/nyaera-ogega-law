import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { contact, navLinks, practiceAreas } from '@/lib/site-data';

export function Footer() {
  return (
    <footer className="bg-[#090d3f] text-white">
      <div className="site-container grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/logo/logo-dark.png" alt="Nyaera Ogega & Co. Advocates" width={260} height={90} className="h-16 w-auto object-contain" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">Modern legal advisors for real estate, conveyancing, commercial law and dispute resolution across Kenya.</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-[#ab812b]">Pages</h3>
          <div className="grid gap-2 text-sm text-white/75">{navLinks.map((l) => <Link className="hover:text-[#ab812b]" key={l.href} href={l.href}>{l.label}</Link>)}</div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-[#ab812b]">Practice Areas</h3>
          <div className="grid gap-2 text-sm text-white/75">{practiceAreas.slice(0, 5).map((p) => <Link className="hover:text-[#ab812b]" key={p.slug} href="/practice-areas">{p.title}</Link>)}</div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-[#ab812b]">Contact</h3>
          <div className="space-y-3 text-sm text-white/75">
            <p className="flex gap-3"><MapPin className="mt-1 shrink-0 text-[#ab812b]" size={18} />{contact.address}</p>
            <p className="flex gap-3"><Mail className="shrink-0 text-[#ab812b]" size={18} />{contact.email}</p>
            <p className="flex gap-3"><Phone className="shrink-0 text-[#ab812b]" size={18} />{contact.phone}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">© 2026 Nyaera Ogega & Co. Advocates. All Rights Reserved.</div>
    </footer>
  );
}
