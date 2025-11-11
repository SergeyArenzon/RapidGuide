import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Languages } from './languages.entity';

@Injectable()
export class LanguagesService {
  constructor(private readonly em: EntityManager) {}

  async getLanguages(): Promise<Languages[]> {
    return this.em.findAll(Languages);
  }
}
