import { Test, TestingModule } from '@nestjs/testing';
import { TourTimeSlotController } from './tour-time-slot.controller';
import { TourTimeSlotService } from './tour-time-slot.service';

describe('TourTimeSlotController', () => {
  let controller: TourTimeSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourTimeSlotController],
      providers: [TourTimeSlotService],
    }).compile();

    controller = module.get<TourTimeSlotController>(TourTimeSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
