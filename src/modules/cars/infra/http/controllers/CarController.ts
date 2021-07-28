import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import PersonRepository from '../../../../persons/infra/typeorm/repositories/PersonRepository';
import CarRepository from '../../typeorm/repositories/CarRepository';

export default class UserController {
  async store(request: Request, response: Response) {
    const { personId, car, carPlate, carColor, carModel } = request.body;

    const personRepository = container.resolve(PersonRepository);
    const carRepository = container.resolve(CarRepository);

    const personById = await personRepository.findById(personId);

    if (!personById) {
      throw new AppError('Not found a person with this ID.');
    }

    const createdCar = await carRepository.create({
      brand: car,
      model: carModel,
      plate: carPlate,
      color: carColor,
      person_id: personId,
    });

    return response.json(createdCar);
  }
}
