import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Country } from './country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: EntityRepository<Country>,
  ) {}

  async getCountries(): Promise<Country[]> {
    return await this.countryRepository.findAll();
  }
}
