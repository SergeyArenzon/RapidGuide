import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Traveller } from './traveller.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class TravellerService {
  async createWithTransaction(
    user: User,
    em: EntityManager,
  ): Promise<Traveller> {
    const traveller = new Traveller({ user });
    await em.persistAndFlush(traveller);
    return traveller;
  }
}
