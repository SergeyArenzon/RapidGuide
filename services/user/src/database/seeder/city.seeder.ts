import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { City } from '../../city/city.entity';
import { Country } from '../../country/country.entity';
import { cities } from './data/city';

export class CitySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // used https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.json for countries dataset

    const existingCities = await em.findAll(City);

    for (const city of cities) {
      if (!existingCities.some((existing) => existing.name === city.name)) {
        // Find the country by code
        const country = await em.findOne(Country, { code: city.country_code });

        if (!country) {
          console.warn(
            `Country with code ${city.country_code} not found for city ${city.name}`,
          );
          continue;
        }

        const cityEntity = new City({
          name: city.name,
          country: country,
        });
        await em.persistAndFlush(cityEntity);
      }
    }
  }
}
