/* eslint-disable no-continue */
import { endOfDay, startOfDay } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CarRepository from '@modules/cars/infra/typeorm/repositories/CarRepository';
import PersonRepository from '@modules/persons/infra/typeorm/repositories/PersonRepository';
import ServiceSaleRepository from '@modules/services_sales/infra/typeorm/repositories/ServiceSaleRepository';
import UnitRepository from '@modules/unities/infra/typeorm/repositories/UnitRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import SaleRepository from '../../typeorm/repositories/SaleRepository';

interface IUpdatedSalesErrors {
  sale: string;
  message: string;
}

export default class SalesController {
  async index(request: Request, response: Response) {
    const saleRepository = container.resolve(SaleRepository);

    const { date, status, page } = request.query;

    const user_id = request.user.id;

    const userRepository = container.resolve(UserRepository);

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    let statusTyped: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED' | null =
      null;

    if (status) {
      if (
        status === 'PENDING' ||
        status === 'CONFIRMED' ||
        status === 'CANCELED' ||
        status === 'FINISHED'
      ) {
        statusTyped = status;
      }
    }

    let sales;

    if (user.role === 'ADMIN') {
      if (date && status) {
        const initialDay = startOfDay(new Date(date.toString()));
        const finalDay = endOfDay(new Date(date.toString()));

        if (
          status !== 'PENDING' &&
          status !== 'CONFIRMED' &&
          status !== 'CANCELED' &&
          status !== 'FINISHED'
        ) {
          return response.status(400).json({ error: 'Status not found.' });
        }

        sales = await saleRepository.findByDateAndStatus(
          Number(page),
          initialDay,
          finalDay,
          String(status),
        );

        return response.json(sales);
      }

      if (date) {
        const initialDay = startOfDay(new Date(date.toString()));
        const finalDay = endOfDay(new Date(date.toString()));

        sales = await saleRepository.findAllSales(Number(page), {
          initialDay,
          endDay: finalDay,
        });

        return response.json(sales);
      }

      if (status) {
        if (
          status !== 'PENDING' &&
          status !== 'CONFIRMED' &&
          status !== 'CANCELED' &&
          status !== 'FINISHED'
        ) {
          return response.status(400).json({ error: 'Status not found.' });
        }

        sales = await saleRepository.findAllSales(Number(page), { status });

        return response.json(sales);
      }

      sales = await saleRepository.findAllSales(Number(page), {});

      return response.json(sales);
    }

    if (user.role === 'SELLER') {
      sales = await saleRepository.findBySeller(user.profile.id, Number(page), {
        ...(date && {
          initialDay: startOfDay(new Date(date.toString())),
          endDay: endOfDay(new Date(date.toString())),
        }),
        ...(statusTyped && { status: statusTyped }),
      });

      return response.json(sales);
    }

    sales = await saleRepository.findByCompanyAndFinishedStatus(
      user.profile.company_id,
      Number(page),
      {
        ...(date && {
          initialDay: startOfDay(new Date(date.toString())),
          endDay: endOfDay(new Date(date.toString())),
        }),
        ...(statusTyped && { status: statusTyped }),
      },
    );

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
    const { status, sales } = request.body;

    if (
      status !== 'PENDING' &&
      status !== 'CONFIRMED' &&
      status !== 'CANCELED' &&
      status !== 'FINISHED'
    ) {
      throw new AppError('Status not found.', 404);
    }

    const saleRepository = container.resolve(SaleRepository);

    const errors: IUpdatedSalesErrors[] = [];
    const updated_sales: string[] = [];

    for (const sale of sales) {
      const foundSale = await saleRepository.findById(String(sale));

      if (!foundSale) {
        errors.push({ sale, message: 'Sale not found' });

        continue;
      }

      const updatedSale = await saleRepository.save({ ...foundSale, status });

      updated_sales.push(updatedSale.id);
    }

    return response.status(200).json({ updated_sales, errors });
  }
}
