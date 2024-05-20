/*
  Warnings:

  - A unique constraint covering the columns `[client_identifier]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "persons" ADD COLUMN     "phone_number" VARCHAR,
ALTER COLUMN "cpf" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_client_identifier_key" ON "companies"("client_identifier");
