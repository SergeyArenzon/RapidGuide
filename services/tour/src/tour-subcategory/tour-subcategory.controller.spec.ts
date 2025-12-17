import { Test, TestingModule } from '@nestjs/testing';
import { TourSubcategoryController } from './tour-subcategory.controller';
import { TourSubcategoryService } from './tour-subcategory.service';

describe('TourSubcategoryController', () => {
  let controller: TourSubcategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourSubcategoryController],
      providers: [TourSubcategoryService],
    }).compile();

    controller = module.get<TourSubcategoryController>(TourSubcategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
