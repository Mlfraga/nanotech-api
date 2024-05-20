-- AlterTable
ALTER TABLE "services" ADD COLUMN     "service_group_id" UUID;

-- CreateTable
CREATE TABLE "service_group" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "decription" VARCHAR,
    "image_url" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_7b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "ServiceGroupServices" FOREIGN KEY ("service_group_id") REFERENCES "service_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
