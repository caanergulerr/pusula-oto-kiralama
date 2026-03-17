import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Request() req) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user) {
            // This should rarely happen if AuthGuard passes, but handles deleted users
            throw new Error('User not found');
        }
        const { passwordHash, ...result } = user;
        return result;
    }
}
