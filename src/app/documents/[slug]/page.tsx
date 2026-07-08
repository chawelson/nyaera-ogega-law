import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, FileText, Scale, Shield, Building, Gavel, Landmark, BookOpen, Briefcase, Lock, CheckCircle, Star, Download, Users, Sparkles, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { siteUrl } from '@/lib/site-data';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { PreviewPageClient } from './preview-page-client';

// ── Fallback sample data (used when DB is unreachable) ──────────────
const sampleDocuments: Record<string, {
  title: string;
  slug: string;
  category: string;
  previewText: string;
  price: number;
  filePath: string;
}> = {
  'sale-agreement-land-property-transfer': {
    title: 'Sale Agreement — Land & Property Transfer',
    slug: 'sale-agreement-land-property-transfer',
    category: 'Conveyancing',
    previewText: 'Comprehensive sale agreement for the transfer of land and property between parties, compliant with Kenyan land laws. This document covers all essential clauses including purchase price, deposit, completion date, representations and warranties, indemnities, and dispute resolution mechanisms. Suitable for both residential and commercial property transactions.',
    price: 2500,
    filePath: '/documents/sale-agreement.pdf',
  },
  'lease-agreement-commercial-residential': {
    title: 'Lease Agreement — Commercial & Residential',
    slug: 'lease-agreement-commercial-residential',
    category: 'Conveyancing',
    previewText: 'Standard lease agreement template covering commercial and residential tenancy terms under Kenyan law. Includes provisions for rent, security deposit, maintenance obligations, termination clauses, and renewal options. Compliant with the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act.',
    price: 2000,
    filePath: '/documents/lease-agreement.pdf',
  },
  'employment-contract-permanent-fixed-term': {
    title: 'Employment Contract — Permanent & Fixed Term',
    slug: 'employment-contract-permanent-fixed-term',
    category: 'Employment Law',
    previewText: 'Legally compliant employment contract template for permanent and fixed-term employees in Kenya. Covers job description, remuneration, working hours, leave entitlements, termination notice, and confidentiality clauses. Fully compliant with the Employment Act 2007.',
    price: 1800,
    filePath: '/documents/employment-contract.pdf',
  },
  'memorandum-of-understanding-mou': {
    title: 'Memorandum of Understanding (MoU) Template',
    slug: 'memorandum-of-understanding-mou',
    category: 'Commercial Law',
    previewText: 'Professional MoU template for business partnerships, joint ventures, and collaborative agreements.',
    price: 1500,
    filePath: '/documents/mou-template.pdf',
  },
  'power-of-attorney-general-specific': {
    title: 'Power of Attorney — General & Specific',
    slug: 'power-of-attorney-general-specific',
    category: 'Legal Guides',
    previewText: 'Comprehensive power of attorney document granting authority for general or specific legal matters. Includes provisions for property management, financial transactions, legal proceedings, and healthcare decisions. Revocable and enduring options available.',
    price: 1200,
    filePath: '/documents/power-of-attorney.pdf',
  },
  'tenancy-notice-landlord-tenant': {
    title: 'Tenancy Notice — Landlord & Tenant',
    slug: 'tenancy-notice-landlord-tenant',
    category: 'Conveyancing',
    previewText: 'Statutory notice templates for termination of tenancy, rent arrears, and breach of covenant. Includes notices under section 4(1), 4(2), and 4(5) of the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act. Suitable for both landlords and tenants.',
    price: 1000,
    filePath: '/documents/tenancy-notice.pdf',
  },
  'company-incorporation-documents-kenya': {
    title: 'Company Incorporation Documents — Kenya',
    slug: 'company-incorporation-documents-kenya',
    category: 'Corporate Law',
    previewText: 'Complete set of incorporation documents including Memorandum and Articles of Association for Kenyan companies. Includes directors\' consents, registered office address notification, and statement of nominal capital. Compliant with the Companies Act 2015.',
    price: 3500,
    filePath: '/documents/company-incorporation.pdf',
  },
  'divorce-petition-irretrievable-breakdown': {
    title: 'Divorce Petition — Irretrievable Breakdown',
    slug: 'divorce-petition-irretrievable-breakdown',
    category: 'Family Law',
    previewText: 'Divorce petition template based on irretrievable breakdown of marriage under Kenyan family law. Covers grounds for divorce, custody arrangements, division of matrimonial property, spousal maintenance, and child support. Compliant with the Marriage Act 2014 and Matrimonial Causes Act.',
    price: 2200,
    filePath: '/documents/divorce-petition.pdf',
  },
  'civil-litigation-plaintiff-defendant': {
    title: 'Civil Litigation — Plaint & Defence Templates',
    slug: 'civil-litigation-plaintiff-defendant',
    category: 'Litigation',
    previewText: 'Standard plaint and statement of defence templates for civil proceedings in Kenyan courts.',
    price: 2800,
    filePath: '/documents/civil-litigation-templates.pdf',
  },
};

const categoryIcons: Record<string, React.ReactNode> = {
  'Personal & Family': <Shield size={16} />,
  'Property & Land': <Building size={16} />,
  'Employment': <Scale size={16} />,
  'Business': <Briefcase size={16} />,
  'Money & Debt': <Landmark size={16} />,
  'Court & Disputes': <Gavel size={16} />,
  'Marriage & Succession': <Shield size={16} />,
  'Motor Vehicles': <Building size={16} />,
  'Digital & IP': <BookOpen size={16} />,
  'Everyday Documents': <FileText size={16} />,
  'Advocate Stamps': <Award size={16} />,
};

const categoryColors: Record<string, string> = {
  'Personal & Family': 'bg-pink-100 text-pink-800 border-pink-200',
  'Property & Land': 'bg-blue-100 text-blue-800 border-blue-200',
  'Employment': 'bg-purple-100 text-purple-800 border-purple-200',
  'Business': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Money & Debt': 'bg-amber-100 text-amber-800 border-amber-200',
  'Court & Disputes': 'bg-red-100 text-red-800 border-red-200',
  'Marriage & Succession': 'bg-rose-100 text-rose-800 border-rose-200',
  'Motor Vehicles': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Digital & IP': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Everyday Documents': 'bg-slate-100 text-slate-800 border-slate-200',
  'Advocate Stamps': 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

function formatPrice(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}

interface DocumentData {
  title: string;
  slug: string;
  category: string;
  previewText: string;
  price: number;
  filePath: string;
}

// ── Database helper ─────────────────────────────────────────────────
async function getDocumentFromDb(slug: string): Promise<DocumentData | null> {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const doc = await prisma.document.findUnique({
      where: { slug },
    });
    if (!doc) return null;
    return {
      title: doc.title,
      slug: doc.slug,
      category: doc.category,
      previewText: doc.previewText,
      price: doc.price,
      filePath: doc.filePath,
    };
  } finally {
    await prisma.$disconnect();
  }
}

async function getDocument(slug: string): Promise<DocumentData | null> {
  // Try database first
  try {
    const dbDoc = await getDocumentFromDb(slug);
    if (dbDoc) {
      console.log('✅ Loaded document from database:', slug);
      return dbDoc;
    }
  } catch (err) {
    console.warn('⚠️ Database unavailable for slug page, falling back to sample data:', err);
  }

  // Fallback to sample data
  const sampleDoc = sampleDocuments[slug];
  if (sampleDoc) {
    console.log('✅ Returning sample data for slug:', slug);
    return sampleDoc;
  }

  // Also try finding by slug value in the sample data array
  const sampleBySlug = Object.values(sampleDocuments).find(d => d.slug === slug);
  if (sampleBySlug) {
    console.log('✅ Found sample by slug value for:', slug);
    return sampleBySlug;
  }

  return null;
}

// ── Get related documents from DB (excluding current) ──────────────
async function getRelatedDocumentsFromDb(currentSlug: string, count: number = 3): Promise<DocumentData[]> {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const docs = await prisma.document.findMany({
      where: {
        status: 'active',
        slug: { not: currentSlug },
      },
      take: count,
      orderBy: { price: 'desc' },
    });
    return docs.map((d) => ({
      title: d.title,
      slug: d.slug,
      category: d.category,
      previewText: d.previewText,
      price: d.price,
      filePath: d.filePath,
    }));
  } finally {
    await prisma.$disconnect();
  }
}

// ── Get related documents (excluding current) ──────────────────────
async function getRelatedDocuments(currentSlug: string, count: number = 3): Promise<DocumentData[]> {
  try {
    const dbDocs = await getRelatedDocumentsFromDb(currentSlug, count);
    if (dbDocs.length > 0) return dbDocs;
  } catch (err) {
    console.warn('⚠️ Database unavailable for related docs, falling back to sample data:', err);
  }

  return Object.values(sampleDocuments)
    .filter(d => d.slug !== currentSlug)
    .slice(0, count);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const doc = await getDocument(decodedSlug);

  if (!doc) {
    return {
      title: 'Document Not Found | Nyaera Ogega & Co. Advocates',
      description: 'The requested legal document could not be found.',
    };
  }

  return {
    title: `${doc.title} | Legal Document Marketplace`,
    description: doc.previewText.slice(0, 160),
    alternates: { canonical: `${siteUrl}/documents/${decodedSlug}` },
    openGraph: {
      title: `${doc.title} | Nyaera Ogega & Co. Advocates`,
      description: doc.previewText.slice(0, 160),
      url: `${siteUrl}/documents/${decodedSlug}`,
      images: [{ url: '/images/Main-HomeBanner-Herrolegal_office.jpeg', width: 1200, height: 630, alt: doc.title }],
    },
  };
}

export default async function DocumentPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const doc = await getDocument(decodedSlug);

  if (!doc) {
    notFound();
  }

  const relatedDocs = await getRelatedDocuments(decodedSlug, 3);

  return (
    <>
      {/* ===================== HERO / BREADCRUMB ===================== */}
      <section className="relative isolate overflow-hidden bg-[#090d3f] py-20 md:py-28 lg:py-32 text-white">
        {/* Dramatic gradient overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#090d3f] via-[#1a1d6e] to-[#2e3192]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(171,129,43,0.2),transparent_50%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(46,49,146,0.4),transparent_50%)]" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="site-container relative z-10">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2.5 text-sm font-medium">
            <Link href="/" className="text-white/60 hover:text-[#f0c675] transition-colors">
              Home
            </Link>
            <span className="text-white/20 select-none">›</span>
            <Link href="/documents" className="text-white/60 hover:text-[#f0c675] transition-colors">
              Documents
            </Link>
            <span className="text-white/20 select-none">›</span>
            <span className="text-white/80 truncate max-w-[200px] sm:max-w-xs">{doc.title}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ab812b]/40 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur-md">
              <Sparkles size={14} />
              Premium Legal Document
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {doc.title}
            </h1>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Download size={16} className="text-emerald-400" />
                <span>Secure Download</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Shield size={16} className="text-emerald-400" />
                <span>Legal Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Users size={16} className="text-emerald-400" />
                <span>Purchased by 10+ clients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f6f7ff] to-transparent z-10" />
      </section>

      {/* ===================== DOCUMENT DETAILS ===================== */}
      <section className="bg-[#f6f7ff] py-12 md:py-16">
        <div className="site-container">
          <div className="mx-auto max-w-4xl">
            {/* Meta bar */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <Badge
                variant="outline"
                className={`gap-1.5 border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                  categoryColors[doc.category] || 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {categoryIcons[doc.category] || <FileText size={14} />}
                {doc.category}
              </Badge>

              {/* Price display - prominent */}
              <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#ab812b]/15 to-[#f0c675]/10 border border-[#ab812b]/20 px-4 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#ab812b] uppercase tracking-wider">KES</span>
                  <span className="font-display text-2xl font-bold text-[#2e3192]">
                    {doc.price.toLocaleString('en-KE')}
                  </span>
                </div>
                <span className="h-6 w-px bg-[#ab812b]/20" />
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <Star size={12} className="fill-emerald-500 text-emerald-500" />
                  Premium
                </span>
              </div>
            </div>

            {/* PDF Preview - First 2 pages with SAMPLE watermark */}
            <Card className="mb-8 border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#ab812b] via-[#f0c675] to-[#ab812b]" />
              <CardContent className="p-6 md:p-8">
                <h2 className="mb-4 font-display text-lg font-bold text-[#2e3192] flex items-center gap-2">
                  <FileText size={20} className="text-[#ab812b]" />
                  Document Preview
                </h2>
                <p className="leading-relaxed text-slate-700 whitespace-pre-line mb-6">
                  {doc.previewText}
                </p>

                {/* PDF Viewer */}
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <div className="flex items-center justify-between bg-slate-100 px-4 py-2.5 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-500" />
                      <span className="text-xs font-semibold text-slate-600">Sample Preview (First 2 Pages)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-red-500" />
                      <span className="size-2.5 rounded-full bg-amber-400" />
                      <span className="size-2.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="relative">
                    <iframe
                      src={`/api/preview/${doc.slug}`}
                      className="w-full h-[500px] md:h-[600px]"
                      title={`Preview of ${doc.title}`}
                    />
                    {/* Overlay gradient to indicate sample */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview notice - more visually distinct */}
            <Card className="mb-8 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              <CardContent className="flex items-start gap-4 p-5 md:p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-200">
                  <Lock size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-amber-800">
                    This is a sample preview
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-amber-700">
                    You are viewing the first 2 pages with a &ldquo;SAMPLE &mdash; NOT FOR USE&rdquo; watermark.
                    The full document contains detailed clauses, legal provisions, and execution pages.
                    Purchase to download the complete, ready-to-use legal document template.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <AddToCartButton
              id={0}
              title={doc.title}
              slug={doc.slug}
              category={doc.category}
              price={doc.price}
              variant="preview"
            />

            {/* Social proof */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="size-8 rounded-full border-2 border-white bg-gradient-to-br from-[#2e3192] to-[#ab812b] flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      {['JS', 'MK', 'AN'][i - 1]}
                    </div>
                  ))}
                </div>
                <span>Joined by <strong className="text-slate-700">10+</strong> clients</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1"><strong className="text-slate-700">4.9</strong> (24 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RELATED DOCUMENTS ===================== */}
      {relatedDocs.length > 0 && (
        <section className="bg-white py-16 border-t border-slate-100">
          <div className="site-container">
            <div className="text-center mb-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ab812b]/20 bg-[#ab812b]/5 px-5 py-2 text-xs font-black uppercase tracking-[.18em] text-[#ab812b]">
                <BookOpen size={14} />
                You Might Also Like
              </div>
              <h2 className="font-display text-2xl font-bold text-[#090d3f] sm:text-3xl">
                Related Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDocs.map((related, i) => (
                <Link
                  key={related.slug}
                  href={`/documents/${related.slug}`}
                  className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <Badge
                    variant="outline"
                    className={`gap-1.5 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider mb-3 ${
                      categoryColors[related.category] || 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {categoryIcons[related.category] || <FileText size={12} />}
                    {related.category}
                  </Badge>
                  <h3 className="font-display text-base font-bold text-[#2e3192] group-hover:text-[#ab812b] transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    {related.previewText}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-md bg-[#ab812b]/10 px-2.5 py-1">
                      <span className="text-[10px] font-bold text-[#ab812b]">KES</span>
                      <span className="font-display text-sm font-bold text-[#2e3192]">
                        {related.price.toLocaleString('en-KE')}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#ab812b] group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== CTA ===================== */}
      <section className="bg-gradient-to-r from-[#090d3f] to-[#2e3192] py-16 md:py-20 text-white">
        <div className="site-container text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Need a custom legal document?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Our legal team can draft bespoke documents tailored to your specific needs. Get in touch for a consultation.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#ab812b] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-[#2e3192] hover:shadow-lg"
          >
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===================== STICKY MOBILE CTA ===================== */}
      <PreviewPageClient
        id={0}
        title={doc.title}
        slug={doc.slug}
        category={doc.category}
        price={doc.price}
      />
    </>
  );
}
