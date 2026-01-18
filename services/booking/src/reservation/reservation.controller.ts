import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { 
  CreateReservationDto, 
  ReservationDto,
  createReservationSchema,
  UpdateReservationDto,
  updateReservationSchema,
} from '@rapid-guide-io/contracts';
import { ZodValidationPipe } from '@rapid-guide-io/pipes';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createReservationSchema)) 
    createReservationDto: CreateReservationDto
  ): Promise<ReservationDto> {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll(): Promise<ReservationDto[]> {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReservationDto> {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body(new ZodValidationPipe(updateReservationSchema)) 
    updateReservationDto: UpdateReservationDto
  ): Promise<ReservationDto> {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reservationService.remove(id);
  }
}
