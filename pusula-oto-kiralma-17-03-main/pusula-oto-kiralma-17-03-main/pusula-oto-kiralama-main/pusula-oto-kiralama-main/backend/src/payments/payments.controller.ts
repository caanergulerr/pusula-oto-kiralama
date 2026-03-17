import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('create-intent')
    async createIntent(@Body() body: { amount: number }) {
        return this.paymentsService.createPaymentIntent(body.amount);
    }
}
