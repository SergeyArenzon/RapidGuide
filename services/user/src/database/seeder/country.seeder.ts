import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Country } from 'src/country/country.entity';

export class CountrySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // used https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.json for countries dataset
    const countries = [
      {
        code: 'BR',
        alpha3: 'BRA',
        name: 'Brazil',
        country_code: '076',
        region: 'Americas',
        region_code: '019',
      },
      {
        code: 'CN',
        alpha3: 'CHN',
        name: 'China',
        country_code: '156',
        region: 'Asia',
        region_code: '142',
      },
      {
        code: 'EG',
        alpha3: 'EGY',
        name: 'Egypt',
        country_code: '818',
        region: 'Africa',
        region_code: '002',
      },
      {
        code: 'FR',
        alpha3: 'FRA',
        name: 'France',
        country_code: '250',
        region: 'Europe',
        region_code: '150',
      },
      {
        code: 'DE',
        alpha3: 'DEU',
        name: 'Germany',
        country_code: '276',
        region: 'Europe',
        region_code: '150',
      },
      {
        code: 'GR',
        alpha3: 'GRC',
        name: 'Greece',
        country_code: '300',
        region: 'Europe',
        region_code: '150',
      },
      {
        code: 'ID',
        alpha3: 'IDN',
        name: 'Indonesia',
        country_code: '360',
        region: 'Asia',
        region_code: '142',
      },
      {
        code: 'IL',
        alpha3: 'ISR',
        name: 'Israel',
        country_code: '376',
        region: 'Asia',
        region_code: '142',
      },
      {
        code: 'IT',
        alpha3: 'ITA',
        name: 'Italy',
        country_code: '380',
        region: 'Europe',
        region_code: '150',
      },
      {
        code: 'JP',
        alpha3: 'JPN',
        name: 'Japan',
        country_code: '392',
        region: 'Asia',
        region_code: '142',
      },
      {
        code: 'KR',
        alpha3: 'KOR',
        name: 'Korea, Republic of',
        country_code: '410',
        region: 'Asia',
        region_code: '142',
      },
      {
        code: 'MX',
        alpha3: 'MEX',
        name: 'Mexico',
        country_code: '484',
        region: 'Americas',
        region_code: '019',
      },
      {
        code: 'MA',
        alpha3: 'MAR',
        name: 'Morocco',
        country_code: '504',
        region: 'Africa',
        region_code: '002',
      },
      {
        code: 'NL',
        alpha3: 'NLD',
        name: 'Netherlands, Kingdom of the',
        country_code: '528',
        region: 'Europe',
        region_code: '150',
      },
      {
        code: 'PT',
        alpha3: 'PRT',
        name: 'Portugal',
        country_code: '620',
        region: 'Europe',
        region_code: '150',
      },
      {
        code: 'ES',
        alpha3: 'ESP',
        name: 'Spain',
        country_code: '724',
        region: 'Europe',
        region_code: '150',
      },
      {
        code: 'TH',
        alpha3: 'THA',
        name: 'Thailand',
        country_code: '764',
        region: 'Asia',
        region_code: '142',
      },
      {
        code: 'TR',
        alpha3: 'TUR',
        name: 'Türkiye',
        country_code: '792',
        region: 'Asia',
        region_code: '142',
      },
      {
        code: 'AE',
        alpha3: 'ARE',
        name: 'United Arab Emirates',
        country_code: '784',
        region: 'Asia',
        region_code: '142',
      },
      {
        code: 'GB',
        alpha3: 'GBR',
        name: 'United Kingdom of Great Britain and Northern Ireland',
        country_code: '826',
        region: 'Europe',
        region_code: '150',
      },
      {
        code: 'US',
        alpha3: 'USA',
        name: 'United States of America',
        country_code: '840',
        region: 'Americas',
        region_code: '019',
      },
    ];

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
