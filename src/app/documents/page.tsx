import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site-data';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import DocumentsPageClient from './documents-page-client';

// ── Types ───────────────────────────────────────────────────────────
export interface DocumentItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  previewText: string;
  price: number;
  filePath: string;
  status: string;
}

// ── Fallback sample data ────────────────────────────────────────────
const sampleDocuments: DocumentItem[] = [
  {
    id: 1,
    title: 'Sale Agreement — Land & Property Transfer',
    slug: 'sale-agreement-land-property-transfer',
    category: 'Conveyancing',
    previewText: 'Comprehensive sale agreement for the transfer of land and property between parties, compliant with Kenyan land laws. Covers purchase price, deposit, completion date, representations and warranties.',
    price: 2500,
    filePath: '/documents/sale-agreement.pdf',
    status: 'active',
  },
  {
    id: 2,
    title: 'Lease Agreement — Commercial & Residential',
    slug: 'lease-agreement-commercial-residential',
    category: 'Conveyancing',
    previewText: 'Standard lease agreement template covering commercial and residential tenancy terms under Kenyan law. Includes provisions for rent, security deposit, maintenance obligations.',
    price: 2000,
    filePath: '/documents/lease-agreement.pdf',
    status: 'active',
  },
  {
    id: 3,
    title: 'Employment Contract — Permanent & Fixed Term',
    slug: 'employment-contract-permanent-fixed-term',
    category: 'Employment Law',
    previewText: 'Legally compliant employment contract template for permanent and fixed-term employees in Kenya. Covers job description, remuneration, working hours, leave entitlements.',
    price: 1800,
    filePath: '/documents/employment-contract.pdf',
    status: 'active',
  },
  {
    id: 4,
    title: 'Memorandum of Understanding (MoU) Template',
    slug: 'memorandum-of-understanding-mou',
    category: 'Commercial Law',
    previewText: 'Professional MoU template for business partnerships, joint ventures, and collaborative agreements. Suitable for pre-contractual negotiations.',
    price: 1500,
    filePath: '/documents/mou-template.pdf',
    status: 'active',
  },
  {
    id: 5,
    title: 'Power of Attorney — General & Specific',
    slug: 'power-of-attorney-general-specific',
    category: 'Legal Guides',
    previewText: 'Comprehensive power of attorney document granting authority for general or specific legal matters. Includes property management, financial transactions, and legal proceedings.',
    price: 1200,
    filePath: '/documents/power-of-attorney.pdf',
    status: 'active',
  },
  {
    id: 6,
    title: 'Tenancy Notice — Landlord & Tenant',
    slug: 'tenancy-notice-landlord-tenant',
    category: 'Conveyancing',
    previewText: 'Statutory notice templates for termination of tenancy, rent arrears, and breach of covenant. Compliant with the Landlord and Tenant Act.',
    price: 1000,
    filePath: '/documents/tenancy-notice.pdf',
    status: 'active',
  },
  {
    id: 7,
    title: 'Company Incorporation Documents — Kenya',
    slug: 'company-incorporation-documents-kenya',
    category: 'Corporate Law',
    previewText: 'Complete set of incorporation documents including Memorandum and Articles of Association for Kenyan companies. Compliant with the Companies Act 2015.',
    price: 3500,
    filePath: '/documents/company-incorporation.pdf',
    status: 'active',
  },
  {
    id: 8,
    title: 'Divorce Petition — Irretrievable Breakdown',
    slug: 'divorce-petition-irretrievable-breakdown',
    category: 'Family Law',
    previewText: 'Divorce petition template based on irretrievable breakdown of marriage under Kenyan family law. Covers custody, division of property, and child support.',
    price: 2200,
    filePath: '/documents/divorce-petition.pdf',
    status: 'active',
  },
  {
    id: 9,
    title: 'Civil Litigation — Plaint & Defence Templates',
    slug: 'civil-litigation-plaintiff-defendant',
    category: 'Litigation',
    previewText: 'Standard plaint and statement of defence templates for civil proceedings in Kenyan courts. Suitable for both plaintiffs and defendants.',
    price: 2800,
    filePath: '/documents/civil-litigation-templates.pdf',
    status: 'active',
  },
];

// ── Database helper ─────────────────────────────────────────────────
async function getDocumentsFromDb(): Promise<DocumentItem[]> {
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

export const metadata: Metadata = {
  title: 'Legal Document Marketplace | Nyaera Ogega & Co. Advocates',
  description: 'Browse and purchase premium legal document templates from Nyaera Ogega & Co. Advocates.',
  alternates: { canonical: `${siteUrl}/documents` },
};

export default async function DocumentsPage() {
  let documents: DocumentItem[];

  try {
    documents = await getDocumentsFromDb();
    console.log('✅ Loaded documents from database');
  } catch (err) {
    console.warn('⚠️ Database unavailable, using fallback sample data:', err);
    documents = sampleDocuments;
  }

  const activeDocuments = documents.filter((d) => d.status === 'active');

  return <DocumentsPageClient documents={activeDocuments} />;
}
