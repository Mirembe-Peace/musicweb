"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const crypto_1 = require("crypto");
const PESAPAL_BASE_URL = 'https://pay.pesapal.com/v3';
let PaymentsService = PaymentsService_1 = class PaymentsService {
    paymentsRepository;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(paymentsRepository) {
        this.paymentsRepository = paymentsRepository;
    }
    async initiatePayment(createPaymentDto) {
        try {
            const tokenRes = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    consumer_key: process.env.PESAPAL_CONSUMER_KEY,
                    consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
                }),
            });
            if (!tokenRes.ok) {
                throw new Error('Failed to get Pesapal token');
            }
            const tokenData = await tokenRes.json();
            const token = tokenData.token;
            if (!token) {
                throw new Error('Pesapal token missing');
            }
            const merchantReference = (0, crypto_1.randomUUID)();
            const orderRes = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: merchantReference,
                    currency: createPaymentDto.currency || 'UGX',
                    amount: createPaymentDto.amount,
                    description: createPaymentDto.description,
                    callback_url: createPaymentDto.callbackUrl,
                    notification_id: createPaymentDto.notification_id,
                    billing_address: {
                        email_address: createPaymentDto.email,
                        phone_number: createPaymentDto.phoneNumber || '',
                    },
                }),
            });
            if (!orderRes.ok) {
                throw new Error('Failed to submit Pesapal order');
            }
            const orderData = await orderRes.json();
            if (!orderData.redirect_url) {
                throw new Error('Redirect URL missing from Pesapal response');
            }
            const payment = this.paymentsRepository.create({
                id: merchantReference,
                orderTrackingId: orderData.order_tracking_id,
                merchantReference: merchantReference,
                amount: createPaymentDto.amount,
                currency: createPaymentDto.currency || 'UGX',
                description: createPaymentDto.description,
                email: createPaymentDto.email,
                phoneNumber: createPaymentDto.phoneNumber,
                status: 'PENDING',
            });
            await this.paymentsRepository.save(payment);
            return {
                redirect_url: orderData.redirect_url,
            };
        }
        catch (error) {
            this.logger.error('Payment initiation failed', error);
            throw new common_1.InternalServerErrorException(error instanceof Error ? error.message : 'Payment initiation failed');
        }
    }
    async handleIpn(orderTrackingId, orderMerchantReference) {
        this.logger.log(`IPN received for ${orderMerchantReference}`);
        const payment = await this.paymentsRepository.findOne({
            where: { id: orderMerchantReference },
        });
        if (payment) {
            payment.status = 'COMPLETED';
            await this.paymentsRepository.save(payment);
        }
        return {
            message: 'IPN handled',
            orderTrackingId,
            orderMerchantReference,
        };
    }
    findAll() {
        return this.paymentsRepository.find();
    }
    findOne(id) {
        return this.paymentsRepository.findOne({ where: { id } });
    }
    update(id, updatePaymentDto) {
        return `This action updates a #${id} payment`;
    }
    remove(id) {
        return `This action removes a #${id} payment`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map