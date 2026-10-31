import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        try {
            const adminEmails = ['caaner.gulerr@gmail.com', 'otokiralamapusula@gmail.com', 'cg158656@gmail.com'];
            for (const adminEmail of adminEmails) {
                const existing = await this.findOneByEmail(adminEmail);
                if (existing) {
                    if (existing.role !== UserRole.ADMIN || !existing.isEmailVerified) {
                        await this.usersRepository.update(existing.id, {
                            role: UserRole.ADMIN,
                            isEmailVerified: true,
                        });
                        console.log(`✅ Admin yetkisi ve doğrulaması güncellendi: ${adminEmail}`);
                    }
                } else if (adminEmail === 'caaner.gulerr@gmail.com' || adminEmail === 'otokiralamapusula@gmail.com') {
                    const salt = await bcrypt.genSalt();
                    const hashedPassword = await bcrypt.hash('Pusula2024!', salt);
                    const admin = this.usersRepository.create({
                        email: adminEmail,
                        fullName: 'Caner Güler',
                        passwordHash: hashedPassword,
                        role: UserRole.ADMIN,
                        isEmailVerified: true,
                    });
                    await this.usersRepository.save(admin);
                    console.log(`✅ Admin kullanıcısı (${adminEmail}) otomatik oluşturuldu.`);
                }
            }
        } catch (err) {
            console.error('Admin kullanıcısı oluşturulurken hata:', err);
        }
    }

    async create(userData: Partial<User>): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.passwordHash || '', salt);
        const cleanEmail = (userData.email || '').trim().toLowerCase();

        const newUser = this.usersRepository.create({
            ...userData,
            email: cleanEmail,
            passwordHash: hashedPassword,
        });

        return this.usersRepository.save(newUser);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const cleanEmail = (email || '').trim().toLowerCase();
        return this.usersRepository
            .createQueryBuilder('user')
            .where('LOWER(TRIM(user.email)) = :email', { email: cleanEmail })
            .getOne();
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
            isEmailVerified: true,
            passwordResetToken: null,
            passwordResetExpiry: null,
        });
    }
}
