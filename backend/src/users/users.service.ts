import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.passwordHash || '', salt);

        const newUser = this.usersRepository.create({
            ...userData,
            passwordHash: hashedPassword,
        });

        return this.usersRepository.save(newUser);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    async findByVerificationToken(token: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ verificationToken: token });
    }

    async markEmailVerified(userId: string): Promise<void> {
        await this.usersRepository.update(userId, {
            isEmailVerified: true,
            verificationToken: null,
        });
    }

    async updateVerificationToken(userId: string, token: string): Promise<void> {
        await this.usersRepository.update(userId, { verificationToken: token });
    }

    async findByPasswordResetToken(token: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ passwordResetToken: token });
    }

    async setPasswordResetToken(userId: string, token: string, expiry: Date): Promise<void> {
        await this.usersRepository.update(userId, {
            passwordResetToken: token,
            passwordResetExpiry: expiry,
        });
    }

    async resetPassword(userId: string, newPassword: string): Promise<void> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await this.usersRepository.update(userId, {
            passwordHash: hashedPassword,
            passwordResetToken: null,
            passwordResetExpiry: null,
        });
    }
}
