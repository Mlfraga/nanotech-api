-- AddForeignKey
ALTER TABLE "services_sales" ADD CONSTRAINT "ServiceSale" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_sales" ADD CONSTRAINT "SaleService" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
