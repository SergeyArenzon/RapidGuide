import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { City } from './city.entity';
import { CityDto } from '@rapid-guide-io/contracts';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: EntityRepository<City>,
  ) {}

  async getCities(countryCode?: string): Promise<City[]> {
    if (!countryCode) {
      return await this.cityRepository.findAll();
    }
    return await this.cityRepository.find({ country: { code: countryCode } });
  }
}
