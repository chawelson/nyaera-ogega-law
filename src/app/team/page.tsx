import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { CTA } from '@/components/cta';
import { images, teamMembers } from '@/lib/site-data';

export default function TeamPage() {
  return (
    <>
      <PageHero eyebrow="Our Team" title="Advocates and legal professionals with a commercial mindset." text="A responsive legal team focused on clarity, confidentiality and strategic execution." image={images.corporateAlt} />
      <section className="bg-white py-24">
        <div className="site-container grid gap-8 md:grid-cols-3">
          {teamMembers.map((member) => <article key={member.name} className="card-lift overflow-hidden rounded border border-slate-200 bg-white"><Image src={member.image} alt={member.name} width={520} height={360} className="h-72 w-full object-cover" /><div className="p-7"><p className="text-xs font-black uppercase tracking-[.18em] text-[#ab812b]">{member.role}</p><h2 className="mt-3 font-display text-3xl font-bold text-[#2e3192]">{member.name}</h2><p className="mt-4 leading-7 text-slate-600">{member.focus}</p></div></article>)}
        </div>
      </section>
      <CTA />
    </>
  );
}
