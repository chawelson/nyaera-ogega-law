import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const documents = [
  {
    title: 'Sale Agreement — Land & Property Transfer',
    slug: 'sale-agreement-land-property-transfer',
    category: 'Conveyancing',
    previewText:
      'Comprehensive sale agreement for the transfer of land and property between parties, compliant with Kenyan land laws. This document covers all essential clauses including purchase price, deposit, completion date, representations and warranties, indemnities, and dispute resolution mechanisms. Suitable for both residential and commercial property transactions.',
    price: 2500,
    filePath: '/documents/sale-agreement.pdf',
  },
  {
    title: 'Lease Agreement — Commercial & Residential',
    slug: 'lease-agreement-commercial-residential',
    category: 'Conveyancing',
    previewText:
      'Standard lease agreement template covering commercial and residential tenancy terms under Kenyan law. Includes provisions for rent, security deposit, maintenance obligations, termination clauses, and renewal options. Compliant with the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act.',
    price: 2000,
    filePath: '/documents/lease-agreement.pdf',
  },
  {
    title: 'Employment Contract — Permanent & Fixed Term',
    slug: 'employment-contract-permanent-fixed-term',
    category: 'Employment Law',
    previewText:
      'Legally compliant employment contract template for permanent and fixed-term employees in Kenya. Covers job description, remuneration, working hours, leave entitlements, termination notice, and confidentiality clauses. Fully compliant with the Employment Act 2007.',
    price: 1800,
    filePath: '/documents/employment-contract.pdf',
  },
  {
    title: 'Memorandum of Understanding (MoU) Template',
    slug: 'memorandum-of-understanding-mou',
    category: 'Commercial Law',
    previewText: 'Professional MoU template for business partnerships, joint ventures, and collaborative agreements.',
    price: 1500,
    filePath: '/documents/mou-template.pdf',
  },
  {
    title: 'Power of Attorney — General & Specific',
    slug: 'power-of-attorney-general-specific',
    category: 'Legal Guides',
    previewText:
      'Comprehensive power of attorney document granting authority for general or specific legal matters. Includes provisions for property management, financial transactions, legal proceedings, and healthcare decisions. Revocable and enduring options available.',
    price: 1200,
    filePath: '/documents/power-of-attorney.pdf',
  },
  {
    title: 'Tenancy Notice — Landlord & Tenant',
    slug: 'tenancy-notice-landlord-tenant',
    category: 'Conveyancing',
    previewText:
      'Statutory notice templates for termination of tenancy, rent arrears, and breach of covenant. Includes notices under section 4(1), 4(2), and 4(5) of the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act. Suitable for both landlords and tenants.',
    price: 1000,
    filePath: '/documents/tenancy-notice.pdf',
  },
  {
    title: 'Company Incorporation Documents — Kenya',
    slug: 'company-incorporation-documents-kenya',
    category: 'Corporate Law',
    previewText:
      "Complete set of incorporation documents including Memorandum and Articles of Association for Kenyan companies. Includes directors' consents, registered office address notification, and statement of nominal capital. Compliant with the Companies Act 2015.",
    price: 3500,
    filePath: '/documents/company-incorporation.pdf',
  },
  {
    title: 'Divorce Petition — Irretrievable Breakdown',
    slug: 'divorce-petition-irretrievable-breakdown',
    category: 'Family Law',
    previewText:
      'Divorce petition template based on irretrievable breakdown of marriage under Kenyan family law. Covers grounds for divorce, custody arrangements, division of matrimonial property, spousal maintenance, and child support. Compliant with the Marriage Act 2014 and Matrimonial Causes Act.',
    price: 2200,
    filePath: '/documents/divorce-petition.pdf',
  },
  {
    title: 'Civil Litigation — Plaint & Defence Templates',
    slug: 'civil-litigation-plaintiff-defendant',
    category: 'Litigation',
    previewText: 'Standard plaint and statement of defence templates for civil proceedings in Kenyan courts.',
    price: 2800,
    filePath: '/documents/civil-litigation-templates.pdf',
  },
];

async function main() {
  console.log('🌱 Seeding documents...');

  for (const doc of documents) {
    const result = await prisma.document.upsert({
      where: { slug: doc.slug },
      update: {
        title: doc.title,
        category: doc.category,
        previewText: doc.previewText,
        price: doc.price,
        filePath: doc.filePath,
        status: 'active',
      },
      create: {
        title: doc.title,
        slug: doc.slug,
        category: doc.category,
        previewText: doc.previewText,
        price: doc.price,
        filePath: doc.filePath,
        status: 'active',
      },
    });
    console.log(`  ✅ ${result.title} (${result.slug})`);
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
