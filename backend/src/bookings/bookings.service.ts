import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, And } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CarsService } from '../cars/cars.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private carsService: CarsService,
    ) { }

    async findByUserId(userId: string) {
        return this.bookingsRepository.find({
            where: { userId },
            relations: ['car'],
            order: { startDate: 'DESC' }
        });
    }

    async findAll() {
        return this.bookingsRepository.find({
            relations: ['car', 'user'],
            order: { startDate: 'DESC' }
        });
    }

    async updateStatus(id: string, status: string) {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['car']
        });
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        const oldStatus = booking.status;
        booking.status = status as any;

        // Manage stock based on status change
        if (oldStatus !== 'CANCELLED' && status === 'CANCELLED') {
            // Increase available stock when cancelled
            await this.carsService.updateStock(booking.carId, 1);
        } else if (oldStatus !== 'COMPLETED' && status === 'COMPLETED') {
            // Increase available stock when completed
            await this.carsService.updateStock(booking.carId, 1);
        }

        return this.bookingsRepository.save(booking);
    }

    async create(createBookingDto: any, userId: string) {
        const { carId, startDate, endDate } = createBookingDto;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (start < now) {
            throw new BadRequestException('Booking start date cannot be in the past');
        }

        if (end <= start) {
            throw new BadRequestException('End date must be after start date');
        }

        // Check if car exists and has available stock
        const car = await this.carsService.findOne(carId);

        if (car.availableStock <= 0) {
            throw new BadRequestException('This car is currently not available');
        }

        // Check for conflicts
        // Overlap: (ExistingStart <= NewEnd) AND (ExistingEnd >= NewStart)
        const conflictingBooking = await this.bookingsRepository.findOne({
            where: {
                carId,
                status: And(
                    // Not strictly typed here without complex FindOperator, usually simplified via query builder or raw logic.
                    // TypeORM 'Not' 'Equal' etc are cleaner but for ranges:
                    // We want: conflict if overlap.
                    // let's use QueryBuilder for clarity on ranges
                ) as any, // bypassing for builder below
            },
        });

        // Better use createQueryBuilder for date ranges to handle strict overlaps
        const conflict = await this.bookingsRepository.createQueryBuilder('booking')
            .where('booking.carId = :carId', { carId })
            .andWhere('booking.status != :cancelled', { cancelled: 'CANCELLED' })
            .andWhere('booking.startDate <= :end', { end })
            .andWhere('booking.endDate >= :start', { start })
            .getOne();

        if (conflict) {
            throw new ConflictException('Car is already booked for these dates');
        }

        // Calculate price
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((end.getTime() - start.getTime()) / oneDay));
        // Minimum 1 day charge
        const days = diffDays === 0 ? 1 : diffDays;

        // Ensure accurate decimal math or use simple float for now
        const totalPrice = days * Number(car.dailyPrice);

        const booking = this.bookingsRepository.create({
            carId,
            userId,
            startDate: start,
            endDate: end,
            totalPrice,
            status: 'PENDING' as any
        });

        // Decrease available stock when booking is created
        await this.carsService.updateStock(carId, -1);

        return this.bookingsRepository.save(booking);
    }
}
