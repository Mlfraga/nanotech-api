-- AddForeignKey
ALTER TABLE "services_sales" ADD CONSTRAINT "ServiceSale" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
