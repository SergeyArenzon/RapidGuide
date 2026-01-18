import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingService } from './booking.service';


@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

}
