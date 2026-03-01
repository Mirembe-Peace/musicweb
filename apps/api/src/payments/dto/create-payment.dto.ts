export class CreatePaymentDto {
  amount: number;
  currency?: string;
  description: string;
  email: string;
  phoneNumber?: string;
  callbackUrl: string;
  notification_id?: string; // Optional if we hardcode or fetch from env
  static currency: string;
  static amount: any;
  static description: any;
  static callbackUrl: any;
  static notification_id: any;
  static email: any;
  static phoneNumber: string;
}
