import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Languages } from 'src/languages/languages.entity';
import languagesData from './data/language.json';

interface LanguageData {
  code: string;
  name: string;
}

export class LanguageSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const languages: LanguageData[] = languagesData;

    const existingLanguages = await em.findAll(Languages);

    for (const language of languages) {
      if (
        !existingLanguages.some((existing) => existing.code === language.code)
      ) {
        const languageEntity = new Languages(language);
        await em.persistAndFlush(languageEntity);
      }
    }
  }
}
