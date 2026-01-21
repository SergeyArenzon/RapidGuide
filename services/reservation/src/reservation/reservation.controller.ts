import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  CreateReservationDto,
  ReservationDto,
  createReservationSchema,
  UpdateReservationDto,
  updateReservationSchema,
  getResevationsFilerSchema,
  GetReservationsFilterDto,
} from '@rapid-guide-io/contracts';
import { ZodValidationPipe } from '@rapid-guide-io/pipes';
import { ScopesGuard } from '@rapid-guide-io/guards';
import { ScopePermission, Scopes } from '@rapid-guide-io/decorators';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.RESERVATION_CREATE])
  create(
    @Body(new ZodValidationPipe(createReservationSchema))
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationDto> {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.RESERVATION_READ])
  findAll(
    @Query(new ZodValidationPipe(getResevationsFilerSchema))
    filter: GetReservationsFilterDto,
  ): Promise<ReservationDto[]> {
    return this.reservationService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.RESERVATION_READ])
  findOne(@Param('id') id: string): Promise<ReservationDto> {
    return this.reservationService.findOne(id);
  }

  // @Patch(':id')
  // @UseGuards(ScopesGuard)
  // @Scopes([ScopePermission.RESERVATION_UPDATE])
  // update(
  //   @Param('id') id: string,
  //   @Body(new ZodValidationPipe(updateReservationSchema))
  //   updateReservationDto: UpdateReservationDto,
  // ): Promise<ReservationDto> {
  //   return this.reservationService.update(id, updateReservationDto);
  // }

  @Delete(':id')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.RESERVATION_DELETE])
  remove(@Param('id') id: string): Promise<void> {
    return this.reservationService.remove(id);
  }
}
