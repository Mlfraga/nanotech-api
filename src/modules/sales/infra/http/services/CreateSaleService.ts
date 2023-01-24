import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICarRepository from '@modules/cars/repositories/ICarRepository';
import IPersonRepository from '@modules/persons/repositories/IPersonRepository';
import ISaleRepository from '@modules/sales/repositories/ISaleRepository';
import IUnitRepository from '@modules/unities/repositories/IUnitRepository';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

import { Sale } from '../../entities/Sale';

interface ICreateSaleServiceParams {
  user_id: string;
  deliveryDate: Date;
  availabilityDate: Date;
  comments: string;
  companyPrice: number;
  costPrice: number;
  source: string;
  name: string;
  cpf: string;
  car: string;
  carPlate: string;
  carColor: string;
  carModel: string;
  unitId: string;
}

@injectable()
class CreateSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('PersonRepository')
    private personRepository: IPersonRepository,

    @inject('CarRepository')
    private carRepository: ICarRepository,

    @inject('UnitRepository')
    private unitRepository: IUnitRepository,

    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    user_id,
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
  }: ICreateSaleServiceParams): Promise<Sale> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const sellerId = user.profile.id;

    if (source !== 'NEW' && source !== 'USED' && source !== 'WORKSHOP') {
      throw new AppError('The source is unavailable.');
    }

    const unitExists = await this.unitRepository.findById(unitId);

    if (!unitExists) {
      throw new AppError('This unit does not exist.');
    }

    if (unitExists.company_id !== user.profile.company_id) {
      throw new AppError('This unit does not belong to the seller company.');
    }

    const personByCpf = await this.personRepository.findByCpf(cpf);

    if (!personByCpf) {
      const person = await this.personRepository.create({
        name,
        cpf,
      });

      const createdCar = await this.carRepository.create({
        model: carModel,
        brand: car,
        plate: carPlate,
        color: carColor,
        person_id: person.id,
      });

      if (!createdCar) {
        throw new AppError('Car cannot be registered.');
      }

      const createdSale = await this.saleRepository.create({
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

      return createdSale;
    }

    const carByPlateAndPersonId =
      await this.carRepository.findByPlateAndPersonId(
        car,
        carPlate,
        personByCpf.id,
      );

    if (!carByPlateAndPersonId) {
      const createdCar = await this.carRepository.create({
        brand: car,
        color: carColor,
        model: carModel,
        plate: carPlate,
        person_id: personByCpf.id,
      });

      if (!createdCar) {
        throw new AppError('Car cannot be registered.');
      }

      const createdSale = await this.saleRepository.create({
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

      return createdSale;
    }

    const createdSale = await this.saleRepository.create({
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

    return createdSale;
  }
}

export default CreateSaleService;
