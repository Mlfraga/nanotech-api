import { injectable, inject } from 'tsyringe';

import IServiceProviderRepository from '../../../repositories/IServiceProviderRepository';

interface IListProvidersBySaleServiceResponse {
  date_to_be_done: Date | undefined;
  providers: { id: string; name: string }[];
  techinical_comments: string | undefined;
}

@injectable()
class ListProvidersBySaleService {
  constructor(
    @inject('ServiceProviderRepository')
    private serviceProviderRepository: IServiceProviderRepository,
  ) {}

  public async execute(
    sale_id: string,
  ): Promise<IListProvidersBySaleServiceResponse> {
    const serviceSalesProviders =
      await this.serviceProviderRepository.findBySale(sale_id);

    const formattedResponse = {
      date_to_be_done:
        serviceSalesProviders?.length > 0
          ? serviceSalesProviders[0].date_to_be_done
          : undefined,
      providers: serviceSalesProviders?.map(provider => ({
        id: provider.provider.id,
        name: provider.provider.name,
      })),
      techinical_comments:
        serviceSalesProviders?.length > 0
          ? serviceSalesProviders[0].sale.techinical_comments
          : undefined,
    };

    return formattedResponse;
  }
}

export default ListProvidersBySaleService;
