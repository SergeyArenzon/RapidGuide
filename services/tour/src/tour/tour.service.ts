import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Tour } from './tour.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  CreateTourDto,
  TourDto,
  NOTIFICATION_EVENTS,
} from '@rapid-guide-io/contracts';
import { TourSubcategory } from '../tour-subcategory/entities/tour-subcategory.entity';
import { SubCategory } from '../sub-category/entities/sub-category';
import { RabbitmqPublisherService } from '../rabbitmq/rabbitmq-publisher.service';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: EntityRepository<Tour>,
    private readonly em: EntityManager,
    private readonly rabbitmq: RabbitmqPublisherService,
  ) {}

  async findAll(): Promise<TourDto[]> {
    const tours = await this.tourRepository.findAll({
      populate: ['tourSubcategories.subcategory'],
    });
    return tours.map((tour) => tour.toDto());
  }

  async findByCity(cityId: number): Promise<TourDto[]> {
    const tours = await this.tourRepository.find(
      { city_id: cityId },
      { populate: ['tourSubcategories.subcategory'] },
    );
    return tours.map((tour) => tour.toDto());
  }

  async findByGuide(guideId: string): Promise<TourDto[]> {
    const tours = await this.tourRepository.find(
      { guide_id: guideId },
      { populate: ['tourSubcategories.subcategory'] },
    );
    return tours.map((tour) => tour.toDto());
  }

  async findOne(id: string): Promise<TourDto> {
    const tour = await this.tourRepository.findOne(
      { id },
      { populate: ['tourSubcategories.subcategory'] },
    );
    if (!tour) {
      throw new NotFoundException(`Tour with id ${id} not found`);
    }
    return tour.toDto();
  }

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

    this.rabbitmq.emit(NOTIFICATION_EVENTS.TOUR_CREATED, {
      user_id: guideId,
      channels: ['push'],
      template: 'tour_created',
      subject: 'Tour Created',
      data: { tour_id: newTour.id, name: newTour.name },
    });

    return newTour.toDto();
  }

  async update(id: string, updateTourDto: CreateTourDto): Promise<TourDto> {
    const em = this.em.fork();
    const tour = await em.findOne(
      Tour,
      { id },
      { populate: ['tourSubcategories'] },
    );
    if (!tour) {
      throw new NotFoundException(`Tour with id ${id} not found`);
    }

    // Update tour properties (excluding subcategory_ids as that's handled separately)
    const { subcategory_ids, ...tourData } = updateTourDto;
    tour.assign({
      ...tourData,
    });

    // Handle subcategories update
    // Remove existing tour-subcategory relations
    if (tour.tourSubcategories.isInitialized()) {
      const existingRelations = tour.tourSubcategories.getItems();
      for (const relation of existingRelations) {
        em.remove(relation);
      }
    }

    // Create new tour-subcategory relations if provided
    if (subcategory_ids?.length) {
      const subcategories = await em.find(SubCategory, {
        id: { $in: subcategory_ids },
      });

      for (const subcategory of subcategories) {
        const tourSubcategory = new TourSubcategory({
          tour,
          subcategory,
        });
        em.persist(tourSubcategory);
      }
    }

    await em.flush();
    await em.populate(tour, ['tourSubcategories.subcategory']);

    this.rabbitmq.emit(NOTIFICATION_EVENTS.TOUR_UPDATED, {
      user_id: tour.guide_id,
      channels: ['push'],
      template: 'tour_updated',
      subject: 'Tour Updated',
      data: { tour_id: id },
    });

    return tour.toDto();
  }

  async remove(id: string): Promise<void> {
    const tour = await this.tourRepository.findOne({ id });
    if (!tour) {
      throw new NotFoundException(`Tour with id ${id} not found`);
    }
    const guideId = tour.guide_id;
    const em = this.em.fork();
    await em.removeAndFlush(tour);

    this.rabbitmq.emit(NOTIFICATION_EVENTS.TOUR_DELETED, {
      user_id: guideId,
      channels: ['push'],
      template: 'tour_deleted',
      subject: 'Tour Deleted',
      data: { tour_id: id },
    });
  }
}
