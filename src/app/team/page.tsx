import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { CTA } from '@/components/cta';
import { teamMembers, siteUrl } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Our Legal Team',
  description:
    'Meet the advocates and legal consultants at Nyaera Ogega & Co. — experienced, responsive professionals delivering expert legal services across Kenya.',
  alternates: { canonical: `${siteUrl}/team` },
  openGraph: {
    title: 'Our Legal Team | Nyaera Ogega & Co. Advocates',
    description:
      'Meet the advocates and legal consultants at Nyaera Ogega & Co. — experienced professionals serving clients across Kenya.',
    url: `${siteUrl}/team`,
    images: [{ url: '/images/Sharon-Nyaera-Founder.jpg', width: 1200, height: 630, alt: 'Nyaera Ogega & Co. Legal Team' }],
  },
};

export default function TeamPage() {
  return (
    <>
      <PageHero 
        title="Our Legal Team" 
        subtitle="Experienced advocates providing practical, responsive and professional representation." 
        backgroundImage="/images/Nairobi_skyline_view.jpeg" 
        breadcrumb="Our Team" 
      />
      <section className="bg-white py-24">
        <div className="site-container grid gap-8 md:grid-cols-3">
          {teamMembers.map((member) => <article key={member.name} className="card-lift overflow-hidden rounded border border-slate-200 bg-white"><Image src={member.image} alt={member.name} width={520} height={360} className="h-72 w-full object-cover" /><div className="p-7"><p className="text-xs font-black uppercase tracking-[.18em] text-[#ab812b]">{member.role}</p><h2 className="mt-3 font-display text-3xl font-bold text-[#2e3192]">{member.name}</h2><p className="mt-4 leading-7 text-slate-600">{member.focus}</p></div></article>)}
        </div>
      </section>
      <CTA />
    </>
  );
}
