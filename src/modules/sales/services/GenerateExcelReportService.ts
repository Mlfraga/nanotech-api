import { endOfDay, startOfDay } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IServiceProviderRepository from '@modules/service_providers/repositories/IServiceProviderRepository';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

import ISaleRepository from '../repositories/ISaleRepository';

interface IGenerateExcelReportServiceParams {
  company?: string;
  initialDate?: Date;
  finalDate?: Date;
  status: string;
}

@injectable()
class GenerateExcelReportService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('ServiceProviderRepository')
    private serviceProviderRepository: IServiceProviderRepository,

    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    company,
    initialDate,
    finalDate,
    status,
  }: IGenerateExcelReportServiceParams): Promise<boolean> {
    // const sales = await this.saleRepository.filter({
    //   status: status && String(status),
    //   company: company && String(company),
    //   initialDate: initialDate
    //     ? startOfDay(new Date(String(initialDate)))
    //     : undefined,
    //   finalDate: finalDate ? endOfDay(new Date(String(finalDate))) : undefined,
    // });

    return true;
  }
}

export default GenerateExcelReportService;
