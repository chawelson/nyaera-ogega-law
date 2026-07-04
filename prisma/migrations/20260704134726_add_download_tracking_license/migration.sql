-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "license_accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token_used" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_email" TEXT;

-- CreateTable
CREATE TABLE "download_logs" (
    "id" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "user_email" TEXT,
    "downloaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "download_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_agreements" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "license_agreements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "download_logs" ADD CONSTRAINT "download_logs_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
