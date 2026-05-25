import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { CTA } from '@/components/cta';
import { images, practiceAreas } from '@/lib/site-data';

export default function PracticeAreasPage() {
  return (
    <>
      <PageHero eyebrow="Practice Areas" title="Specialist support for property, commerce and dispute matters." text="Explore the firm’s core legal services for developers, investors, businesses, institutions and families." image={images.realEstate} />
      <section className="bg-white py-24">
        <div className="site-container grid gap-8">
          {practiceAreas.map((area, index) => (
            <article key={area.slug} className={`grid overflow-hidden rounded border border-slate-200 bg-white shadow-sm md:grid-cols-2 ${index % 2 ? 'md:[&>div:first-child]:order-2' : ''}`}>
              <div className="relative min-h-[340px]"><Image src={area.image} alt={area.title} fill className="object-cover" /></div>
              <div className="p-8 md:p-10">
                <area.icon className="mb-5 text-[#ab812b]" size={34} />
                <h2 className="font-display text-3xl font-bold text-[#2e3192]">{area.title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{area.summary}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {area.services.map((service) => <div key={service} className="rounded border border-slate-200 bg-[#f6f7ff] p-3 text-sm font-semibold text-slate-700">{service}</div>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
