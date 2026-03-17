import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        private configService: ConfigService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || 'mock_key', {
            apiVersion: '2026-01-28.clover' as any, // Cast to any or matching version to avoid TS check issues with preview versions
        });
    }

    async createPaymentIntent(amount: number, currency: string = 'try') {
        // Amount should be in smallest currency unit (e.g., cents/kuruş)
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            payment_method_types: ['card'],
        });

        return {
            clientSecret: paymentIntent.client_secret,
            transactionId: paymentIntent.id,
        };
    }

    async createPayment(bookingId: string, amount: number, transactionId: string) {
        const payment = this.paymentsRepository.create({
            amount,
            currency: 'TRY',
            provider: 'STRIPE',
            transactionId,
            status: PaymentStatus.PENDING,
            bookingId
        });
        return this.paymentsRepository.save(payment);
    }
}
