import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Country } from '../../country/country.entity';
import { countries } from './data/country';

export class CountrySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // used https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.json for countries dataset

    const existingCountries = await em.findAll(Country);

    for (const country of countries) {
      if (
        !existingCountries.some((existing) => existing.code === country.code)
      ) {
        const countryEntity = new Country(country);
        await em.persistAndFlush(countryEntity);
      }
    }
  }
}
