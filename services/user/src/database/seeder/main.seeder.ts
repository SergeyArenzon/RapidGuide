// src/seeds/MainSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { LanguageSeeder } from './language.seeder';
import { CountrySeeder } from './country.seeder';
import { CitySeeder } from './city.seeder';

export class MainSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await this.call(em, [LanguageSeeder, CountrySeeder, CitySeeder]);
  }
}
