import { Test, TestingModule } from '@nestjs/testing';
import { TravellerController } from './traveller.controller';

describe('TravellerController', () => {
  let controller: TravellerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravellerController],
    }).compile();

    controller = module.get<TravellerController>(TravellerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
