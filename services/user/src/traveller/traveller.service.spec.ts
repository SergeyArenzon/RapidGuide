import { Test, TestingModule } from '@nestjs/testing';
import { TravellerService } from './traveller.service';

describe('TravellerService', () => {
  let service: TravellerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravellerService],
    }).compile();

    service = module.get<TravellerService>(TravellerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
