import Image from 'next/image';

export function PageHero({ eyebrow, title, text, image }: { eyebrow: string; title: string; text: string; image: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0b1026] py-16 text-white md:py-24">
      <Image src={image} alt="" fill priority className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080b35] via-[#2e3192]/85 to-[#000]/50" />
      <div className="site-container max-w-4xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[.22em] text-[#f0c675] sm:text-sm sm:tracking-[.28em]">{eyebrow}</p>
        <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">{text}</p>
      </div>
    </section>
  );
}
