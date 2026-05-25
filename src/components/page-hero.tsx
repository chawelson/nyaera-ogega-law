import Image from 'next/image';
import Link from 'next/link';

interface PageHeroProps {
  title: string | React.ReactNode;
  subtitle?: string;
  breadcrumb?: string;
  backgroundImage?: string;
}

export function PageHero({ title, subtitle, breadcrumb, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#090d3f] py-20 md:py-28 lg:py-32 text-white">
      {backgroundImage && (
        <Image 
          src={backgroundImage} 
          alt={typeof title === 'string' ? title : 'Page Hero'} 
          fill 
          priority 
          className="-z-20 object-cover" 
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#090d3f]/95 via-[#2e3192]/80 to-[#090d3f]/90" />
      
      <div className="site-container">
        {breadcrumb && (
          <nav className="mb-6 flex items-center gap-2 text-sm font-medium">
            <Link href="/" className="text-white/70 hover:text-[#ab812b] transition-colors">Home</Link>
            <span className="text-white/30 select-none">&gt;</span>
            <span className="text-white">{breadcrumb}</span>
          </nav>
        )}
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-white/85">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
