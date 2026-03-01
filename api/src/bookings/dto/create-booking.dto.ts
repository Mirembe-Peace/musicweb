export class CreateBookingDto {
  fullName: string;
  email: string;
  phone: string;
  eventType: 'WEDDING' | 'CORPORATE' | 'FESTIVAL' | 'PRIVATE' | 'OTHER';
  eventDate: string;
  location: string;
  budgetUGX?: number;
  message?: string;
}
