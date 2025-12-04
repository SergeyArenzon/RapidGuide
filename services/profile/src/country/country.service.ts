import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findByCode(code: string): Promise<Country> {
    const country = await this.countryRepository.findOne({ code });
    if (!country) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }
    return country;
  }
}
