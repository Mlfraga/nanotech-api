import ICreateSaleDTO from "@modules/sales/dtos/ICreateSaleDTO";
import ISaleRepository, { IFilters, IFiltersParams, IPaginatedSalesResponse } from "@modules/sales/repositories/ISaleRepository";
import { sales_production_status_enum, sales_source_enum, sales_status_enum } from "@prisma/client";
import { prismaDb } from "@shared/infra/http/server";
import { Sale } from "../../entities/Sale";
import { PrismaSaleMapper } from "../mappers/prisma-sale-mapper";

export default class PrismaSaleRepository implements ISaleRepository {
  public async find(): Promise<Sale[] | undefined>{
    const sales = await prismaDb.sales.findMany({
      orderBy: {
        created_at: 'asc',
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    return sales.map(sale => {
      return PrismaSaleMapper.toDomain(sale);
    })
  }

  public async findById(id: string): Promise<Sale | undefined>{
    const sale = await prismaDb.sales.findUnique({
      where: {
        id,
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    if(!sale) {
      return undefined;
    }

    return PrismaSaleMapper.toDomain(sale);
  }

  public async create(data: ICreateSaleDTO): Promise<Sale>{
    const created = await prismaDb.sales.create({
      data: {
        ...data,
        status: "PENDING",
        production_status: "TO_DO",
        source: data.source as sales_source_enum,
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    return PrismaSaleMapper.toDomain(created);
  }

  public async save(sale: Sale): Promise<Sale>{
    const updatedSale = await prismaDb.sales.update({
      where: {
        id: sale.id,
      },
      data: {
        availability_date: sale.availability_date,
        delivery_date: sale.delivery_date,
        car_id: sale.car_id,
        person_id: sale.person_id,
        client_identifier: Number(sale.client_identifier),
        comments: sale.comments,
        company_value: sale.company_value,
        cost_value: sale.cost_value,
        created_at: sale.created_at,
        finished_at: sale.finished_at,
        request_date: sale.request_date,
        seller_id: sale.seller_id,
        updated_at: new Date(),
        status: sale.status as sales_status_enum,
        production_status: sale.production_status as sales_production_status_enum,
        source: sale.source as sales_source_enum,
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    const formattedSale = PrismaSaleMapper.toDomain(updatedSale);

    return formattedSale;
  }

  public async filter({
    status,
    company,
    initialDate,
    finalDate,
  }: IFiltersParams): Promise<Sale[] | undefined>{
    const sales = await prismaDb.sales.findMany({
      where: {
        ...(status && { status: status as sales_status_enum }),
        ...(company && { company_id: company }),
        ...(initialDate && finalDate && {
          finished_at: {
            lte: initialDate,
            gte: finalDate,
          }
        }),
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    const formattedSales = sales.map(sale => {
      return PrismaSaleMapper.toDomain(sale);
    });

    return formattedSales;
  }

  public async findByServiceProvider(providerId: string): Promise<Sale[]>{
    const sales = await prismaDb.sales.findMany({
      where: {
        sales_service_providers: {
          some: {
            id: providerId,
          }
        }
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    const formattedSales = sales.map(sale => {
      return PrismaSaleMapper.toDomain(sale);
    });

    return formattedSales;
  }

  public async findByCompanyAndFinishedStatus(
    companyId: string,
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
    }: IFilters,
  ): Promise<IPaginatedSalesResponse>{
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const count = await prismaDb.sales.count({
      where: {
        ...(companyId && {profiles: {
          company_id: companyId,
        }}),
        ...(status && {status: status as sales_status_enum}),
        ...(initialDeliveryDate && finalDeliveryDate && {
          finished_at: {
            lte: initialDeliveryDate,
            gte: finalDeliveryDate,
          }
        }),
        ...(initialAvailabilityDate && finalAvailabilityDate && {
          availability_date: {
            lte: initialAvailabilityDate,
            gte: finalAvailabilityDate,
          }
        }),
      },
    });

    const sales = await prismaDb.sales.findMany({
      skip: offset,
      take: limit_per_page,
      orderBy: {request_date: "desc"},
      where: {
        ...(companyId && {profiles: {
          company_id: companyId,
        }}),
        ...(status && {status: status as sales_status_enum}),
        ...(initialDeliveryDate && finalDeliveryDate && {
          finished_at: {
            lte: initialDeliveryDate,
            gte: finalDeliveryDate,
          }
        }),
        ...(initialAvailabilityDate && finalAvailabilityDate && {
          availability_date: {
            lte: initialAvailabilityDate,
            gte: finalAvailabilityDate,
          }
        }),
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    const formattedSales = sales.map(sale => {
      return PrismaSaleMapper.toDomain(sale);
    });

    return {
      current_page: page,
      total_pages: Math.floor(count / limit_per_page),
      total_items: count,
      total_items_page: formattedSales.length,
      items: formattedSales,
    };
  }

  public async findAllSales(
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
      sellerId,
    }: IFilters,
  ): Promise<IPaginatedSalesResponse> {
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const count = await prismaDb.sales.count({
      where: {
        ...(sellerId && {seller_id: sellerId}),
        ...(status && {status: status as sales_status_enum}),
        ...(initialDeliveryDate && finalDeliveryDate && {
          finished_at: {
            lte: initialDeliveryDate,
            gte: finalDeliveryDate,
          }
        }),
        ...(initialAvailabilityDate && finalAvailabilityDate && {
          availability_date: {
            lte: initialAvailabilityDate,
            gte: finalAvailabilityDate,
          }
        }),
      },
    });

    const sales = await prismaDb.sales.findMany({
      skip: offset,
      take: limit_per_page,
      orderBy: {request_date: "desc"},
      where: {
        ...(sellerId && {seller_id: sellerId}),
        ...(status && {status: status as sales_status_enum}),
        ...(initialDeliveryDate && finalDeliveryDate && {
          finished_at: {
            lte: initialDeliveryDate,
            gte: finalDeliveryDate,
          }
        }),
        ...(initialAvailabilityDate && finalAvailabilityDate && {
          availability_date: {
            lte: initialAvailabilityDate,
            gte: finalAvailabilityDate,
          }
        }),
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    const formattedSales = sales.map(sale => {
      return PrismaSaleMapper.toDomain(sale);
    });

    return {
      current_page: page,
      total_pages: Math.floor(count / limit_per_page),
      total_items: count,
      total_items_page: formattedSales.length,
      items: formattedSales,
    };
  }

  public async findBySeller(
    sellerId: string,
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
    }: IFilters,
  ): Promise<IPaginatedSalesResponse> {
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const count = await prismaDb.sales.count({
      where: {
        ...(sellerId && {seller_id: sellerId}),
        ...(status && {status: status as sales_status_enum}),
        ...(initialDeliveryDate && finalDeliveryDate && {
          finished_at: {
            lte: initialDeliveryDate,
            gte: finalDeliveryDate,
          }
        }),
        ...(initialAvailabilityDate && finalAvailabilityDate && {
          availability_date: {
            lte: initialAvailabilityDate,
            gte: finalAvailabilityDate,
          }
        }),
      },
    });

    const sales = await prismaDb.sales.findMany({
      skip: offset,
      take: limit_per_page,
      orderBy: {request_date: "desc"},
      where: {
        ...(sellerId && {seller_id: sellerId}),
        ...(status && {status: status as sales_status_enum}),
        ...(initialDeliveryDate && finalDeliveryDate && {
          finished_at: {
            lte: initialDeliveryDate,
            gte: finalDeliveryDate,
          }
        }),
        ...(initialAvailabilityDate && finalAvailabilityDate && {
          availability_date: {
            lte: initialAvailabilityDate,
            gte: finalAvailabilityDate,
          }
        }),
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    const formattedSales = sales.map(sale => {
      return PrismaSaleMapper.toDomain(sale);
    });

    return {
      current_page: page,
      total_pages: Math.floor(count / limit_per_page),
      total_items: count,
      total_items_page: formattedSales.length,
      items: formattedSales,
    };
  }

  public async findByDateAndStatus(
    page: number,
    deliveryDateInitialDay: Date,
    deliveryDateFinalDay: Date,
    availabilityDateInitialDay: Date,
    availabilityDateFinalDay: Date,
    status: string,
  ): Promise<IPaginatedSalesResponse>{
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const count = await prismaDb.sales.count({
      where: {
        ...(status && {status: status as sales_status_enum}),
        ...(deliveryDateInitialDay && deliveryDateFinalDay && {
          finished_at: {
            lte: deliveryDateInitialDay,
            gte: deliveryDateFinalDay,
          }
        }),
        ...(availabilityDateInitialDay && availabilityDateFinalDay && {
          availability_date: {
            lte: availabilityDateInitialDay,
            gte: availabilityDateFinalDay,
          }
        }),
      },
    });

    const sales = await prismaDb.sales.findMany({
      skip: offset,
      take: limit_per_page,
      orderBy: {request_date: "desc"},
      where: {
        ...(status && {status: status as sales_status_enum}),
        ...(deliveryDateInitialDay && deliveryDateFinalDay && {
          finished_at: {
            lte: deliveryDateInitialDay,
            gte: deliveryDateFinalDay,
          }
        }),
        ...(availabilityDateInitialDay && availabilityDateFinalDay && {
          availability_date: {
            lte: availabilityDateInitialDay,
            gte: availabilityDateFinalDay,
          }
        }),
      },
      include: {
        profiles: {
          include: {
            companies: true,
            users: true,
          }
        },
        unities: true,
        persons: true,
        cars: true,
        services: {
          include: {
            service: {
              include: {
                companies: true,
              }
            },
          },
        }
      }
    });

    const formattedSales = sales.map(sale => {
      return PrismaSaleMapper.toDomain(sale);
    });

    return {
      current_page: page,
      total_pages: Math.floor(count / limit_per_page),
      total_items: count,
      total_items_page: formattedSales.length,
      items: formattedSales,
    };
  }

  public async delete(id: string): Promise<void>{
    await prismaDb.sales.delete({
      where: {id: id},
    });
  }
}
