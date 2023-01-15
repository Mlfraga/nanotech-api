import ICreateCompanyDTO from "@modules/companies/dtos/ICreateCompanyDTO";
import ICompanyRepository from "@modules/companies/repositories/ICompanyRepository";
import { Prisma, PrismaClient } from '@prisma/client'
import { Company } from "../../entities/Company";
import { PrismaCompanyMapper } from "../mappers/prisma-company-mapper";

export default class PrismaCompaniesRepository implements ICompanyRepository {
  public async find(): Promise<Company[]> {
    const prisma = new PrismaClient()

    const companies = await prisma.companies.findMany({
      include: {unities: true}
    });

    const formattedCompanies = companies.map(company => PrismaCompanyMapper.toDomain(company));

    return formattedCompanies;
  }

  public async findById(id: string): Promise<Company | undefined> {
    const prisma = new PrismaClient()

    const company = await prisma.companies.findUnique({
      where: {
        id,
      },
      include: {unities: true}
    });

    if(!company) {
      return undefined;
    }

    const formattedCompany = PrismaCompanyMapper.toDomain(company)

    return formattedCompany;
  }

  public async create(data: ICreateCompanyDTO): Promise<Company> {
    const prisma = new PrismaClient()

    const company = await prisma.companies.create({
      data,
      include: {unities: true}
    });

    const formattedCompany = PrismaCompanyMapper.toDomain(company);

    return formattedCompany;
  }

  public async save(company: Company): Promise<Company> {
    const prisma = new PrismaClient()

    const updatedCompany = await prisma.companies.update({
      where: {
        id: company.id,
      },
      data: PrismaCompanyMapper.toPrisma(company),
      include: {unities: true}
    });

    const formattedCompany = PrismaCompanyMapper.toDomain(updatedCompany);

    return formattedCompany;
  }

  public async delete(id: string): Promise<void> {
    const prisma = new PrismaClient()

    prisma.companies.delete({where: {id}});
  }

  public async findByCnpj(cnpj: string): Promise<Company | undefined>{
    const prisma = new PrismaClient()

    const company = await prisma.companies.findFirst({
      where: {
        cnpj,
      },
      include: {unities: true}
    });

    if(!company) {
      return undefined;
    }

    const formattedCompany = PrismaCompanyMapper.toDomain(company)

    return formattedCompany;
  }

  public async findByName(name: string): Promise<Company | undefined>{
    const prisma = new PrismaClient()

    const company = await prisma.companies.findFirst({
      where: {
        name,
      },
      include: {unities: true}
    });

    if(!company) {
      return undefined;
    }

    const formattedCompany = PrismaCompanyMapper.toDomain(company)

    return formattedCompany;
  }
}
