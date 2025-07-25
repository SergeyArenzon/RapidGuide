import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuideDto } from './dto/create-guide.dto';
import { GuideDto } from './dto/guide.dto';
import { User } from 'src/entities';
import { Guide } from './entities/guide.entity';
import { Country } from '../country/country.entity';
import { City } from '../city/city.entity';
import { Languages } from '../languages/languages.entity';

@Injectable()
export class GuideService {
  constructor(
    @InjectRepository(Guide)
    private guideRepository: EntityRepository<Guide>,
    private readonly em: EntityManager,
  ) {}

  async create(createGuideDto: CreateGuideDto): Promise<GuideDto> {
    // Start a new transaction with EntityManager
    const em = this.em.fork();

    // Find the user
    const user = await em.findOne(User, {
      id: createGuideDto.user_id,
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createGuideDto.user_id} not found`,
      );
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

    // Persist the guide in the transaction
    await em.persistAndFlush(newGuide);

    // Map the entity to DTO
    return {
      id: newGuide.id,
      name: newGuide.name,
      bio: newGuide.bio,
      user_id: user.id,
      country_code: country.code,
      city_id: city.id,
      languages_code: languages.map((lang) => lang.code),
      subcategories_ids: newGuide.subcategories.getItems().map((sub) => sub.id),
      created_at: newGuide.created_at,
      updated_at: newGuide.updated_at,
    };
  }
}
