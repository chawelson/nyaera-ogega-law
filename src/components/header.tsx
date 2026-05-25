// components/header.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Scale,
  Hammer,
  BookOpen,
  Users,
  Newspaper,
  Briefcase,
  MessageSquare,
  Mail,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

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
      {/* 1. TOP BAR - Desktop Only */}
      <div className="hidden lg:block bg-[#2e3192] text-white border-b border-white/10">
        <div className="site-container flex items-center justify-between py-3 text-[13px] font-medium">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-8">
              <a href="tel:+254791646341" className="flex items-center gap-2.5 hover:text-[#f0c675] transition-colors">
                <Phone size={15} className="text-[#ab812b]" />
                <span>+254 791 646 341</span>
              </a>
              <a href="mailto:info@nyaeraogegaadvocates.com" className="flex items-center gap-2.5 hover:text-[#f0c675] transition-colors">
                <Mail size={15} className="text-[#ab812b]" />
                <span>info@nyaeraogegaadvocates.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4 text-white border-l border-white/20 pl-12">
              <a
                href="#"
                className="hover:text-[#ab812b] transition-colors duration-300"
              >
                <FaFacebookF size={14} />
              </a>

              <a
                href="#"
                className="hover:text-[#ab812b] transition-colors duration-300"
              >
                <FaInstagram size={14} />
              </a>

              <a
                href="#"
                className="hover:text-[#ab812b] transition-colors duration-300"
              >
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/contact" className="bg-[#ab812b] text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#1f2368] transition-all duration-300 shadow-lg shadow-black/10">
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE BAR - Logo Section */}
      <div className="bg-white py-3 lg:py-6">
        <div className="site-container flex items-center justify-between lg:justify-center">
          {/* Logo for both Mobile and Desktop */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-24 sm:h-24 md:h-36 lg:h-48 w-auto aspect-[3/1]">
              <Image 
                src="/logos/Nyaera-Ogega-New-Logo.png" 
                alt="Nyaera Ogega & Co. Advocates" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#2e3192]"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 3. MAIN NAV BAR - Desktop Only Row */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-[#2e3192]/5 border-b border-slate-100' 
            : 'bg-white border-t border-b border-slate-100'
        }`}
      >
        <div className="site-container hidden lg:flex items-center justify-center py-2">
          <nav className="flex items-center gap-3">
            {navLinks.map((link) => (
              <div 
                key={link.href} 
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-bold transition-all duration-300 ${
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
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 animate-slide-down">
                    <div className="rounded-xl border border-slate-100 bg-white p-2 shadow-2xl shadow-[#2e3192]/15">
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