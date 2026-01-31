import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  CreateReservationDto,
  JoinReservationDto,
  ReservationDto,
  createReservationSchema,
  joinReservationSchema,
  getResevationsFilerSchema,
  GetReservationsFilterDto,
} from '@rapid-guide-io/contracts';
import { ZodValidationPipe } from '@rapid-guide-io/pipes';
import { ScopesGuard } from '@rapid-guide-io/guards';
import {
  ScopePermission,
  Scopes,
  TravellerId,
} from '@rapid-guide-io/decorators';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.RESERVATION_CREATE])
  create(
    @TravellerId() jwtTravellerId: string,
    @Body(new ZodValidationPipe(createReservationSchema))
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationDto> {
    if (createReservationDto.traveller_id !== jwtTravellerId) {
      throw new ForbiddenException(
        'Traveller ID in request does not match authenticated user',
      );
    }
    return this.reservationService.create(createReservationDto);
  }

  @Post('join')
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.RESERVATION_CREATE])
  join(
    @TravellerId() jwtTravellerId: string,
    @Body(new ZodValidationPipe(joinReservationSchema))
    joinReservationDto: JoinReservationDto,
  ): Promise<ReservationDto> {
    if (joinReservationDto.traveller_id !== jwtTravellerId) {
      throw new ForbiddenException(
        'Traveller ID in request does not match authenticated user',
      );
    }
    return this.reservationService.join(joinReservationDto);
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
}
