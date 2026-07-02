'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building,
  Gavel,
  Scale,
  Shield,
  Landmark,
  BookOpen,
  Briefcase,
  FileText,
  Search,
  X,
  Star,
  TrendingUp,
  Sparkles,
  ChevronDown,
  CheckCircle,
  Users,
  Award,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { DocumentItem } from './page';

// ── Badge assignments ───────────────────────────────────────────────
const badgeAssignments: Record<number, 'bestseller' | 'top-rated' | 'new-release'> = {
  1: 'bestseller',
  2: 'top-rated',
  4: 'new-release',
  7: 'bestseller',
  8: 'top-rated',
  9: 'new-release',
};

// ── Icons & colours ─────────────────────────────────────────────────
const categoryIcons: Record<string, React.ReactNode> = {
  Conveyancing: <Building size={16} />,
  Litigation: <Gavel size={16} />,
  'Commercial Law': <Briefcase size={16} />,
  'Employment Law': <Scale size={16} />,
  'Family Law': <Shield size={16} />,
  'Corporate Law': <Landmark size={16} />,
  'Legal Guides': <BookOpen size={16} />,
};

const categoryColors: Record<string, string> = {
  Conveyancing: 'bg-blue-100 text-blue-800 border-blue-200',
  Litigation: 'bg-red-100 text-red-800 border-red-200',
  'Commercial Law': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Employment Law': 'bg-purple-100 text-purple-800 border-purple-200',
  'Family Law': 'bg-pink-100 text-pink-800 border-pink-200',
  'Corporate Law': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Legal Guides': 'bg-amber-100 text-amber-800 border-amber-200',
};

const categoryPillColors: Record<string, string> = {
  Conveyancing: 'border-blue-300 text-blue-700 hover:bg-blue-50 data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:border-blue-600',
  Litigation: 'border-red-300 text-red-700 hover:bg-red-50 data-[active=true]:bg-red-600 data-[active=true]:text-white data-[active=true]:border-red-600',
  'Commercial Law': 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 data-[active=true]:bg-emerald-600 data-[active=true]:text-white data-[active=true]:border-emerald-600',
  'Employment Law': 'border-purple-300 text-purple-700 hover:bg-purple-50 data-[active=true]:bg-purple-600 data-[active=true]:text-white data-[active=true]:border-purple-600',
  'Family Law': 'border-pink-300 text-pink-700 hover:bg-pink-50 data-[active=true]:bg-pink-600 data-[active=true]:text-white data-[active=true]:border-pink-600',
  'Corporate Law': 'border-indigo-300 text-indigo-700 hover:bg-indigo-50 data-[active=true]:bg-indigo-600 data-[active=true]:text-white data-[active=true]:border-indigo-600',
  'Legal Guides': 'border-amber-300 text-amber-700 hover:bg-amber-50 data-[active=true]:bg-amber-600 data-[active=true]:text-white data-[active=true]:border-amber-600',
};

const badgeStyles: Record<string, string> = {
  bestseller: 'bg-amber-100 text-amber-800 border-amber-300',
  'top-rated': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'new-release': 'bg-blue-100 text-blue-800 border-blue-300',
};

const badgeIcons: Record<string, React.ReactNode> = {
  bestseller: <TrendingUp size={12} />,
  'top-rated': <Star size={12} />,
  'new-release': <Sparkles size={12} />,
};

const badgeLabels: Record<string, string> = {
  bestseller: 'Bestseller',
  'top-rated': 'Top Rated',
  'new-release': 'New Release',
};

const allCategories = [
  'All',
  'Conveyancing',
  'Litigation',
  'Commercial Law',
  'Employment Law',
  'Family Law',
  'Corporate Law',
  'Legal Guides',
];

function formatPrice(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}

const ITEMS_PER_PAGE = 6;

// ── Animated Particles ──────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(171, 129, 43, ${p.alpha})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}

// ── Props ───────────────────────────────────────────────────────────
interface Props {
  documents: DocumentItem[];
}

// ── Main Client Component ──────────────────────────────────────────
export default function DocumentsPageClient({ documents }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    let result = documents;

    if (activeCategory !== 'All') {
      result = result.filter((d) => d.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.previewText.toLowerCase().includes(q)
      );
    }

    return result;
  }, [documents, activeCategory, searchQuery]);

  const visibleDocuments = useMemo(
    () => filteredDocuments.slice(0, visibleCount),
    [filteredDocuments, visibleCount]
  );

  const hasMore = visibleCount < filteredDocuments.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  const handleCategoryClick = useCallback((cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Card animation variants ──
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
    }),
  };

  return (
    <>
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative isolate overflow-hidden bg-[#090d3f] py-20 md:py-28 lg:py-32 text-white">
        {/* Gradient overlays */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#090d3f] via-[#1a1d6e] to-[#2e3192]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(171,129,43,0.15),transparent_50%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(46,49,146,0.3),transparent_50%)]" />

        {/* Animated particles */}
        <Particles />

        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="site-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mx-auto max-w-3xl text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ab812b]/40 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur-md"
            >
              <Sparkles size={14} />
              Document Marketplace
            </motion.div>

            {/* Heading */}
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Premium{' '}
              <span className="bg-gradient-to-r from-[#f0c675] to-[#ab812b] bg-clip-text text-transparent">
                Legal Documents
              </span>
            </h1>

            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
              Browse our collection of professionally drafted legal document templates.
              Drafted by expert advocates, ready for your use.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 mx-auto max-w-xl"
            >
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <Input
                  type="text"
                  placeholder="Search documents by title, category, or keyword..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-10 py-6 text-white placeholder:text-white/40 backdrop-blur-md focus:border-[#ab812b]/60 focus:ring-[#ab812b]/30 focus-visible:ring-[#ab812b]/30 text-base"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2 text-white/60">
                <FileText size={16} className="text-[#ab812b]" />
                <span>{documents.length} Documents</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Award size={16} className="text-[#ab812b]" />
                <span>7 Categories</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <CheckCircle size={16} className="text-[#ab812b]" />
                <span>Kenya Law Compliant</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f6f7ff] to-transparent z-10" />
      </section>

      {/* ===================== CATEGORY FILTERS ===================== */}
      <section className="bg-[#f6f7ff] -mt-1">
        <div className="site-container py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap items-center gap-2"
          >
            {allCategories.map((cat) => (
              <button
                key={cat}
                data-active={activeCategory === cat}
                onClick={() => handleCategoryClick(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  cat === 'All'
                    ? activeCategory === 'All'
                      ? 'bg-[#090d3f] text-white border-[#090d3f]'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                    : categoryPillColors[cat] || 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat !== 'All' && (categoryIcons[cat] || <FileText size={14} />)}
                {cat === 'All' ? 'All Documents' : cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== DOCUMENT GRID ===================== */}
      <section className="bg-[#f6f7ff] pb-16 md:pb-20">
        <div className="site-container">
          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {`${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''} found`}
              {activeCategory !== 'All' && (
                <span className="ml-1">
                  in <strong className="text-slate-700">{activeCategory}</strong>
                </span>
              )}
            </p>
          </div>

          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {visibleDocuments.map((doc, index) => {
                  const badge = badgeAssignments[doc.id];
                  return (
                    <motion.div
                      key={doc.id}
                      layout
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      custom={index}
                    >
                      <Card className="group relative overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                        {/* Premium top accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ab812b] via-[#f0c675] to-[#ab812b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Badge ribbon */}
                        {badge && (
                          <div className="absolute top-3 right-3 z-10">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                                badgeStyles[badge]
                              }`}
                            >
                              {badgeIcons[badge]}
                              {badgeLabels[badge]}
                            </span>
                          </div>
                        )}

                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge
                              variant="outline"
                              className={`gap-1.5 border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                                categoryColors[doc.category] || 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {categoryIcons[doc.category] || <FileText size={14} />}
                              {doc.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-[#2e3192] line-clamp-2 mt-2 group-hover:text-[#ab812b] transition-colors duration-200">
                            {doc.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="pb-3 flex-1">
                          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                            {doc.previewText}
                          </p>
                        </CardContent>

                        <CardFooter className="border-t border-slate-100 pt-4 flex items-center justify-between">
                          {/* Gradient price tag */}
                          <div className="relative">
                            <span className="font-display text-lg font-bold bg-gradient-to-r from-[#ab812b] to-[#f0c675] bg-clip-text text-transparent">
                              {formatPrice(doc.price)}
                            </span>
                          </div>

                          <Link
                            href={`/documents/${doc.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#2e3192] hover:text-[#ab812b] transition-colors group/link"
                          >
                            Preview Document
                            <ArrowRight
                              size={16}
                              className="transition-transform duration-200 group-hover/link:translate-x-1"
                            />
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Empty state */}
            {filteredDocuments.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-slate-100 mb-4">
                  <FileText size={28} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No documents found</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different search term.`
                    : 'No documents in this category yet.'}
                </p>
                {(searchQuery || activeCategory !== 'All') && (
                  <Button
                    variant="outline"
                    className="mt-4 border-slate-300 text-slate-600"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </motion.div>
            )}

            {/* Load More */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-10 text-center"
              >
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="bg-white border-2 border-[#2e3192] text-[#2e3192] hover:bg-[#2e3192] hover:text-white transition-all duration-200 rounded-xl px-10 py-6 font-bold"
                >
                  Load More Documents
                  <ChevronDown size={18} className="ml-2" />
                </Button>
              </motion.div>
            )}
          </>
        </div>
      </section>

      {/* ===================== TRUSTED BY SECTION ===================== */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="site-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ab812b]/20 bg-[#ab812b]/5 px-5 py-2 text-xs font-black uppercase tracking-[.18em] text-[#ab812b]">
              <Users size={14} />
              Trusted by 100+ Clients
            </div>

            <h2 className="font-display text-2xl font-bold text-[#090d3f] sm:text-3xl">
              Why Legal Professionals Choose Us
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Our documents are drafted by experienced advocates and regularly updated to comply with Kenyan law.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                {
                  icon: <Award size={28} className="text-[#ab812b]" />,
                  title: 'Expertly Drafted',
                  desc: 'Prepared by qualified Kenyan advocates with years of experience.',
                },
                {
                  icon: <Clock size={28} className="text-[#ab812b]" />,
                  title: 'Always Updated',
                  desc: 'Regularly reviewed to reflect the latest changes in Kenyan legislation.',
                },
                {
                  icon: <Shield size={28} className="text-[#ab812b]" />,
                  title: 'Legally Compliant',
                  desc: 'Fully compliant with Kenyan laws, regulations, and court procedures.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center size-14 rounded-xl bg-[#ab812b]/10 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-[#090d3f]">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="bg-gradient-to-r from-[#090d3f] to-[#2e3192] py-16 md:py-20 text-white">
        <div className="site-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Need a custom legal document?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              Our legal team can draft bespoke documents tailored to your specific needs.
              Get in touch for a consultation.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#ab812b] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-[#2e3192] hover:shadow-lg"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===================== SCROLL TO TOP ===================== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center size-12 rounded-full bg-[#ab812b] text-white shadow-lg hover:bg-[#8a6822] transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronDown size={20} className="rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
