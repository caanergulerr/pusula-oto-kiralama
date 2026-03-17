import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createBookingDto: any, @Request() req) {
        return this.bookingsService.create(createBookingDto, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('my-bookings')
    findMyBookings(@Request() req) {
        return this.bookingsService.findByUserId(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.bookingsService.updateStatus(id, status);
    }
}
