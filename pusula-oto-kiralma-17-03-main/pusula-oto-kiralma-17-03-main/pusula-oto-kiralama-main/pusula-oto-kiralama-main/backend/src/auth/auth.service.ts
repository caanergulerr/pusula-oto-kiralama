import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            if (!user.isEmailVerified) {
                throw new UnauthorizedException('EMAIL_NOT_VERIFIED');
            }
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: any) {
        const existingUser = await this.usersService.findOneByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const fullName = registerDto.fullName || `${registerDto.firstName} ${registerDto.lastName}`.trim();

        // Special check for Admin
        let role = 'CUSTOMER';
        if (registerDto.email.toLowerCase() === 'otokiralamapusula@gmail.com') {
            role = 'ADMIN';
        }

        // Doğrulama tokeni oluştur
        const verificationToken = uuidv4();

        const user = await this.usersService.create({
            email: registerDto.email,
            passwordHash: registerDto.password,
            fullName: fullName,
            phone: registerDto.phone,
            role: role as any,
            verificationToken,
            isEmailVerified: false,
        });

        // Doğrulama maili gönder
        try {
            await this.mailService.sendVerificationEmail(registerDto.email, verificationToken);
        } catch (err) {
            console.error('Mail gönderilemedi:', err);
        }

        return { message: 'Kayıt başarılı. E-posta adresinizi doğrulayın.' };
    }

    async verifyEmail(token: string) {
        const user = await this.usersService.findByVerificationToken(token);
        if (!user) {
            throw new BadRequestException('Geçersiz veya süresi dolmuş doğrulama linki.');
        }
        await this.usersService.markEmailVerified(user.id);
        return { message: 'E-posta adresiniz başarıyla doğrulandı.' };
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return { message: 'Eğer bu e-posta kayıtlıysa sıfırlama linki gönderildi.' };
        }

        const token = uuidv4();
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 saat
        await this.usersService.setPasswordResetToken(user.id, token, expiry);

        console.log('MAİL GÖNDERME BAŞLADI:', email);
        await this.mailService.sendPasswordResetEmail(email, token);
        console.log('MAİL GÖNDERME BAŞARILI:', email);

        return { message: 'Eğer bu e-posta kayıtlıysa sıfırlama linki gönderildi.' };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.usersService.findByPasswordResetToken(token);
        if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
            throw new BadRequestException('Geçersiz veya süresi dolmuş şifre sıfırlama linki.');
        }
        await this.usersService.resetPassword(user.id, newPassword);
        return { message: 'Şifreniz başarıyla güncellendi.' };
    }
}
