import Link from 'next/link';

export function CTA() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="site-container overflow-hidden rounded bg-[#2e3192] p-6 text-white shadow-2xl shadow-[#2e3192]/20 sm:p-10 md:p-14">
        <div className="grid gap-8 md:grid-cols-[1.3fr_.7fr] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#f0c675] sm:text-sm sm:tracking-[.25em]">Speak to our legal team</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">Need strategic legal counsel?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">Book a confidential consultation and get practical guidance for your property, business or dispute matter.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link href="/contact" className="rounded bg-[#ab812b] px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white hover:text-[#2e3192]">Book Consultation</Link>
            <Link href="/practice-areas" className="rounded border border-white/30 px-6 py-3 text-center text-sm font-bold text-white transition hover:border-[#ab812b] hover:text-[#f0c675]">View Services</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
