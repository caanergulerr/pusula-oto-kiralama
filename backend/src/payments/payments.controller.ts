import { Controller, Post, Body, Req, Res, Get, Param, BadRequestException, Logger } from '@nestjs/common';
import { PaymentsService, CreateBookingPaymentDto } from './payments.service';
import { PaytrCallbackDto } from './paytr.service';
import type { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
    private readonly logger = new Logger(PaymentsController.name);

    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('paytr/create-token')
    async createPaytrToken(@Body() body: CreateBookingPaymentDto, @Req() req: Request) {
        const clientIp =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress ||
            '85.105.1.1';

        return this.paymentsService.initiateBookingPayment(body, clientIp);
    }

    @Post('paytr/callback')
    async handlePaytrCallback(@Body() body: PaytrCallbackDto, @Res() res: Response) {
        this.logger.log(`PayTR webhook triggered for order: ${body.merchant_oid}`);
        
        const result = await this.paymentsService.handlePaytrCallback(body);

        // PayTR dokümantasyonu gereği yalnızca düz metin "OK" dönülmelidir
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(result);
    }

    @Get('status/:merchantOid')
    async getPaymentStatus(@Param('merchantOid') merchantOid: string) {
        return this.paymentsService.getPaymentByMerchantOid(merchantOid);
    }

    @Post('paytr/simulate-success/:merchantOid')
    async simulateSuccess(@Param('merchantOid') merchantOid: string, @Res() res: Response) {
        if (process.env.NODE_ENV === 'production') {
            throw new BadRequestException('Simülasyon endpointi yalnızca geliştirme ortamında kullanılabilir.');
        }

        const result = await this.paymentsService.simulateSuccess(merchantOid);
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(result);
    }
}
