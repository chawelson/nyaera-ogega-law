import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Helper to generate preview text ─────────────────────────────────
function previewText(docType: string): string {
  return `Professionally drafted ${docType} by Nyaera Ogega & Co. Advocates. Contact us for more details.`;
}

// ── 1. PERSONAL & FAMILY ────────────────────────────────────────────
const personalFamily = [
  { title: 'Will (Simple)', slug: 'will-simple', price: 7500 },
  { title: 'Lasting/General Power of Attorney', slug: 'lasting-power-of-attorney', price: 8000 },
  { title: 'Affidavit', slug: 'affidavit', price: 2500 },
  { title: 'Statutory Declaration', slug: 'statutory-declaration', price: 2500 },
  { title: 'Deed Poll (Change of Name)', slug: 'deed-poll-change-of-name', price: 8000 },
  { title: 'Prenuptial Agreement', slug: 'prenuptial-agreement', price: 10000 },
  { title: 'Cohabitation Agreement', slug: 'cohabitation-agreement', price: 7500 },
  { title: 'Separation Agreement', slug: 'separation-agreement', price: 10000 },
  { title: 'Child Maintenance Agreement', slug: 'child-maintenance-agreement', price: 6000 },
  { title: 'Guardianship Consent', slug: 'guardianship-consent', price: 3000 },
];

// ── 2. PROPERTY & LAND ──────────────────────────────────────────────
const propertyLand = [
  { title: 'Sale Agreement (Land)', slug: 'sale-agreement-land', price: 10000 },
  { title: 'Lease Agreement', slug: 'lease-agreement', price: 8000 },
  { title: 'Tenancy Agreement', slug: 'tenancy-agreement', price: 4000 },
  { title: 'Land Transfer Forms', slug: 'land-transfer-forms', price: 5000 },
  { title: 'Gift Deed', slug: 'gift-deed', price: 7000 },
  { title: 'Declaration of Trust', slug: 'declaration-of-trust', price: 8000 },
  { title: 'Boundary Agreement', slug: 'boundary-agreement', price: 8000 },
  { title: 'Vacant Possession Agreement', slug: 'vacant-possession-agreement', price: 5000 },
  { title: 'Consent to Transfer', slug: 'consent-to-transfer', price: 4000 },
  { title: 'Land Search Report', slug: 'land-search-report', price: 2500 },
];

// ── 3. EMPLOYMENT ───────────────────────────────────────────────────
const employment = [
  { title: 'Employment Contract', slug: 'employment-contract', price: 5000 },
  { title: 'Consultancy Agreement', slug: 'consultancy-agreement', price: 5000 },
  { title: 'Independent Contractor Agreement', slug: 'independent-contractor-agreement', price: 5000 },
  { title: 'Internship Agreement', slug: 'internship-agreement', price: 4000 },
  { title: 'Non-Disclosure Agreement (NDA)', slug: 'non-disclosure-agreement-nda', price: 4000 },
  { title: 'Non-Compete Agreement', slug: 'non-compete-agreement', price: 5000 },
  { title: 'Warning Letter', slug: 'warning-letter', price: 3000 },
  { title: 'Termination Letter', slug: 'termination-letter', price: 3500 },
  { title: 'Certificate of Service', slug: 'certificate-of-service', price: 2500 },
];

// ── 4. BUSINESS ─────────────────────────────────────────────────────
const business = [
  { title: 'Partnership Agreement', slug: 'partnership-agreement', price: 8000 },
  { title: "Shareholders' Agreement", slug: 'shareholders-agreement', price: 10000 },
  { title: 'Memorandum of Understanding (MOU)', slug: 'memorandum-of-understanding-mou', price: 5000 },
  { title: 'Service Agreement', slug: 'service-agreement', price: 5000 },
  { title: 'Supply Agreement', slug: 'supply-agreement', price: 7000 },
  { title: 'Agency Agreement', slug: 'agency-agreement', price: 6000 },
  { title: 'Distribution Agreement', slug: 'distribution-agreement', price: 8000 },
  { title: 'Loan Agreement', slug: 'loan-agreement', price: 6000 },
  { title: 'Promissory Note', slug: 'promissory-note', price: 4000 },
  { title: 'Debt Acknowledgment Agreement', slug: 'debt-acknowledgment-agreement', price: 4000 },
  { title: 'Board Resolution', slug: 'board-resolution', price: 3000 },
  { title: 'Company Resolution', slug: 'company-resolution', price: 3000 },
  { title: 'Minutes of Meetings', slug: 'minutes-of-meetings', price: 3500 },
];

// ── 5. MONEY & DEBT ─────────────────────────────────────────────────
const moneyDebt = [
  { title: 'Demand Letter', slug: 'demand-letter', price: 3000 },
  { title: 'Payment Agreement', slug: 'payment-agreement', price: 5000 },
  { title: 'Debt Settlement Agreement', slug: 'debt-settlement-agreement', price: 6000 },
  { title: 'Acknowledgment of Debt', slug: 'acknowledgment-of-debt', price: 4000 },
  { title: 'Guarantor Agreement', slug: 'guarantor-agreement', price: 5000 },
  { title: 'Loan Security Agreement', slug: 'loan-security-agreement', price: 8000 },
];

// ── 6. COURT & DISPUTES ─────────────────────────────────────────────
const courtDisputes = [
  { title: 'Plaint', slug: 'plaint', price: 8000 },
  { title: 'Amended Plaint', slug: 'amended-plaint', price: 7000 },
  { title: 'Statement of Defence', slug: 'statement-of-defence', price: 8000 },
  { title: 'Amended Defence', slug: 'amended-defence', price: 7000 },
  { title: 'Defence and Counterclaim', slug: 'defence-and-counterclaim', price: 10000 },
  { title: 'Reply to Defence', slug: 'reply-to-defence', price: 5000 },
  { title: 'Reply to Defence and Defence to Counterclaim', slug: 'reply-to-defence-and-defence-to-counterclaim', price: 8000 },
  { title: 'Originating Summons', slug: 'originating-summons', price: 8000 },
  { title: 'Chamber Summons', slug: 'chamber-summons', price: 5000 },
  { title: 'Notice of Motion', slug: 'notice-of-motion', price: 5000 },
  { title: 'Certificate of Urgency', slug: 'certificate-of-urgency', price: 5000 },
  { title: 'Grounds of Opposition', slug: 'grounds-of-opposition', price: 5000 },
  { title: 'Preliminary Objection (Points of Law)', slug: 'preliminary-objection-points-of-law', price: 5000 },
  { title: 'Preliminary Objection (Points of Law & Fact)', slug: 'preliminary-objection-points-of-law-fact', price: 6000 },
  { title: 'Notice of Appointment of Advocate', slug: 'notice-of-appointment-of-advocate', price: 3000 },
  { title: 'Notice of Change of Advocates', slug: 'notice-of-change-of-advocates', price: 3000 },
  { title: 'Notice to Act in Person', slug: 'notice-to-act-in-person', price: 3000 },
  { title: 'Demand Notice', slug: 'demand-notice', price: 3000 },
  { title: 'Notice of Intention to Sue', slug: 'notice-of-intention-to-sue', price: 3000 },
  { title: 'Written Submissions', slug: 'written-submissions', price: 8000 },
  { title: 'Supplementary Written Submissions', slug: 'supplementary-written-submissions', price: 5000 },
  { title: 'List of Documents', slug: 'list-of-documents', price: 2500 },
  { title: 'Supplementary List of Documents', slug: 'supplementary-list-of-documents', price: 3000 },
  { title: 'Further List of Documents', slug: 'further-list-of-documents', price: 3000 },
  { title: 'Paginated Bundle/List of Documents', slug: 'paginated-bundle-list-of-documents', price: 3500 },
  { title: 'Witness Statement', slug: 'witness-statement', price: 3500 },
  { title: 'Witness Statement with Annexures', slug: 'witness-statement-with-annexures', price: 5000 },
  { title: 'Further Witness Statement', slug: 'further-witness-statement', price: 3500 },
  { title: 'List of Witnesses', slug: 'list-of-witnesses', price: 2500 },
  { title: 'List of Authorities', slug: 'list-of-authorities', price: 2500 },
  { title: 'Affidavit (Court)', slug: 'affidavit-court', price: 2500 },
  { title: 'Supporting Affidavit', slug: 'supporting-affidavit', price: 2500 },
  { title: 'Replying Affidavit', slug: 'replying-affidavit', price: 5000 },
  { title: 'Supplementary Affidavit', slug: 'supplementary-affidavit', price: 5000 },
  { title: 'Further Affidavit', slug: 'further-affidavit', price: 5000 },
  { title: 'Verifying Affidavit', slug: 'verifying-affidavit', price: 2500 },
  { title: 'Company Verifying Affidavit', slug: 'company-verifying-affidavit', price: 3000 },
  { title: 'Statutory Declaration (Court)', slug: 'statutory-declaration-court', price: 2500 },
  { title: 'Consent (Court)', slug: 'consent-court', price: 2500 },
  { title: 'Consent Order', slug: 'consent-order', price: 3500 },
  { title: 'Notice to Produce', slug: 'notice-to-produce', price: 3000 },
  { title: 'Notice to Admit Facts', slug: 'notice-to-admit-facts', price: 3000 },
  { title: 'Notice to Admit Documents', slug: 'notice-to-admit-documents', price: 3000 },
  { title: 'Request for Particulars', slug: 'request-for-particulars', price: 3500 },
  { title: 'Reply to Request for Particulars', slug: 'reply-to-request-for-particulars', price: 3500 },
  { title: 'Notice of Withdrawal', slug: 'notice-of-withdrawal', price: 3000 },
  { title: 'Draft Decree/Order', slug: 'draft-decree-order', price: 3500 },
  { title: 'Extraction of Decree/Order', slug: 'extraction-of-decree-order', price: 3500 },
  { title: 'Notice to Show Cause Response', slug: 'notice-to-show-cause-response', price: 5000 },
  { title: 'Bill of Costs', slug: 'bill-of-costs', price: 8000 },
  { title: 'Party and Party Bill of Costs', slug: 'party-and-party-bill-of-costs', price: 8000 },
  { title: 'Advocate-Client Bill of Costs', slug: 'advocate-client-bill-of-costs', price: 10000 },
  { title: 'Notice of Taxation', slug: 'notice-of-taxation', price: 3500 },
  { title: 'Notice of Appeal', slug: 'notice-of-appeal', price: 5000 },
  { title: 'Memorandum of Appeal', slug: 'memorandum-of-appeal', price: 8000 },
  { title: 'Record of Appeal', slug: 'record-of-appeal', price: 10000 },
  { title: 'Application for Stay of Execution', slug: 'application-for-stay-of-execution', price: 8000 },
  { title: 'Application for Review', slug: 'application-for-review', price: 8000 },
  { title: 'Application to Set Aside Judgment', slug: 'application-to-set-aside-judgment', price: 8000 },
  { title: 'Application for Leave', slug: 'application-for-leave', price: 6000 },
  { title: 'Skeleton Arguments', slug: 'skeleton-arguments', price: 5000 },
];

// ── 7. MARRIAGE & SUCCESSION ────────────────────────────────────────
const marriageSuccession = [
  { title: 'Marriage Certificate Assistance', slug: 'marriage-certificate-assistance', price: 2500 },
  { title: 'Divorce Petition', slug: 'divorce-petition', price: 10000 },
  { title: 'Consent to Divorce', slug: 'consent-to-divorce', price: 5000 },
  { title: 'Petition for Letters of Administration', slug: 'petition-for-letters-of-administration', price: 10000 },
  { title: 'Grant of Probate', slug: 'grant-of-probate', price: 10000 },
  { title: 'Family Consent', slug: 'family-consent', price: 3000 },
  { title: 'Consent to Distribution', slug: 'consent-to-distribution', price: 5000 },
  { title: 'Inventory of Assets', slug: 'inventory-of-assets', price: 5000 },
];

// ── 8. MOTOR VEHICLES ───────────────────────────────────────────────
const motorVehicles = [
  { title: 'Motor Vehicle Sale Agreement', slug: 'motor-vehicle-sale-agreement', price: 5000 },
  { title: 'Transfer Forms (Motor Vehicle)', slug: 'motor-vehicle-transfer-forms', price: 3000 },
  { title: 'Logbook Transfer Documents', slug: 'logbook-transfer-documents', price: 3000 },
  { title: 'Hire Purchase Agreement', slug: 'hire-purchase-agreement', price: 8000 },
];

// ── 9. DIGITAL & INTELLECTUAL PROPERTY ──────────────────────────────
const digitalIP = [
  { title: 'Website Terms & Conditions', slug: 'website-terms-and-conditions', price: 8000 },
  { title: 'Privacy Policy', slug: 'privacy-policy', price: 7500 },
  { title: 'Copyright Assignment', slug: 'copyright-assignment', price: 5000 },
  { title: 'Software Development Agreement', slug: 'software-development-agreement', price: 10000 },
  { title: 'Social Media Management Agreement', slug: 'social-media-management-agreement', price: 5000 },
];

// ── 10. EVERYDAY DOCUMENTS ──────────────────────────────────────────
const everydayDocs = [
  { title: 'Authority Letter', slug: 'authority-letter', price: 2500 },
  { title: 'Consent Letter', slug: 'consent-letter', price: 2500 },
  { title: 'Invitation Letter', slug: 'invitation-letter', price: 2500 },
  { title: 'Demand Letter (Everyday)', slug: 'demand-letter-everyday', price: 3000 },
  { title: 'Affidavit for Lost Documents', slug: 'affidavit-for-lost-documents', price: 2500 },
  { title: 'Affidavit of Identity', slug: 'affidavit-of-identity', price: 2500 },
  { title: 'Affidavit of Marital Status', slug: 'affidavit-of-marital-status', price: 2500 },
  { title: 'Sworn Statement', slug: 'sworn-statement', price: 2500 },
  { title: 'Declaration of Dependants', slug: 'declaration-of-dependants', price: 2500 },
  { title: 'Next of Kin Declaration', slug: 'next-of-kin-declaration', price: 2500 },
];

// ── 11. ADVOCATE STAMPS ─────────────────────────────────────────────
const advocateStamps = [
  { title: 'Advocate Office Stamp', slug: 'advocate-office-stamp', price: 500 },
  { title: 'Commissioner for Oaths Stamp', slug: 'commissioner-for-oaths-stamp', price: 1000 },
  { title: 'Notary Public Stamp', slug: 'notary-public-stamp', price: 2500 },
  { title: 'Annexure Stamp', slug: 'annexure-stamp', price: 500 },
  { title: 'Certified True Copy Stamp', slug: 'certified-true-copy-stamp', price: 1000 },
  { title: 'Received Stamp', slug: 'received-stamp', price: 500 },
  { title: 'Paid Stamp', slug: 'paid-stamp', price: 500 },
  { title: 'Confidential Stamp', slug: 'confidential-stamp', price: 500 },
  { title: 'Without Prejudice Stamp', slug: 'without-prejudice-stamp', price: 500 },
  { title: 'Witnessing/Execution Stamp', slug: 'witnessing-execution-stamp', price: 1000 },
];

// ── All documents with categories ───────────────────────────────────
const allDocuments: Array<{
  title: string;
  slug: string;
  category: string;
  price: number;
}> = [
  // 1. Personal & Family
  ...personalFamily.map((d) => ({ ...d, category: 'Personal & Family' })),
  // 2. Property & Land
  ...propertyLand.map((d) => ({ ...d, category: 'Property & Land' })),
  // 3. Employment
  ...employment.map((d) => ({ ...d, category: 'Employment' })),
  // 4. Business
  ...business.map((d) => ({ ...d, category: 'Business' })),
  // 5. Money & Debt
  ...moneyDebt.map((d) => ({ ...d, category: 'Money & Debt' })),
  // 6. Court & Disputes
  ...courtDisputes.map((d) => ({ ...d, category: 'Court & Disputes' })),
  // 7. Marriage & Succession
  ...marriageSuccession.map((d) => ({ ...d, category: 'Marriage & Succession' })),
  // 8. Motor Vehicles
  ...motorVehicles.map((d) => ({ ...d, category: 'Motor Vehicles' })),
  // 9. Digital & Intellectual Property
  ...digitalIP.map((d) => ({ ...d, category: 'Digital & IP' })),
  // 10. Everyday Documents
  ...everydayDocs.map((d) => ({ ...d, category: 'Everyday Documents' })),
  // 11. Advocate Stamps
  ...advocateStamps.map((d) => ({ ...d, category: 'Advocate Stamps' })),
];

async function main() {
  console.log('🌱 Seeding Sharon\'s complete document catalogue...');
  console.log(`   Total documents to seed: ${allDocuments.length}`);

  for (const doc of allDocuments) {
    const result = await prisma.document.upsert({
      where: { slug: doc.slug },
      update: {
        title: doc.title,
        category: doc.category,
        previewText: previewText(doc.title),
        price: doc.price,
        filePath: '/documents/placeholder.pdf',
        status: 'active',
      },
      create: {
        title: doc.title,
        slug: doc.slug,
        category: doc.category,
        previewText: previewText(doc.title),
        price: doc.price,
        filePath: '/documents/placeholder.pdf',
        status: 'active',
      },
    });

    console.log(`  ${result.title} (${result.slug}) — KES ${result.price.toLocaleString('en-KE')}`);
  }

  console.log('');
  console.log('🌱 Seeding complete!');
  console.log(`   Total documents: ${allDocuments.length}`);
  console.log('');
  console.log('📂 Categories seeded:');
  const categories = [...new Set(allDocuments.map((d) => d.category))];
  categories.forEach((cat) => {
    const count = allDocuments.filter((d) => d.category === cat).length;
    console.log(`   • ${cat}: ${count} documents`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
