import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import { ServiceGroup } from '../../entities/ServiceGroup';
import IServiceRepository from '@modules/services/repositories/IServiceRepository';
import IServiceGroupCategoryRepository from '@modules/services/repositories/IServiceGroupCategoryRepository';

interface IRequest {
  name: string;
  defaultNanotechPrice?: number;
  description?: string;
  imageUrl?: string;
  category_id: string;
  companiesToLink: {
    id: string;
    price: number;
    commission: number;
  }[];
}

@injectable()
class CreateServiceGroupService {
  constructor(
    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,

    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,

    @inject('ServiceGroupCategoryRepository')
    private serviceGroupCategoryRepository: IServiceGroupCategoryRepository,
  ) {}

  public async execute({
    name,
    description,
    defaultNanotechPrice,
    imageUrl,
    companiesToLink,
    category_id
  }: IRequest): Promise<ServiceGroup> {
    const categoryExists = await this.serviceGroupCategoryRepository.findById(category_id);

    const createdServiceGroup = await this.serviceGroupRepository.create(new ServiceGroup({
      name,
      description,
      image_url: imageUrl,
      ...(categoryExists && { category_id }),
      enabled: true,
      default_nanotech_price: defaultNanotechPrice
    }));

    for (let company of companiesToLink) {
      await this.serviceRepository.create({
        service_group_id: createdServiceGroup.id,
        name,
        price: company.price,
        commission_amount: company.commission,
        company_id: company.id,
      });
    }

    return createdServiceGroup;
  }
}

export default CreateServiceGroupService;
