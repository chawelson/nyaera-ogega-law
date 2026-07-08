-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "admin_notes" TEXT,
ADD COLUMN     "client_instructions" TEXT,
ADD COLUMN     "document_status" TEXT NOT NULL DEFAULT 'pending';
