// components/header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown, Scale, Hammer, BookOpen, Users, Newspaper, Briefcase, MessageSquare } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { 
    href: '/practice-areas', 
    label: 'Practice Areas',
    icon: Scale,
    children: [
      { href: '/practice-areas#conveyancing', label: 'Conveyancing', icon: Hammer },
      { href: '/practice-areas#real-estate', label: 'Real Estate', icon: Scale },
      { href: '/practice-areas#commercial', label: 'Commercial Law', icon: Briefcase },
      { href: '/practice-areas#dispute', label: 'Dispute Resolution', icon: BookOpen },
    ]
  },
  { href: '/case-results', label: 'Case Results', icon: BookOpen },
  { href: '/team', label: 'Our Team', icon: Users },
  { href: '/insights', label: 'Insights', icon: Newspaper },
  { href: '/careers', label: 'Careers', icon: Briefcase },
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#0b1026] text-white/80">
        <div className="site-container flex items-center justify-between py-2.5 text-xs">
          <div className="flex items-center gap-6">
            <a href="tel:+254000000000" className="flex items-center gap-2 hover:text-[#f0c675] transition-colors">
              <Phone size={12} />
              <span>+254 700 000 000</span>
            </a>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline text-white/60">Nairobi, Kenya</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-[#f0c675] transition-colors">Book Consultation</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-[#2e3192]/5' 
            : 'bg-white'
        }`}
      >
        <div className="site-container flex items-center justify-between py-4 lg:py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-[#2e3192] transition-transform duration-300 group-hover:scale-105">
              <Scale className="text-[#f0c675]" size={22} />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-bold leading-tight text-[#2e3192]">Nyaera Ogega</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ab812b]">& Co. Advocates</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div 
                key={link.href} 
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-[#2e3192] bg-[#2e3192]/5'
                      : 'text-slate-600 hover:text-[#2e3192] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.href ? 'rotate-180' : ''}`} />}
                </Link>

                {/* Dropdown */}
                {link.children && activeDropdown === link.href && (
                  <div className="absolute top-full left-0 mt-1 w-64 animate-slide-down">
                    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-2xl shadow-[#2e3192]/10">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-[#f6f7ff] hover:text-[#2e3192]"
                        >
                          <child.icon size={16} className="text-[#ab812b]" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link 
              href="/contact" 
              className="btn-primary animate-pulse-gold rounded-lg bg-[#ab812b] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ab812b]/25 hover:bg-[#2e3192] hover:shadow-[#2e3192]/25 transition-all duration-300"
            >
              Free Consultation
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2e3192]"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="lg:hidden animate-slide-down border-t border-slate-100 bg-white">
            <div className="site-container py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-semibold transition-colors ${
                      isActive(link.href)
                        ? 'bg-[#2e3192]/5 text-[#2e3192]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#2e3192]'
                    }`}
                  >
                    {link.icon && <link.icon size={18} className="text-[#ab812b]" />}
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-8 mt-1 space-y-1 border-l-2 border-[#ab812b]/20 pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-[#2e3192] transition-colors"
                        >
                          <child.icon size={14} className="text-[#ab812b]" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link 
                  href="/contact" 
                  className="block w-full rounded-lg bg-[#ab812b] px-6 py-4 text-center text-sm font-bold text-white hover:bg-[#2e3192] transition-colors"
                >
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}