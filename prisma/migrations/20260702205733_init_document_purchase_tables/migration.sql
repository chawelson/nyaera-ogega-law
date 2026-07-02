-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "preview_text" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "file_path" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "user_phone" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "checkout_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "download_token" TEXT,
    "token_expiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_slug_key" ON "documents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_checkout_id_key" ON "purchases"("checkout_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_download_token_key" ON "purchases"("download_token");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
