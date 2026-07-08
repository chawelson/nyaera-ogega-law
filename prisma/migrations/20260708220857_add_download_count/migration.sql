-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "download_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "max_downloads" INTEGER NOT NULL DEFAULT 3;
