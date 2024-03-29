-- CreateTable
CREATE TABLE "check_in_attachments" (
    "id" TEXT NOT NULL,
    "check_in_id" TEXT NOT NULL,
    "attachment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_in_attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "check_in_attachments" ADD CONSTRAINT "check_in_attachments_check_in_id_fkey" FOREIGN KEY ("check_in_id") REFERENCES "check_ins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in_attachments" ADD CONSTRAINT "check_in_attachments_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
