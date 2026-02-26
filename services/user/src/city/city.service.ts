import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { City } from './city.entity';

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

  async findById(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({ id });
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return city;
  }
}
