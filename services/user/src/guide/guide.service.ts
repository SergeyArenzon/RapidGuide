import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateGuideDto, ResponseGuideDto } from './dto/guide.dto';
import { User } from 'src/entities';
import { Guide } from './guide.entity';

@Injectable()
export class GuideService {
  constructor(
    @InjectRepository(Guide)
    private guideRepository: EntityRepository<Guide>,
    private readonly em: EntityManager,
  ) {}

  async create(createGuideDto: CreateGuideDto): Promise<ResponseGuideDto> {
    const user = await this.em.findOne(User, { id: createGuideDto.user_id });

    // Start a new transaction with EntityManager
    const em = this.em.fork();
    // Create a new Guide entity
    const newGuide = new Guide({ ...createGuideDto, user });
    console.log({ newGuide });

    // Persist the guide in the transaction
    await em.persistAndFlush(newGuide);
    // Commit the transaction
    await em.flush();

    // Map the entity to DTO
    return {
      id: newGuide.id,
      name: newGuide.name,
      bio: newGuide.bio,
      user_id: user.id,
      country_code: newGuide.country.code,
      city_id: String(newGuide.city.id),
      language_ids: newGuide.languages.getItems().map((lang) => lang.code),
      subcategory_ids: newGuide.subcategories.getItems().map((sub) => sub.id),
    };
  }
}
