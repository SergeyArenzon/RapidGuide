import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { City } from './city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: EntityRepository<City>,
  ) {}

  async getCitiesByCountry(countryCode: string): Promise<City[]> {
    return await this.cityRepository.find({ country: { code: countryCode } });
  }
}
