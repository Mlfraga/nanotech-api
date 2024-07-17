-- AlterTable
ALTER TABLE "service_group" ADD COLUMN     "category_id" UUID;

-- CreateTable
CREATE TABLE "service_group_categories" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_7b3b3b3b3b3b3b3b3b3b3b3b3b4bb3" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_group" ADD CONSTRAINT "ServiceGroupCategory" FOREIGN KEY ("category_id") REFERENCES "service_group_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
