import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { CreateGuideDto, GuideDto } from '@rapid-guide-io/contracts';
import { Guide } from './entities/guide.entity';
import { CountryService } from '../country/country.service';
import { CityService } from '../city/city.service';
import { LanguagesService } from '../languages/languages.service';
import { GuideSubcategory } from './entities/guide-subcategory.entity';

@Injectable()
export class GuideService {
  constructor(
    @InjectRepository(Guide)
    private readonly guideRepository: EntityRepository<Guide>,
    private readonly em: EntityManager,
    private readonly countryService: CountryService,
    private readonly cityService: CityService,
    private readonly languagesService: LanguagesService,
  ) {}

  async create(
    userId: string,
    createGuideDto: CreateGuideDto,
  ): Promise<GuideDto> {
    // Check if user already has a guide - fail fast before querying other entities
    const existingGuide = await this.guideRepository.findOne({
      user_id: userId,
    });
    if (existingGuide) {
      throw new ConflictException('User already has a guide profile');
    }

    // Fork the EntityManager for this request to get a clean context
    const em = this.em.fork();
    // Validate country using CountryService
    const country = await this.countryService.findByCode(
      createGuideDto.country_code,
    );

    // Validate city using CityService
    const city = await this.cityService.findById(createGuideDto.city_id);

    // Validate languages using LanguagesService
    const languages = await this.languagesService.findByCodes(
      createGuideDto.languages_code,
    );

    // Create a new Guide entity
    const newGuide = new Guide({
      ...createGuideDto,
      user_id: userId,
      country,
      city,
    });

    // Add languages to the guide
    newGuide.languages.set(languages);

    // Create guide subcategories
    const guideSubcategories = createGuideDto.subcategories_id.map(
      (subcategoryId) =>
        new GuideSubcategory({
          guide: newGuide,
          subcategory_id: subcategoryId,
        }),
    );

    // Add subcategories to the guide
    newGuide.subcategories.set(guideSubcategories);

    // Use the forked em for both persist and flush
    await em.persist(newGuide).flush();

    return newGuide.toDto();
  }

  async findByUserId(userId: string): Promise<GuideDto | null> {
    const guide = await this.guideRepository.findOne(
      { user_id: userId },
      { populate: ['languages', 'subcategories', 'country', 'city'] },
    );
    if (!guide) {
      return null;
    }
    return guide.toDto();
  }

  async findById(guideId: string): Promise<GuideDto | null> {
    const guide = await this.guideRepository.findOne(
      { id: guideId },
      { populate: ['languages', 'subcategories', 'country', 'city'] },
    );
    if (!guide) {
      return null;
    }
    return guide.toDto();
  }
}
