import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../cars/entities/car.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Car)
        private carsRepository: Repository<Car>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async getDashboardStats() {
        // Total counts
        const totalCars = await this.carsRepository.count();
        const totalBookings = await this.bookingsRepository.count();
        const totalUsers = await this.usersRepository.count();

        // Available cars
        const availableCars = await this.carsRepository
            .createQueryBuilder('car')
            .where('car.availableStock > 0')
            .getCount();

        // Total revenue
        const revenueResult = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('SUM(booking.totalPrice)', 'total')
            .where("booking.status != 'CANCELLED'")
            .getRawOne();

        const totalRevenue = parseFloat(revenueResult?.total || '0');

        // Pending bookings
        const pendingBookings = await this.bookingsRepository
            .createQueryBuilder('booking')
            .where("booking.status = 'PENDING'")
            .getCount();

        // Active bookings
        const activeBookings = await this.bookingsRepository
            .createQueryBuilder('booking')
            .where("booking.status = 'ACTIVE'")
            .getCount();

        return {
            totalCars,
            availableCars,
            totalBookings,
            pendingBookings,
            activeBookings,
            totalUsers,
            totalRevenue,
        };
    }

    async getRevenueStats() {
        // Monthly revenue for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select("FORMAT(booking.startDate, 'yyyy-MM')", 'month')
            .addSelect('SUM(booking.totalPrice)', 'revenue')
            .addSelect('COUNT(booking.id)', 'count')
            .where('booking.startDate >= :sixMonthsAgo', { sixMonthsAgo })
            .andWhere("booking.status != 'CANCELLED'")
            .groupBy("FORMAT(booking.startDate, 'yyyy-MM')")
            .orderBy('month', 'ASC')
            .getRawMany();

        return monthlyRevenue;
    }

    async getPopularCars() {
        const popularCars = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('booking.carId', 'carId')
            .addSelect('COUNT(booking.id)', 'bookingCount')
            .groupBy('booking.carId')
            .orderBy('bookingCount', 'DESC')
            .limit(5)
            .getRawMany();

        // Get car details
        const carsWithStats = await Promise.all(
            popularCars.map(async (item) => {
                const car = await this.carsRepository.findOne({
                    where: { id: item.carId },
                });
                return {
                    ...car,
                    bookingCount: parseInt(item.bookingCount),
                };
            })
        );

        return carsWithStats;
    }

    async getRecentBookings(limit: number = 5) {
        return this.bookingsRepository.find({
            relations: ['car', 'user'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
}
