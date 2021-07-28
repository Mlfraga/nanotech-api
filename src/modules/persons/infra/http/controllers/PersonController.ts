import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import PersonRepository from '../../typeorm/repositories/PersonRepository';

export default class PersonController {
  async store(request: Request, response: Response) {
    const { name, cpf } = request.body;

    const personRepository = container.resolve(PersonRepository);

    const personByCpf = await personRepository.findByCpf(cpf);

    if (personByCpf) {
      throw new AppError('Already has a person with this document.');
    }

    const person = await personRepository.create({
      name,
      cpf,
    });

    return response.json(person);
  }
}
