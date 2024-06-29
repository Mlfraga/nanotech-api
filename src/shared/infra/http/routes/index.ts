import express from 'express';

import commissionersRouter from '@modules/_legacy_commissioners/infra/http/routes/commissioners.routes';
import companiesRouter from '@modules/companies/infra/http/routes/companies.routes';
import companyPricesRouter from '@modules/company_prices/infra/http/routes/company_prices.routes';
import profileRouter from '@modules/profiles/infra/http/routes/profile.routes';
import salesRouter from '@modules/sales/infra/http/routes/sales.routes';
import servicesRouter from '@modules/services/infra/http/routes/services.routes';
import servicesSalesRouter from '@modules/services_sales/infra/http/routes/services_sales.routes';
import saleServiceProviderRouter from '@modules/service_providers/infra/http/routes/sale_service_providers.routes';
import unitiesRouter from '@modules/unities/infra/http/routes/unities.routes';
import sessionRouter from '@modules/users/infra/http/routes/session.routes';
import userRouter from '@modules/users/infra/http/routes/user.routes';
import whatsappNumbersRouter from '@modules/whatsapp_numbers/infra/http/routes/whatsapp_numbers.routes';
import servicesGroupRouter from '@modules/services/infra/http/routes/services-group.routes';

const routes = express.Router();

routes.get('/', (_request, response) =>
  response.json({
    name: 'Nanotech API',
    version: '1.0.0',
    author: 'https://github.com/Mlfraga',
  }),
);

routes.use('/auth', sessionRouter);

routes.use('/companies', companiesRouter);
routes.use('/units', unitiesRouter);
routes.use('/users', userRouter);
routes.use('/whatsapp-numbers', whatsappNumbersRouter);
routes.use('/service-sale-providers', saleServiceProviderRouter);
routes.use('/profiles', profileRouter);
routes.use('/services', servicesRouter);
routes.use('/company-services', companyPricesRouter);
routes.use('/sales', salesRouter);
routes.use('/service-sales', servicesSalesRouter);
routes.use('/service-groups', servicesGroupRouter);


// LEGACY routes.use('/commissioners', commissionersRouter);


export default routes;
