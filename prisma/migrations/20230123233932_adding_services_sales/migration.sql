-- AlterTable
ALTER TABLE "services_sales" ADD COLUMN     "salesId" UUID;

-- AddForeignKey
ALTER TABLE "services_sales" ADD CONSTRAINT "services_sales_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;
