-- CreateTable
CREATE TABLE "customer_shipping_addresses" (
    "id" TEXT NOT NULL,
    "recipient_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "customer_shipping_addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customer_shipping_addresses" ADD CONSTRAINT "customer_shipping_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
