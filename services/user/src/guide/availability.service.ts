import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  GuideAvailabilityDto,
  CreateGuideAvailabilityDto,
  PostGuideAvailabilitiesRequestDto,
} from '@rapid-guide-io/contracts';
import { Guide } from './entities/guide.entity';
import { GuideAvailability } from './entities/guide-availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Guide)
    private readonly guideRepository: EntityRepository<Guide>,
    @InjectRepository(GuideAvailability)
    private readonly availabilityRepository: EntityRepository<GuideAvailability>,
    private readonly em: EntityManager,
  ) {}

  async findAvailabilitiesByGuideId(
    guideId: string,
  ): Promise<GuideAvailabilityDto[]> {
    const availabilities = await this.availabilityRepository.find(
      { guide: { id: guideId } },
      { populate: ['guide'] },
    );
    return availabilities.map((availability) => availability.toDto());
  }

  async createAvailability(
    guideId: string,
    createAvailabilityDto: CreateGuideAvailabilityDto,
  ): Promise<GuideAvailabilityDto> {
    // Get the guide by ID
    const guide = await this.guideRepository.findOne({ id: guideId });
    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    // Fork the EntityManager for this request
    const em = this.em.fork();

    // Create the availability
    const newAvailability = new GuideAvailability({
      ...createAvailabilityDto,
      guide,
    });

    // Persist and flush
    await em.persist(newAvailability).flush();

    // Populate guide relation for DTO conversion
    await em.populate(newAvailability, ['guide']);

    return newAvailability.toDto();
  }

  async createAvailabilities(
    guideId: string,
    createAvailabilitiesDto: Array<PostGuideAvailabilitiesRequestDto>,
  ): Promise<GuideAvailabilityDto[]> {
    // Get the guide by ID
    const guide = await this.guideRepository.findOne({ id: guideId });
    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    // Fork the EntityManager for this request
    const em = this.em.fork();

    // Create all availabilities
    const newAvailabilities = createAvailabilitiesDto.map(
      (availabilityDto) =>
        new GuideAvailability({
          ...availabilityDto,
          guide,
        }),
    );

    // Persist all and flush once
    await em.persist(newAvailabilities).flush();

    // Populate guide relation for DTO conversion
    await em.populate(newAvailabilities, ['guide']);

    return newAvailabilities.map((availability) => availability.toDto());
  }

  async deleteAvailability(
    guideId: string,
    availabilityId: string,
  ): Promise<void> {
    // Find the availability and verify it belongs to the guide
    const availability = await this.availabilityRepository.findOne(
      {
        id: availabilityId,
        guide: { id: guideId },
      },
      { populate: ['guide'] },
    );

    if (!availability) {
      throw new NotFoundException(
        'Availability not found or does not belong to this guide',
      );
    }

    // Fork the EntityManager for this request
    const em = this.em.fork();

    // Remove and flush
    await em.remove(availability).flush();
  }
}
