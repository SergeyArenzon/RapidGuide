import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Tour } from './tour.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { CreateTourDto, TourDto } from '@rapid-guide-io/contracts';
import { TourSubcategory } from '../tour-subcategory/entities/tour-subcategory.entity';
import { SubCategory } from '../sub-category/entities/sub-category';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: EntityRepository<Tour>,
    private readonly em: EntityManager,
  ) {}

  async create(
    guideId: string,
    createTourDto: CreateTourDto,
  ): Promise<TourDto> {
    const em = this.em.fork();
    const newTour = new Tour({
      ...createTourDto,
      guide_id: guideId,
    });

    await em.persist(newTour).flush();

    // Create tour-subcategory relations based on provided subcategory_ids
    if (createTourDto.subcategory_ids?.length) {
      const subcategories = await em.find(SubCategory, {
        id: { $in: createTourDto.subcategory_ids },
      });

      for (const subcategory of subcategories) {
        const tourSubcategory = new TourSubcategory({
          tour: newTour,
          subcategory,
        });
        em.persist(tourSubcategory);
      }

      await em.flush();
      await em.populate(newTour, ['tourSubcategories.subcategory']);
    }

    return newTour.toDto();
  }
}
