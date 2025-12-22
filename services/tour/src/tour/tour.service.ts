import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Tour } from './tour.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { TourDto } from '@rapid-guide-io/contracts';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: EntityRepository<Tour>,
    private readonly em: EntityManager,
  ) {}

  async create(createTourDto: TourDto): Promise<TourDto> {
    const em = this.em.fork();
    const newTour = new Tour(createTourDto);
    await em.persist(newTour).flush();
    return newTour.toDto();
  }
}
