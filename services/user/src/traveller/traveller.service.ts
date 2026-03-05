import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ConflictException, Injectable } from '@nestjs/common';
import { Traveller } from './entities/traveller.entity';
import {
  CreateTravellerDto,
  TravellerDto,
  NOTIFICATION_EVENTS,
} from '@rapid-guide-io/contracts';
import { LanguagesService } from '../languages/languages.service';
import { CityService } from '../city/city.service';
import { CountryService } from '../country/country.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TravellerSubcategory } from './entities/traveller-subcategory.entity';
import { RabbitmqPublisherService } from '../rabbitmq/rabbitmq-publisher.service';

@Injectable()
export class TravellerService {
  constructor(
    @InjectRepository(Traveller)
    private readonly travellerRepository: EntityRepository<Traveller>,
    private readonly em: EntityManager,
    private readonly countryService: CountryService,
    private readonly cityService: CityService,
    private readonly languagesService: LanguagesService,
    private readonly rabbitmq: RabbitmqPublisherService,
  ) {}
  // async createWithTransaction(
    async create(
      userId: string,
      createTravellerDto: CreateTravellerDto,
    ): Promise<TravellerDto> {
      // Check if user already has a guide - fail fast before querying other entities
      const existingTraveller = await this.travellerRepository.findOne({
        user_id: userId,
      });
      if (existingTraveller) {
        throw new ConflictException('Traveller already has a guide profile');
      }
  
      // Fork the EntityManager for this request to get a clean context
      const em = this.em.fork();
      // Validate country using CountryService
      const country = await this.countryService.findByCode(
        createTravellerDto.country_code,
      );
  
      // Validate city using CityService
      const city = await this.cityService.findById(createTravellerDto.city_id);
  
      // Validate languages using LanguagesService
      const languages = await this.languagesService.findByCodes(
        createTravellerDto.languages_code,
      );
  
      // Create a new Guide entity
      const newTraveller = new Traveller({
        ...createTravellerDto,
        user_id: userId,
        country,
        city,
      });
  
      // Add languages to the guide
      newTraveller.languages.set(languages);
  
      // Create guide subcategories
      const travellerSubcategories = createTravellerDto.subcategories_id.map(
        (subcategoryId) =>
          new TravellerSubcategory({
            traveller: newTraveller,
            subcategory_id: subcategoryId,
          }),
      );
  
      // Add subcategories to the guide
      newTraveller.subcategories.set(travellerSubcategories);
  
      // Use the forked em for both persist and flush
      await em.persist(newTraveller).flush();

      this.rabbitmq.emit(NOTIFICATION_EVENTS.TRAVELLER_CREATED, {
        user_id: userId,
        channels: ['push'],
        template: 'traveller_created',
        subject: 'Traveller Profile Created',
        data: { traveller_id: newTraveller.id },
      });

      return newTraveller.toDto();
    }

    
  async findByUserId(userId: string): Promise<TravellerDto | null> {
    const traveller = await this.travellerRepository.findOne(
      { user_id: userId },
      { populate: ['languages', 'subcategories', 'country', 'city'] },
    );
    if (!traveller) {
      return null;
    }
    return traveller.toDto();
  }
}
