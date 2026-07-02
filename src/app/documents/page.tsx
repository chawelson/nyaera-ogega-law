import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building, Gavel, Scale, Shield, Landmark, BookOpen, Briefcase, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { siteUrl } from '@/lib/site-data';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

// ── Fallback sample data (used when DB is unreachable) ──────────────
const sampleDocuments = [
  {
    id: 1,
    title: 'Sale Agreement — Land & Property Transfer',
    slug: 'sale-agreement-land-property-transfer',
    category: 'Conveyancing',
    previewText: 'Comprehensive sale agreement for the transfer of land and property between parties...',
    price: 2500,
    filePath: '/documents/sale-agreement.pdf',
    status: 'active',
  },
  {
    id: 2,
    title: 'Lease Agreement — Commercial & Residential',
    slug: 'lease-agreement-commercial-residential',
    category: 'Conveyancing',
    previewText: 'Standard lease agreement template covering commercial and residential tenancy terms...',
    price: 2000,
    filePath: '/documents/lease-agreement.pdf',
    status: 'active',
  },
  {
    id: 3,
    title: 'Employment Contract — Permanent & Fixed Term',
    slug: 'employment-contract-permanent-fixed-term',
    category: 'Employment Law',
    previewText: 'Legally compliant employment contract template for permanent and fixed-term employees...',
    price: 1800,
    filePath: '/documents/employment-contract.pdf',
    status: 'active',
  },
  {
    id: 4,
    title: 'Memorandum of Understanding (MoU) Template',
    slug: 'memorandum-of-understanding-mou',
    category: 'Commercial Law',
    previewText: 'Professional MoU template for business partnerships, joint ventures...',
    price: 1500,
    filePath: '/documents/mou-template.pdf',
    status: 'active',
  },
  {
    id: 5,
    title: 'Power of Attorney — General & Specific',
    slug: 'power-of-attorney-general-specific',
    category: 'Legal Guides',
    previewText: 'Comprehensive power of attorney document granting authority...',
    price: 1200,
    filePath: '/documents/power-of-attorney.pdf',
    status: 'active',
  },
  {
    id: 6,
    title: 'Tenancy Notice — Landlord & Tenant',
    slug: 'tenancy-notice-landlord-tenant',
    category: 'Conveyancing',
    previewText: 'Statutory notice templates for termination of tenancy...',
    price: 1000,
    filePath: '/documents/tenancy-notice.pdf',
    status: 'active',
  },
  {
    id: 7,
    title: 'Company Incorporation Documents — Kenya',
    slug: 'company-incorporation-documents-kenya',
    category: 'Corporate Law',
    previewText: 'Complete set of incorporation documents including Memorandum and Articles...',
    price: 3500,
    filePath: '/documents/company-incorporation.pdf',
    status: 'active',
  },
  {
    id: 8,
    title: 'Divorce Petition — Irretrievable Breakdown',
    slug: 'divorce-petition-irretrievable-breakdown',
    category: 'Family Law',
    previewText: 'Divorce petition template based on irretrievable breakdown of marriage...',
    price: 2200,
    filePath: '/documents/divorce-petition.pdf',
    status: 'active',
  },
  {
    id: 9,
    title: 'Civil Litigation — Plaint & Defence Templates',
    slug: 'civil-litigation-plaintiff-defendant',
    category: 'Litigation',
    previewText: 'Standard plaint and statement of defence templates for civil proceedings...',
    price: 2800,
    filePath: '/documents/civil-litigation-templates.pdf',
    status: 'active',
  },
];

// ── Database helper ─────────────────────────────────────────────────
async function getDocumentsFromDb() {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const docs = await prisma.document.findMany({
      where: { status: 'active' },
      orderBy: { price: 'desc' },
    });
    return docs.map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      category: d.category,
      previewText: d.previewText,
      price: d.price,
      filePath: d.filePath,
      status: d.status,
    }));
  } finally {
    await prisma.$disconnect();
  }
}

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

function formatPrice(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}

export const metadata: Metadata = {
  title: 'Legal Document Marketplace | Nyaera Ogega & Co. Advocates',
  description: 'Browse and purchase premium legal document templates from Nyaera Ogega & Co. Advocates.',
  alternates: { canonical: `${siteUrl}/documents` },
};

export default async function DocumentsPage() {
  let documents;

  try {
    documents = await getDocumentsFromDb();
    console.log('✅ Loaded documents from database');
  } catch (err) {
    console.warn('⚠️ Database unavailable, using fallback sample data:', err);
    documents = sampleDocuments;
  }

  const activeDocuments = documents.filter((d: { status: string }) => d.status === 'active');

  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#090d3f] py-16 md:py-20 lg:py-24 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#090d3f]/95 via-[#2e3192]/80 to-[#090d3f]/90" />
        <div className="site-container">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded border border-[#ab812b]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur">
              Document Marketplace
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Premium Legal Documents
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Browse our collection of professionally drafted legal document templates. Preview before you purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Document Grid */}
      <section className="bg-[#f6f7ff] py-12 md:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDocuments.map((doc: {
              id: number;
              title: string;
              slug: string;
              category: string;
              previewText: string;
              price: number;
            }) => (
              <Card key={doc.id} className="overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
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
                    <span className="font-display text-lg font-bold text-[#ab812b]">
                      {formatPrice(doc.price)}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-[#2e3192] line-clamp-2">
                    {doc.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {doc.previewText}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-slate-100 pt-4">
                  <Link
                    href={`/documents/${doc.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#2e3192] hover:text-[#ab812b] transition-colors"
                  >
                    Preview Document <ArrowRight size={16} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {activeDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No documents available at this time.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
