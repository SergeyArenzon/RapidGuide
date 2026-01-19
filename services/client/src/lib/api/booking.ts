import { z } from 'zod';
import { createReservationSchema, reservationSchema } from '@rapid-guide-io/contracts';
import { BaseApi } from './base';
import type {
  CreateReservationDto,
  ReservationDto,
} from '@rapid-guide-io/contracts';

export class BookingApi extends BaseApi {
  // Base URL for the booking service
  static readonly baseUrl = '/reservation';

  async createReservation(reservation: CreateReservationDto): Promise<CreateReservationDto> {
    return this.validateResponse(
      () => this.axios.post(`${BookingApi.baseUrl}/reservation`, reservation),
      createReservationSchema
    );
  }

  async getReservations(): Promise<Array<ReservationDto>> {
    return this.validateResponse(
      () => this.axios.get(`${BookingApi.baseUrl}/reservation`),
      z.array(reservationSchema)
    );
  }

  async getReservation(reservationId: string): Promise<ReservationDto> {
    return this.validateResponse(
      () => this.axios.get(`${BookingApi.baseUrl}/reservation/${reservationId}`),
      reservationSchema
    );
  }

  async updateReservation(
    reservationId: string,
    reservation: Partial<CreateReservationDto>
  ): Promise<ReservationDto> {
    return this.validateResponse(
      () => this.axios.patch(`${BookingApi.baseUrl}/reservation/${reservationId}`, reservation),
      reservationSchema
    );
  }

  async deleteReservation(reservationId: string): Promise<void> {
    return this.axios.delete(`${BookingApi.baseUrl}/reservation/${reservationId}`).then(() => undefined);
  }
}

