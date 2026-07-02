import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, Scale, Shield, Building, Gavel, Landmark, BookOpen, Briefcase } from 'lucide-react';
import path from 'node:path';
import Database from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@/generated/prisma/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { siteUrl } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Legal Document Marketplace',
  description:
    'Browse our premium collection of legal documents — conveyancing, litigation, commercial law, and more. Instant download after purchase.',
  alternates: { canonical: `${siteUrl}/documents` },
  openGraph: {
    title: 'Legal Document Marketplace | Nyaera Ogega & Co. Advocates',
    description:
      'Browse our premium collection of legal documents — conveyancing, litigation, commercial law, and more. Instant download after purchase.',
    url: `${siteUrl}/documents`,
    images: [{ url: '/images/Main-HomeBanner-Herrolegal_office.jpeg', width: 1200, height: 630, alt: 'Legal Document Marketplace' }],
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

const sampleDocuments = [
  {
    title: 'Sale Agreement — Land & Property Transfer',
    slug: 'sale-agreement-land-property-transfer',
    category: 'Conveyancing',
    previewText: 'Comprehensive sale agreement for the transfer of land and property between parties, compliant with Kenyan land laws.',
    price: 2500,
    filePath: '/documents/sale-agreement.pdf',
  },
  {
    title: 'Lease Agreement — Commercial & Residential',
    slug: 'lease-agreement-commercial-residential',
    category: 'Conveyancing',
    previewText: 'Standard lease agreement template covering commercial and residential tenancy terms under Kenyan law.',
    price: 2000,
    filePath: '/documents/lease-agreement.pdf',
  },
  {
    title: 'Employment Contract — Permanent & Fixed Term',
    slug: 'employment-contract-permanent-fixed-term',
    category: 'Employment Law',
    previewText: 'Legally compliant employment contract template for permanent and fixed-term employees in Kenya.',
    price: 1800,
    filePath: '/documents/employment-contract.pdf',
  },
  {
    title: 'Memorandum of Understanding (MoU) Template',
    slug: 'memorandum-of-understanding-template',
    category: 'Commercial Law',
    previewText: 'Professional MoU template for business partnerships, joint ventures, and collaborative agreements.',
    price: 1500,
    filePath: '/documents/mou-template.pdf',
  },
  {
    title: 'Power of Attorney — General & Specific',
    slug: 'power-of-attorney-general-specific',
    category: 'Legal Guides',
    previewText: 'Comprehensive power of attorney document granting authority for general or specific legal matters.',
    price: 1200,
    filePath: '/documents/power-of-attorney.pdf',
  },
  {
    title: 'Tenancy Notice — Landlord & Tenant',
    slug: 'tenancy-notice-landlord-tenant',
    category: 'Conveyancing',
    previewText: 'Statutory notice templates for termination of tenancy, rent arrears, and breach of covenant.',
    price: 1000,
    filePath: '/documents/tenancy-notice.pdf',
  },
  {
    title: 'Company Incorporation Documents — Kenya',
    slug: 'company-incorporation-documents-kenya',
    category: 'Corporate Law',
    previewText: 'Complete set of incorporation documents including Memorandum and Articles of Association for Kenyan companies.',
    price: 3500,
    filePath: '/documents/company-incorporation.pdf',
  },
  {
    title: 'Divorce Petition — Irretrievable Breakdown',
    slug: 'divorce-petition-irretrievable-breakdown',
    category: 'Family Law',
    previewText: 'Divorce petition template based on irretrievable breakdown of marriage under Kenyan family law.',
    price: 2200,
    filePath: '/documents/divorce-petition.pdf',
  },
  {
    title: 'Civil Litigation — Plaint & Defence Templates',
    slug: 'civil-litigation-plaint-defence-templates',
    category: 'Litigation',
    previewText: 'Standard plaint and statement of defence templates for civil proceedings in Kenyan courts.',
    price: 2800,
    filePath: '/documents/civil-litigation-templates.pdf',
  },
];

function formatPrice(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

async function getDocuments() {
  // Resolve the database path from the Prisma connection string
  const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  const dbPath = dbUrl.replace(/^file:/, '');
  const resolvedPath = path.resolve(process.cwd(), dbPath);

  const connection = new Database(resolvedPath);
  const adapter = new PrismaBetterSqlite3({ url: resolvedPath });
  const prisma = new PrismaClient({ adapter });

  try {
    const documents = await prisma.document.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    await prisma.$disconnect();

    if (documents.length === 0) {
      return { documents: sampleDocuments, isSampleData: true };
    }

    return { documents, isSampleData: false };
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    await prisma.$disconnect();
    return { documents: sampleDocuments, isSampleData: true };
  }
}

export default async function DocumentsPage() {
  const { documents, isSampleData } = await getDocuments();

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative isolate overflow-hidden bg-[#090d3f] py-20 md:py-28 lg:py-32 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#090d3f]/95 via-[#2e3192]/80 to-[#090d3f]/90" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-25" />

        <div className="site-container">
          <nav className="mb-6 flex items-center gap-2 text-sm font-medium">
            <Link href="/" className="text-white/70 hover:text-[#ab812b] transition-colors">
              Home
            </Link>
            <span className="text-white/30 select-none">{'>'}</span>
            <span className="text-white">Documents</span>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded border border-[#ab812b]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur">
              Document Marketplace
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Legal Document Marketplace
            </h1>
            <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-white/85">
              Browse our collection of premium legal documents. Each template is drafted by our experienced legal team and
              compliant with Kenyan law. Instant download after purchase.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== DOCUMENTS GRID ===================== */}
      <section className="bg-[#f6f7ff] py-16 md:py-24">
        <div className="site-container">
          {isSampleData && (
            <div className="mb-8 rounded border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              <span className="font-bold">Demo Mode:</span> Showing sample documents. Add documents to the database to see
              your own content.
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc, index) => (
              <Card
                key={doc.slug}
                size="sm"
                className="card-lift border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`gap-1.5 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                        categoryColors[doc.category] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {categoryIcons[doc.category] || <FileText size={14} />}
                      {doc.category}
                    </Badge>
                    <span className="font-display text-lg font-bold text-[#ab812b]">
                      {formatPrice(doc.price)}
                    </span>
                  </div>
                  <CardTitle className="mt-3 font-display text-lg font-bold text-[#2e3192] leading-snug">
                    {doc.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 pb-0">
                  <p className="text-sm leading-6 text-slate-600">
                    {truncateText(doc.previewText, 60)}
                  </p>
                </CardContent>

                <CardFooter className="border-t border-slate-100 bg-transparent pt-4">
                  <Link
                    href={`/documents/${doc.slug}`}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded bg-[#2e3192] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#ab812b]"
                  >
                    Preview Document
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {documents.length === 0 && !isSampleData && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={48} className="mb-4 text-slate-300" />
              <h3 className="text-xl font-bold text-slate-600">No documents available</h3>
              <p className="mt-2 text-sm text-slate-400">Check back later for new legal document templates.</p>
            </div>
          )}
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
