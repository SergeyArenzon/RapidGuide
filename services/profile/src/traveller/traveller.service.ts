import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Traveller } from './entities/traveller.entity';
// import { User } from 'src/user/user.entity';

@Injectable()
export class TravellerService {
  // async createWithTransaction(
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

}
