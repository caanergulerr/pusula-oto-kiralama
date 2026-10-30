import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { CarsService } from '../cars/cars.service';
import { MailService } from '../mail/mail.service';
import { PaytrService, PaytrCallbackDto } from './paytr.service';

export class CreateBookingPaymentDto {
    carId: string;
    startDate: string;
    endDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    identityNumber: string;
    insuranceType?: string; // STANDART, MINI, FULL
    address?: string;
    userId?: string;
}

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private carsService: CarsService,
        private mailService: MailService,
        private paytrService: PaytrService,
    ) { }

    async initiateBookingPayment(dto: CreateBookingPaymentDto, userIp: string) {
        if (!dto.carId) throw new BadRequestException('Araç ID zorunludur.');
        if (!dto.startDate || !dto.endDate) throw new BadRequestException('Alış ve iade tarihleri zorunludur.');
        if (!dto.customerName || !dto.customerPhone || !dto.customerEmail || !dto.identityNumber) {
            throw new BadRequestException('Müşteri adı, telefon, e-posta ve T.C. kimlik numarası zorunludur.');
        }

        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        const now = new Date();

        // 1 saat tolerans ile geçmiş tarih kontrolü
        if (start.getTime() < now.getTime() - 3600000) {
            throw new BadRequestException('Alış tarihi geçmiş bir zaman olamaz.');
        }

        if (end <= start) {
            throw new BadRequestException('İade tarihi alış tarihinden sonra olmalıdır.');
        }

        // Gün hesabı (minimum 1 gün)
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

        // Araç ve stok kontrolü
        const car = await this.carsService.findOne(dto.carId);
        if (!car) throw new NotFoundException('Araç bulunamadı.');
        if (car.availableStock <= 0) {
            throw new BadRequestException('Seçilen araç şu anda müsait değil.');
        }

        // Tarih çakışma kontrolü
        const conflict = await this.bookingsRepository.createQueryBuilder('booking')
            .where('booking.carId = :carId', { carId: dto.carId })
            .andWhere('booking.status NOT IN (:...ignored)', { ignored: [BookingStatus.CANCELLED, BookingStatus.FAILED] })
            .andWhere('booking.startDate <= :end', { end })
            .andWhere('booking.endDate >= :start', { start })
            .getOne();

        if (conflict) {
            throw new ConflictException('Bu araç seçilen tarihler arasında başka bir rezervasyon için ayrılmış.');
        }

        // Kasko ve Fiyatlandırma
        const insuranceType = (dto.insuranceType || 'STANDART').toUpperCase();
        let insuranceRate = 0;
        if (insuranceType === 'MINI') insuranceRate = 300;
        else if (insuranceType === 'FULL') insuranceRate = 500;

        const insurancePrice = insuranceRate * diffDays;
        const dailyPrice = Number(car.dailyPrice);
        const carTotal = dailyPrice * diffDays;
        const totalPrice = carTotal + insurancePrice;

        // PayTR merchant_oid üretimi (yalnızca harf ve rakam, benzersiz)
        const merchantOid = `PUSULA${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;

        // Rezervasyon kaydını PENDING olarak oluştur
        const booking = this.bookingsRepository.create({
            carId: dto.carId,
            userId: dto.userId || null,
            startDate: start,
            endDate: end,
            totalPrice,
            days: diffDays,
            customerName: dto.customerName,
            customerPhone: dto.customerPhone,
            customerEmail: dto.customerEmail,
            identityNumber: dto.identityNumber,
            insuranceType,
            insurancePrice,
            merchantOid,
            status: BookingStatus.PENDING,
        });

        const savedBooking = await this.bookingsRepository.save(booking);

        // Ödeme kaydını PENDING olarak oluştur
        const payment = this.paymentsRepository.create({
            amount: totalPrice,
            currency: 'TL',
            provider: 'PAYTR',
            merchantOid,
            status: PaymentStatus.PENDING,
            bookingId: savedBooking.id,
        });

        await this.paymentsRepository.save(payment);

        // PayTR iFrame Token Talebi
        const tokenResult = await this.paytrService.getIframeToken({
            userIp,
            merchantOid,
            email: dto.customerEmail,
            paymentAmount: totalPrice,
            userName: dto.customerName,
            userAddress: dto.address || 'Elazığ',
            userPhone: dto.customerPhone,
            basketItems: [
                [`${car.brand} ${car.model} (${diffDays} Gün Kiralama)`, totalPrice.toFixed(2), 1],
            ],
        });

        return {
            status: 'success',
            token: tokenResult.token,
            iframeUrl: tokenResult.iframeUrl,
            merchantOid,
            bookingId: savedBooking.id,
            totalPrice,
            days: diffDays,
            insurancePrice,
            dailyPrice,
        };
    }

    async handlePaytrCallback(body: PaytrCallbackDto): Promise<string> {
        this.logger.log(`Received PayTR callback for merchant_oid=${body.merchant_oid}, status=${body.status}`);

        const isValid = this.paytrService.verifyCallbackHash(body);
        if (!isValid) {
            this.logger.error(`PayTR notification failed: bad hash for oid=${body.merchant_oid}`);
            return 'PAYTR notification failed: bad hash';
        }

        const payment = await this.paymentsRepository.findOne({
            where: { merchantOid: body.merchant_oid },
            relations: ['booking', 'booking.car'],
        });

        if (!payment) {
            this.logger.error(`Payment not found for merchant_oid=${body.merchant_oid}`);
            return 'OK';
        }

        if (body.status === 'success') {
            if (payment.status !== PaymentStatus.SUCCESS) {
                payment.status = PaymentStatus.SUCCESS;
                payment.transactionId = body.merchant_oid;
                await this.paymentsRepository.save(payment);

                if (payment.booking) {
                    payment.booking.status = BookingStatus.CONFIRMED;
                    await this.bookingsRepository.save(payment.booking);

                    // Stok azalt
                    try {
                        await this.carsService.updateStock(payment.booking.carId, -1);
                    } catch (stockErr: any) {
                        this.logger.error(`Failed to decrease stock: ${stockErr.message}`);
                    }

                    // E-posta gönderimleri
                    await this.mailService.sendBookingConfirmation(payment.booking, payment.booking.car, payment);
                    await this.mailService.sendAdminNewBookingNotification(payment.booking, payment.booking.car, payment);
                }
            }
        } else {
            payment.status = PaymentStatus.FAILED;
            payment.errorMessage = body.failed_reason_msg || 'PayTR ödeme başarısız';
            await this.paymentsRepository.save(payment);

            if (payment.booking) {
                payment.booking.status = BookingStatus.FAILED;
                await this.bookingsRepository.save(payment.booking);
            }
        }

        return 'OK';
    }

    async getPaymentByMerchantOid(merchantOid: string) {
        const payment = await this.paymentsRepository.findOne({
            where: { merchantOid },
            relations: ['booking', 'booking.car'],
        });

        if (!payment) {
            throw new NotFoundException(`Rezervasyon bulunamadı: ${merchantOid}`);
        }

        return {
            merchantOid: payment.merchantOid,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            createdAt: payment.createdAt,
            booking: payment.booking,
        };
    }

    // Geliştirme/Test ortamında lokal testi kolaylaştırmak için
    async simulateSuccess(merchantOid: string): Promise<string> {
        const payment = await this.paymentsRepository.findOne({
            where: { merchantOid },
            relations: ['booking', 'booking.car'],
        });

        if (!payment) {
            throw new NotFoundException(`Ödeme/Rezervasyon bulunamadı: ${merchantOid}`);
        }

        payment.status = PaymentStatus.SUCCESS;
        payment.transactionId = `SIM_${merchantOid}`;
        await this.paymentsRepository.save(payment);

        if (payment.booking) {
            payment.booking.status = BookingStatus.CONFIRMED;
            await this.bookingsRepository.save(payment.booking);

            try {
                await this.carsService.updateStock(payment.booking.carId, -1);
            } catch (stockErr: any) {
                this.logger.error(`Failed to decrease stock: ${stockErr.message}`);
            }

            await this.mailService.sendBookingConfirmation(payment.booking, payment.booking.car, payment);
            await this.mailService.sendAdminNewBookingNotification(payment.booking, payment.booking.car, payment);
        }

        return 'OK';
    }
}
