import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Tour } from './tour.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { CreateTourDto, TourDto } from '@rapid-guide-io/contracts';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: EntityRepository<Tour>,
    private readonly em: EntityManager,
  ) {}

  async create(guideId: string, createTourDto: CreateTourDto): Promise<TourDto> {
    const em = this.em.fork();
    const newTour = new Tour({
      ...createTourDto,
      guide_id: guideId,
    });
    await em.persist(newTour).flush();
    return newTour.toDto();
  }
}
