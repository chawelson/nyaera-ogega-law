-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "buyer_name" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "uploaded_file_path" TEXT;

-- CreateTable
CREATE TABLE "admin_logs" (
    "id" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "admin_name" TEXT NOT NULL DEFAULT 'Admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "admin_logs" ADD CONSTRAINT "admin_logs_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
