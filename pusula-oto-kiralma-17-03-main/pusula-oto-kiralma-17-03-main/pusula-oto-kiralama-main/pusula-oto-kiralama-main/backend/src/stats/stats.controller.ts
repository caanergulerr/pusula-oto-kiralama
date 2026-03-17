import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('dashboard')
    getDashboardStats() {
        return this.statsService.getDashboardStats();
    }

    @Get('revenue')
    getRevenueStats() {
        return this.statsService.getRevenueStats();
    }

    @Get('popular-cars')
    getPopularCars() {
        return this.statsService.getPopularCars();
    }

    @Get('recent-bookings')
    getRecentBookings() {
        return this.statsService.getRecentBookings();
    }
}
