import { Repository } from 'typeorm';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
export declare class PaymentsService {
    private readonly paymentsRepository;
    private readonly logger;
    constructor(paymentsRepository: Repository<Payment>);
    initiatePayment(createPaymentDto: CreatePaymentDto): Promise<{
        redirect_url: any;
    }>;
    handleIpn(orderTrackingId: string, orderMerchantReference: string): Promise<{
        message: string;
        orderTrackingId: string;
        orderMerchantReference: string;
    }>;
    findAll(): Promise<Payment[]>;
    findOne(id: string): Promise<Payment | null>;
    update(id: number, updatePaymentDto: UpdatePaymentDto): string;
    remove(id: number): string;
}
