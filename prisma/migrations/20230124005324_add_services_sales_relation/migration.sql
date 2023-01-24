/*
  Warnings:

  - You are about to drop the column `salesId` on the `services_sales` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "services_sales" DROP CONSTRAINT "services_sales_salesId_fkey";

-- AlterTable
ALTER TABLE "services_sales" DROP COLUMN "salesId";

-- AddForeignKey
ALTER TABLE "services_sales" ADD CONSTRAINT "services_sales_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
