import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Languages } from './languages.entity';

@Injectable()
export class LanguagesService {
  constructor(private readonly em: EntityManager) {}

  async getLanguages(): Promise<Languages[]> {
    return this.em.findAll(Languages);
  }

  async findByCodes(codes: string[]): Promise<Languages[]> {
    const languages = await this.em.find(Languages, {
      code: { $in: codes },
    });

    if (languages.length !== codes.length) {
      const foundCodes = languages.map((lang) => lang.code);
      const missingCodes = codes.filter((code) => !foundCodes.includes(code));
      throw new NotFoundException(
        `Languages with codes [${missingCodes.join(', ')}] not found`,
      );
    }

    return languages;
  }
}
