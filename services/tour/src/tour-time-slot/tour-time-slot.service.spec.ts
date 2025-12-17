import { Test, TestingModule } from '@nestjs/testing';
import { TourTimeSlotService } from './tour-time-slot.service';

describe('TourTimeSlotService', () => {
  let service: TourTimeSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourTimeSlotService],
    }).compile();

    service = module.get<TourTimeSlotService>(TourTimeSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
