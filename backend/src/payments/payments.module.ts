import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaytrService } from './paytr.service';
import { Payment } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CarsModule } from '../cars/cars.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Booking]),
    CarsModule,
    MailModule,
    ConfigModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaytrService],
  exports: [PaymentsService, PaytrService],
})
export class PaymentsModule { }
