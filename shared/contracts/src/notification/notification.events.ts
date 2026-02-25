export const NOTIFICATION_EVENTS = {
  RESERVATION_CREATED: 'reservation.created',
  RESERVATION_JOINED: 'reservation.joined',
  RESERVATION_CANCELLED: 'reservation.cancelled',
  TOUR_CREATED: 'tour.created',
  TOUR_UPDATED: 'tour.updated',
  TOUR_DELETED: 'tour.deleted',
  USER_REGISTERED: 'user.registered',
  GUIDE_CREATED: 'guide.created',
  GUIDE_UPDATED: 'guide.updated',
  TRAVELLER_CREATED: 'traveller.created',
  TRAVELLER_UPDATED: 'traveller.updated',
} as const;

export type NotificationEvent = (typeof NOTIFICATION_EVENTS)[keyof typeof NOTIFICATION_EVENTS];
