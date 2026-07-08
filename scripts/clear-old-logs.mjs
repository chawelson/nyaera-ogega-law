/**
 * Script to clear old download logs and admin logs for clean testing.
 * Run: node scripts/clear-old-logs.mjs
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:aUGhFLcAwxGYaWHhqiDHLGlstZlbuegU@hayabusa.proxy.rlwy.net:54497/railway';

async function clearLogs() {
  console.log('🧹 Clearing old logs for clean testing...');

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    // Delete all download logs
    const deletedDownloadLogs = await prisma.downloadLog.deleteMany({});
    console.log(`✅ Deleted ${deletedDownloadLogs.count} download log(s)`);

    // Delete all admin logs
    const deletedAdminLogs = await prisma.adminLog.deleteMany({});
    console.log(`✅ Deleted ${deletedAdminLogs.count} admin log(s)`);

    // Reset download counts on all purchases
    const resetPurchases = await prisma.purchase.updateMany({
      where: { downloadCount: { gt: 0 } },
      data: { downloadCount: 0 },
    });
    console.log(`✅ Reset download count on ${resetPurchases.count} purchase(s)`);

    console.log('\n✨ All logs cleared. Ready for clean testing!');
  } catch (error) {
    console.error('❌ Failed to clear logs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearLogs();
