import ICreateProfileDTO from "@modules/profiles/dtos/ICreateProfileDTO";
import IServiceProviderRepository from "@modules/service_providers/repositories/IServiceProviderRepository";
import { users_role_enum } from "@prisma/client";
import { prismaDb } from "@shared/infra/http/server";
import { ServiceProvider } from "../../entities/ServiceProvider";
import { PrismaProfileMapper } from "../mappers/prisma-profile-mapper";

export default class PrismaServiceProviderRepository implements IServiceProviderRepository {
  public async find(): Promise<SaleServiceProvider[] | undefined>{
    const saleServiceProviders = await prismaDb.sales_service_providers.findMany({
      include: {
        provider: true,
        sale: true,
      }
    });



  }
  public async findById(id: string): Promise<SaleServiceProvider | undefined>{

  }
  public async findBySale(sale_id: string): Promise<SaleServiceProvider[]>{

  }
  public async findByProviderId(provider_id: string,listFrom?: 'yesterday' | 'today' | 'tomorrow',): Promise<SaleServiceProvider[]>{

  }
  public async findByProviderAndSaleId(provider_id: string,sale_id: string,): Promise<SaleServiceProvider | undefined>{

  }
  public async create(data: ICreateServiceProviderDTO): Promise<SaleServiceProvider>{

  }
  public async save(saleServiceProvider: SaleServiceProvider): Promise<SaleServiceProvider>{

  }
  public async delete(id: string): Promise<void>{

  }
  public async deleteBySale(sale_id: string): Promise<void>{

  }
}
