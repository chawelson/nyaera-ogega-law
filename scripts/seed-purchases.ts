/**
 * Seed Script: Add 3 test purchases to the database
 *
 * Run with: npx tsx scripts/seed-purchases.ts
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 48);
  return expiry;
}

const purchases = [
  {
    slug: 'sale-agreement-land-property-transfer',
    email: 'joshchawelson@gmail.com',
    phone: '254708374149',
    amount: 2500,
    token: 'test-token-1',
  },
  {
    slug: 'employment-contract-permanent-fixed-term',
    email: 'joshchawelson@gmail.com',
    phone: '254708374149',
    amount: 1800,
    token: 'test-token-2',
  },
  {
    slug: 'lease-agreement-commercial-residential',
    email: 'joshchawelson@gmail.com',
    phone: '254708374149',
    amount: 2000,
    token: 'test-token-3',
  },
];

async function main() {
  console.log('🌱 Seeding test purchases...\n');

  for (const purchase of purchases) {
    // Find the document by slug
    const document = await prisma.document.findUnique({
      where: { slug: purchase.slug },
    });

    if (!document) {
      console.error(`  ❌ Document not found for slug: ${purchase.slug}`);
      continue;
    }

    // Upsert the purchase (use token as unique identifier to avoid duplicates)
    const result = await prisma.purchase.upsert({
      where: { downloadToken: purchase.token },
      update: {
        documentId: document.id,
        userEmail: purchase.email,
        userPhone: purchase.phone,
        amount: purchase.amount,
        status: 'completed',
        checkoutId: `seed-${purchase.token}`,
        tokenExpiry: getTokenExpiry(),
        tokenUsed: false,
        licenseAccepted: true,
      },
      create: {
        documentId: document.id,
        userEmail: purchase.email,
        userPhone: purchase.phone,
        amount: purchase.amount,
        status: 'completed',
        checkoutId: `seed-${purchase.token}`,
        downloadToken: purchase.token,
        tokenExpiry: getTokenExpiry(),
        tokenUsed: false,
        licenseAccepted: true,
      },
    });

    console.log(`  ✅ ${document.title} — KES ${purchase.amount}`);
    console.log(`     Token: ${purchase.token}`);
    console.log(`     Expiry: ${result.tokenExpiry?.toISOString()}`);
    console.log(`     Status: ${result.status}\n`);
  }

  console.log('🌱 Seeding complete! 3 test purchases created.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
