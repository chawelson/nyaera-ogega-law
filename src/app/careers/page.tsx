import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { contact, images } from '@/lib/site-data';

export default function CareersPage() {
  return (
    <>
      <PageHero 
        title="Careers" 
        subtitle="Join a modern legal practice committed to excellence, integrity and client service." 
        backgroundImage="/images/Nairobi_skyline_view.jpeg" 
        breadcrumb="Careers" 
      />
      <section className="bg-white py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[.25em] text-[#ab812b]">Work with us</p>
            <h2 className="mt-3 text-4xl font-bold text-[#2e3192]">A professional environment for disciplined, commercially minded legal talent.</h2>
            <div className="mt-8 grid gap-4">
              {['Real estate and conveyancing exposure', 'Commercial and corporate advisory work', 'Mentorship-focused professional development', 'Client-facing strategic legal practice'].map((item) => <div key={item} className="rounded border border-slate-200 bg-[#f6f7ff] p-5 font-bold text-slate-700">{item}</div>)}
            </div>
            <a href={`mailto:${contact.email}?subject=Careers enquiry`} className="mt-8 inline-block rounded bg-[#2e3192] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ab812b]">Send Career Enquiry</a>
          </div>
          <Image src={images.milicourts} alt="Corporate legal team" width={720} height={620} className="rounded object-cover shadow-2xl shadow-slate-200" />
        </div>
      </section>
    </>
  );
}
