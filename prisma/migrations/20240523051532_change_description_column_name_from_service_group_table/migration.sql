/*
  Warnings:

  - You are about to drop the column `decription` on the `service_group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service_group" DROP COLUMN "decription",
ADD COLUMN     "description" VARCHAR;
