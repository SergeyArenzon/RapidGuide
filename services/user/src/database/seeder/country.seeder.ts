import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Country } from 'src/country/country.entity';
import countriesData from './data/country.json';

interface CountryData {
  code: string;
  alpha3: string;
  name: string;
  country_code: string;
  region: string;
  region_code: string;
}

export class CountrySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // used https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.json for countries dataset
    const countries: CountryData[] = countriesData;

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
