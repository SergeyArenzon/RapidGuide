import { Test, TestingModule } from '@nestjs/testing';
import { TourSubcategoryService } from './tour-subcategory.service';

describe('TourSubcategoryService', () => {
  let service: TourSubcategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourSubcategoryService],
    }).compile();

    service = module.get<TourSubcategoryService>(TourSubcategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
