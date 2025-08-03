import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateGuideDto, GuideDto } from '@rapid-guide-io/shared';
import { User } from 'src/entities';
import { Guide } from './entities/guide.entity';
import { Country } from '../country/country.entity';
import { City } from '../city/city.entity';
import { Languages } from '../languages/languages.entity';
import { GuideSubcategory } from './entities/guide-subcategory.entity';

@Injectable()
export class GuideService {
  constructor(private readonly em: EntityManager) {}

  async create(
    userId: string,
    createGuideDto: CreateGuideDto,
  ): Promise<GuideDto> {
    // Start a new transaction with EntityManager
    const em = this.em.fork();

    // Check if guide already exists for this user
    const existingGuide = await em.findOne(Guide, { user: userId });
    if (existingGuide) {
      throw new ConflictException(
        `Guide already exists for user with ID ${userId}`,
      );
    }

    // Find the user
    const user = await em.findOne(User, {
      id: userId,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Find the country
    const country = await em.findOne(Country, {
      code: createGuideDto.country_code,
    });
    if (!country) {
      throw new NotFoundException(
        `Country with code ${createGuideDto.country_code} not found`,
      );
    }

    // Find the city
    const city = await em.findOne(City, {
      id: createGuideDto.city_id,
    });
    if (!city) {
      throw new NotFoundException(
        `City with ID ${createGuideDto.city_id} not found`,
      );
    }

    // Find languages
    const languages = await em.find(Languages, {
      code: { $in: createGuideDto.languages_code },
    });
    if (languages.length !== createGuideDto.languages_code.length) {
      throw new NotFoundException('Some languages were not found');
    }

    // Create a new Guide entity
    const newGuide = new Guide({
      ...createGuideDto,
      user,
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

    // Persist the guide and subcategories in the transaction
    await em.persistAndFlush([newGuide, ...guideSubcategories]);

    return newGuide.toDto();
  }

  async findByUserId(userId: string): Promise<GuideDto> {
    const em = this.em.fork();

    const guide = await em.findOne(
      Guide,
      { user: userId },
      {
        populate: ['country', 'city', 'languages', 'subcategories'],
      },
    );

    if (!guide) {
      throw new NotFoundException(`No guide found for user with ID ${userId}`);
    }

    return guide.toDto();
  }
}
