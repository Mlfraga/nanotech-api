-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "sales_production_status_enum" AS ENUM ('TO_DO', 'IN_PROGRESS', 'DONE', 'PENDING');

-- CreateEnum
CREATE TYPE "sales_source_enum" AS ENUM ('NEW', 'USED', 'WORKSHOP');

-- CreateEnum
CREATE TYPE "sales_status_enum" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'FINISHED');

-- CreateEnum
CREATE TYPE "users_pix_key_type_enum" AS ENUM ('CPF', 'PHONE', 'EMAIL', 'RANDOM');

-- CreateEnum
CREATE TYPE "users_role_enum" AS ENUM ('ADMIN', 'MANAGER', 'SELLER', 'NANOTECH_REPRESENTATIVE', 'SERVICE_PROVIDER', 'COMMISSIONER');

-- CreateTable
CREATE TABLE "cars" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "brand" VARCHAR NOT NULL,
    "model" VARCHAR NOT NULL,
    "plate" VARCHAR NOT NULL,
    "color" VARCHAR NOT NULL,
    "person_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "cnpj" VARCHAR NOT NULL,
    "telephone" VARCHAR NOT NULL,
    "client_identifier" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_prices" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "price" DECIMAL NOT NULL,
    "company_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_7cbc4ba57d510b743bd93c57bb5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cpf" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_74278d8812a049233ce41440ac7" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "company_id" UUID,
    "unit_id" UUID,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "client_identifier" SERIAL NOT NULL,
    "request_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availability_date" TIMESTAMP(6) NOT NULL,
    "delivery_date" TIMESTAMP(6) NOT NULL,
    "status" "sales_status_enum" NOT NULL,
    "company_value" DECIMAL NOT NULL,
    "cost_value" DECIMAL NOT NULL,
    "source" "sales_source_enum" NOT NULL,
    "comments" VARCHAR,
    "seller_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "car_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(6),
    "production_status" "sales_production_status_enum",
    "techinical_comments" VARCHAR,
    "partner_external_id" VARCHAR,

    CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_service_providers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "sale_id" UUID NOT NULL,
    "service_provider_profile_id" UUID NOT NULL,
    "date_to_be_done" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_1ffbe41443e90c36b2ea76ced88" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "price" DECIMAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_id" UUID,
    "company_price" DECIMAL,
    "commission_amount" DECIMAL,

    CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_sales" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "company_value" DECIMAL,
    "cost_value" DECIMAL,
    "sale_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commissioner_id" UUID,

    CONSTRAINT "PK_d617fcc5631b91a9f49930582bd" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "telephone" VARCHAR NOT NULL,
    "client_identifier" VARCHAR NOT NULL,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_42e005e82cfebf8cedfccd1a8f0" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "telephone" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" "users_role_enum" NOT NULL,
    "first_login" BOOLEAN NOT NULL DEFAULT true,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pix_key_type" "users_pix_key_type_enum",
    "pix_key" VARCHAR,

    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_numbers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "number" VARCHAR NOT NULL,
    "restricted_to_especific_company" BOOLEAN NOT NULL,
    "company_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_3184795c48abf9c78f9242af057" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_97672ac88f789774dd47f7c8be3" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_fe0bb3f6520ee0469504521e710" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_5a6ebde8aed3a963a5d1ece93a8" ON "whatsapp_numbers"("number");

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "PersonCar" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_prices" ADD CONSTRAINT "CompanyPrices" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_prices" ADD CONSTRAINT "ServicePrices" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "CompanyProfile" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "UnitProfile" FOREIGN KEY ("unit_id") REFERENCES "unities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "UserProfile" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "CarSale" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "PersonSale" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "SellerSale" FOREIGN KEY ("seller_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "UnitSale" FOREIGN KEY ("unit_id") REFERENCES "unities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_service_providers" ADD CONSTRAINT "ServiceProvider" FOREIGN KEY ("service_provider_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_service_providers" ADD CONSTRAINT "ServiceProviderSale" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "CompanyServices" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_sales" ADD CONSTRAINT "ServiceSaleCommissioner" FOREIGN KEY ("commissioner_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unities" ADD CONSTRAINT "CompanyUnit" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_numbers" ADD CONSTRAINT "CompanyWhatsappNumbers" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

