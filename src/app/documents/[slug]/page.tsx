import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, Scale, Shield, Building, Gavel, Landmark, BookOpen, Briefcase, Lock, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteUrl } from '@/lib/site-data';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

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

  return (
    <>
      {/* ===================== HERO / BREADCRUMB ===================== */}
      <section className="relative isolate overflow-hidden bg-[#090d3f] py-16 md:py-20 lg:py-24 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#090d3f]/95 via-[#2e3192]/80 to-[#090d3f]/90" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-25" />

        <div className="site-container">
          <nav className="mb-6 flex items-center gap-2 text-sm font-medium">
            <Link href="/" className="text-white/70 hover:text-[#ab812b] transition-colors">
              Home
            </Link>
            <span className="text-white/30 select-none">{'>'}</span>
            <Link href="/documents" className="text-white/70 hover:text-[#ab812b] transition-colors">
              Documents
            </Link>
            <span className="text-white/30 select-none">{'>'}</span>
            <span className="text-white truncate max-w-[200px] sm:max-w-xs">{doc.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded border border-[#ab812b]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur">
              Premium Legal Document
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {doc.title}
            </h1>
          </div>
        </div>
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

              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-[#ab812b]">
                  {formatPrice(doc.price)}
                </span>
                <span className="rounded bg-[#ab812b]/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#ab812b]">
                  Premium
                </span>
              </div>
            </div>

            {/* Preview text */}
            <Card className="mb-8 border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 md:p-8">
                <h2 className="mb-4 font-display text-lg font-bold text-[#2e3192]">
                  Document Preview
                </h2>
                <p className="leading-relaxed text-slate-700 whitespace-pre-line">
                  {doc.previewText}
                </p>
              </CardContent>
            </Card>

            {/* Preview notice */}
            <Card className="mb-8 border-2 border-amber-200 bg-amber-50 shadow-sm">
              <CardContent className="flex items-start gap-4 p-5 md:p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <Lock size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-amber-800">
                    This is a preview
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-amber-700">
                    You are viewing a preview of this document. The full document contains detailed clauses,
                    legal provisions, and execution pages. Pay to download the complete, ready-to-use legal
                    document template.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="bg-[#2e3192] text-white hover:bg-[#ab812b] cursor-pointer"
                asChild
              >
                <Link href="/documents">
                  <Download size={16} />
                  Download Full Document
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <Link href="/documents">
                  <ArrowLeft size={16} />
                  Back to Documents
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="bg-[#0b1026] py-16 text-white md:py-20">
        <div className="site-container text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Need a custom legal document?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            Our legal team can draft bespoke documents tailored to your specific needs. Get in touch for a consultation.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded bg-[#ab812b] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#2e3192]"
          >
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
