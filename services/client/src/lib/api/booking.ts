import { z } from 'zod';
import { createReservationSchema, reservationSchema } from '@rapid-guide-io/contracts';
import { BaseApi } from './base';
import type {
  CreateReservationDto,
  GetReservationsFilterDto,
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

  async getReservations(filter?: GetReservationsFilterDto): Promise<Array<ReservationDto>> {
    const params = new URLSearchParams();
    if (filter?.tour_id) {
      params.append('tour_id', filter.tour_id);
    }
    if (filter?.date) {
      // Format date as ISO string for query parameter
      params.append('date', filter.date instanceof Date ? filter.date.toISOString() : filter.date);
    }
    
    const queryString = params.toString();
    const url = queryString 
      ? `${BookingApi.baseUrl}/reservation?${queryString}`
      : `${BookingApi.baseUrl}/reservation`;
    
    return this.validateResponse(
      () => this.axios.get(url),
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

