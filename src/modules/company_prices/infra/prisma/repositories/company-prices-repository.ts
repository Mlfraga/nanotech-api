import ICreateCompanyPriceDTO from "@modules/company_prices/dtos/ICreateCompanyPricesDTO";
import ICompanyPriceRepository from "@modules/company_prices/repositories/ICompanyPricesRepository";
import { prismaDb } from "@shared/infra/http/server";
import { CompanyPrice } from "../../entities/CompanyPrice";
import { PrismaCompanyPriceMapper } from "../mappers/prisma-company-prices-mapper";

export default class PrismaCompanyPricesRepository implements ICompanyPriceRepository {
  public async find(): Promise<CompanyPrice[]> {
    const companie_prices = await prismaDb.company_prices.findMany({
      include: {companies: true, services: true,}
    });

    const formattedCompanies = companie_prices.map(companyPrice => PrismaCompanyPriceMapper.toDomain(companyPrice));

    return formattedCompanies;
  }

  public async findById(id: string): Promise<CompanyPrice | undefined> {
    const companyPrice = await prismaDb.company_prices.findUnique({
      where: {
        id,
      },
      include: {companies: true, services: true,}
    });

    if(!companyPrice) {
      return undefined;
    }

    const formattedCompanyPrice = PrismaCompanyPriceMapper.toDomain(companyPrice)

    return formattedCompanyPrice;
  }

  public async findByCompanyIdAndServiceId(
    company_id: string,
    service_id: string,
  ): Promise<CompanyPrice | undefined> {
    const company_price = await prismaDb.company_prices.findFirst({
      where: {
        company_id,
        service_id,
      },
      include: {companies: true, services: true,}
    });

    if(!company_price) {
      return undefined;
    }

    const formattedCompanyPrice =  PrismaCompanyPriceMapper.toDomain(company_price)

    return formattedCompanyPrice;
  }

  public async findByCompanyId(companyId: string): Promise<CompanyPrice[]> {
    const company_prices = await prismaDb.company_prices.findMany({
      where: {
        company_id: companyId,
      },
      include: {companies: true, services: true,}
    });

    const formattedCompaniesPrices = company_prices.map(company_price => PrismaCompanyPriceMapper.toDomain(company_price));

    return formattedCompaniesPrices;
  }

  public async create(data: ICreateCompanyPriceDTO): Promise<CompanyPrice> {
    const company_price = await prismaDb.company_prices.create({
      data,
      include: {companies: true, services: true,}
    });

    const formattedCompanyPrice = PrismaCompanyPriceMapper.toDomain(company_price);

    return formattedCompanyPrice;
  }

  public async save(companyPrice: CompanyPrice): Promise<CompanyPrice> {
    const updatedCompanyPrice = await prismaDb.company_prices.update({
      where: {
        id: companyPrice.id,
      },
      data: PrismaCompanyPriceMapper.toPrisma(companyPrice),
      include: {companies: true, services: true,}
    });

    const formattedCompanyPrice = PrismaCompanyPriceMapper.toDomain(updatedCompanyPrice);

    return formattedCompanyPrice;
  }

  public async delete(id: string): Promise<void> {
    prismaDb.company_prices.delete({where: {id}});
  }
}
