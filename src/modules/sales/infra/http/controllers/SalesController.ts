/* eslint-disable no-continue */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CarRepository from '@modules/cars/infra/typeorm/repositories/CarRepository';
import PersonRepository from '@modules/persons/infra/typeorm/repositories/PersonRepository';
import ListSalesService from '@modules/sales/services/ListSalesService';
import UpdateSaleService from '@modules/sales/services/UpdateSaleService';
import ServiceSaleRepository from '@modules/services_sales/infra/typeorm/repositories/ServiceSaleRepository';
import UnitRepository from '@modules/unities/infra/typeorm/repositories/UnitRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import SaleRepository from '../../typeorm/repositories/SaleRepository';

export default class SalesController {
  async teste(request: Request, response: Response) {
    const { providerId } = request.query;

    const saleRepository = container.resolve(SaleRepository);

    const sales = await saleRepository.findByServiceProvider(
      String(providerId),
    );

    return response.json(sales);
  }

  async index(request: Request, response: Response) {
    const {
      startDeliveryDate,
      endDeliveryDate,
      startAvailabilityDate,
      endAvailabilityDate,
      startFinishedDate,
      endFinishedDate,
      sellerId,
      companyId,
      status,
      page,
    } = request.query;

    const user_id = request.user.id;

    const listSalesService = container.resolve(ListSalesService);

    const sales = await listSalesService.execute({
      user_id,
      filters: {
        ...(startDeliveryDate && {
          startDeliveryDate: new Date(String(startDeliveryDate)),
        }),
        ...(endDeliveryDate && {
          endDeliveryDate: new Date(String(endDeliveryDate)),
        }),
        ...(startAvailabilityDate && {
          startAvailabilityDate: new Date(String(startAvailabilityDate)),
        }),
        ...(endAvailabilityDate && {
          endAvailabilityDate: new Date(String(endAvailabilityDate)),
        }),
        ...(startFinishedDate && {
          startFinishedDate: new Date(String(startFinishedDate)),
        }),
        ...(endFinishedDate && {
          endFinishedDate: new Date(String(endFinishedDate)),
        }),
        ...(sellerId && { sellerId: String(sellerId) }),
        ...(companyId && { companyId: String(companyId) }),
        ...(status && {
          status: status as 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED',
        }),
      },
      page: Number(page),
    });

    return response.json(sales);
  }

  async store(request: Request, response: Response) {
    const saleRepository = container.resolve(SaleRepository);
    const personRepository = container.resolve(PersonRepository);
    const carRepository = container.resolve(CarRepository);
    const unitRepository = container.resolve(UnitRepository);

    const {
      deliveryDate,
      availabilityDate,
      comments,
      companyPrice,
      costPrice,
      source,
      name,
      cpf,
      car,
      carPlate,
      carColor,
      carModel,
      unitId,
    } = request.body;

    const user_id = request.user.id;

    const userRepository = container.resolve(UserRepository);

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const sellerId = user.profile.id;
    const { role } = user;

    if (role !== 'MANAGER' && role !== 'SELLER') {
      throw new AppError('User is not allowed to make sales.');
    }

    if (source !== 'NEW' && source !== 'USED' && source !== 'WORKSHOP') {
      throw new AppError('The source is unavailable.');
    }

    const unitExists = await unitRepository.findById(unitId);

    if (!unitExists) {
      throw new AppError('This unit does not exist.');
    }

    if (unitExists.company_id !== user.profile.company_id) {
      throw new AppError('This unit does not belong to the seller company.');
    }

    const personByCpf = await personRepository.findByCpf(cpf);

    if (!personByCpf) {
      const person = await personRepository.create({
        name,
        cpf,
      });

      const createdCar = await carRepository.create({
        model: carModel,
        brand: car,
        plate: carPlate,
        color: carColor,
        person_id: person.id,
      });

      if (!createdCar) {
        throw new AppError('Car cannot be registered.');
      }

      const sale = await saleRepository.create({
        status: 'PENDING',
        unit_id: unitId,
        delivery_date: deliveryDate,
        availability_date: availabilityDate,
        request_date: new Date(),
        company_value: companyPrice,
        cost_value: costPrice,
        source,
        comments,
        seller_id: sellerId,
        production_status: 'TO_DO',
        person_id: person?.id,
        car_id: createdCar.id,
      });

      const saleById = await saleRepository.findById(sale.id);

      return response.json(saleById);
    }

    const carByPlateAndPersonId = await carRepository.findByPlateAndPersonId(
      car,
      carPlate,
      personByCpf.id,
    );

    if (!carByPlateAndPersonId) {
      const createdCar = await carRepository.create({
        brand: car,
        color: carColor,
        model: carModel,
        plate: carPlate,
        person_id: personByCpf.id,
      });

      if (!createdCar) {
        throw new AppError('Car cannot be registered.');
      }

      const sale = await saleRepository.create({
        status: 'PENDING',
        unit_id: unitId,
        delivery_date: deliveryDate,
        availability_date: availabilityDate,
        company_value: companyPrice,
        cost_value: costPrice,
        source,
        request_date: new Date(),
        comments,
        seller_id: sellerId,
        person_id: personByCpf?.id,
        production_status: 'TO_DO',
        car_id: createdCar.id,
      });

      const saleById = await saleRepository.findById(sale.id);

      return response.json(saleById);
    }

    const sale = await saleRepository.create({
      status: 'PENDING',
      unit_id: unitId,
      delivery_date: deliveryDate,
      availability_date: availabilityDate,
      company_value: companyPrice,
      cost_value: costPrice,
      source,
      comments,
      seller_id: sellerId,
      request_date: new Date(),
      person_id: personByCpf?.id,
      car_id: carByPlateAndPersonId.id,
    });

    const saleById = await saleRepository.findById(sale.id);

    return response.json(saleById);
  }

  async delete(request: Request, response: Response) {
    const { ids } = request.body;

    const errors: Array<{ id: string; message: string }> = [];

    const saleRepository = container.resolve(SaleRepository);
    const serviceSaleRepository = container.resolve(ServiceSaleRepository);

    try {
      for (const id of ids) {
        const saleExists = await saleRepository.findById(String(id));

        if (!saleExists) {
          errors.push({ id, message: 'Sale not found.' });
        } else {
          for (const serviceSale of saleExists.services_sales) {
            await serviceSaleRepository.delete(serviceSale.id);
          }

          await saleRepository.delete(String(id));
        }
      }

      return response.status(200).json({ message: 'Success', errors });
    } catch (err) {
      throw new AppError('An error has occurred on sale deleting.');
    }
  }

  async update(request: Request, response: Response) {
    const { id: saleId } = request.params;
    const {
      car,
      carPlate,
      carModel,
      carColor,
      comments,
      source,
      deliveryDate,
      availabilityDate,
    } = request.body;

    const updateSaleService = container.resolve(UpdateSaleService);

    const updatedSale = await updateSaleService.execute({
      saleId,
      car,
      carPlate,
      carModel,
      carColor,
      comments,
      source,
      deliveryDate,
      availabilityDate,
    });

    return response.status(200).json(updatedSale);
  }
}
