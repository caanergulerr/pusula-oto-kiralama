import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CarsModule } from '../cars/cars.module';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    CarsModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule { }
