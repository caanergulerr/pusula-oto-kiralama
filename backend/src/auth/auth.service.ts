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
        const cleanEmail = (email || '').trim().toLowerCase();
        const user = await this.usersService.findOneByEmail(cleanEmail);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            if (!user.isEmailVerified) {
                await this.usersService.markEmailVerified(user.id);
                user.isEmailVerified = true;
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
        const cleanEmail = (registerDto.email || '').trim().toLowerCase();
        const existingUser = await this.usersService.findOneByEmail(cleanEmail);
        if (existingUser) {
            throw new ConflictException('Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın veya şifrenizi sıfırlayın.');
        }

        const fullName = registerDto.fullName || `${registerDto.firstName || ''} ${registerDto.lastName || ''}`.trim();

        // Admin hesapları kontrolü
        const adminEmails = ['otokiralamapusula@gmail.com', 'caaner.gulerr@gmail.com', 'cg158656@gmail.com'];
        let role = 'CUSTOMER';
        if (adminEmails.includes(cleanEmail)) {
            role = 'ADMIN';
        }

        // Doğrulama tokeni oluştur
        const verificationToken = uuidv4();

        await this.usersService.create({
            email: cleanEmail,
            passwordHash: registerDto.password,
            fullName: fullName,
            phone: registerDto.phone,
            role: role as any,
            verificationToken,
            isEmailVerified: true,
        });

        // Doğrulama maili gönder
        try {
            console.log('KAYIT DOĞRULAMA MAİLİ GÖNDERİLİYOR:', cleanEmail);
            await this.mailService.sendVerificationEmail(cleanEmail, verificationToken);
            console.log('KAYIT DOĞRULAMA MAİLİ GÖNDERİLDİ:', cleanEmail);
        } catch (err) {
            console.error('Mail gönderilemedi:', err);
        }

        return { message: 'Kayıt başarılı. Giriş yapabilirsiniz.' };
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
        const cleanEmail = (email || '').trim().toLowerCase();
        const user = await this.usersService.findOneByEmail(cleanEmail);
        if (!user) {
            throw new BadRequestException('Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.');
        }

        const token = uuidv4();
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 saat
        await this.usersService.setPasswordResetToken(user.id, token, expiry);

        console.log('ŞİFRE SIFIRLAMA MAİLİ GÖNDERİLİYOR:', cleanEmail);
        await this.mailService.sendPasswordResetEmail(cleanEmail, token);
        console.log('ŞİFRE SIFIRLAMA MAİLİ GÖNDERİLDİ:', cleanEmail);

        return { message: 'Şifre sıfırlama linki e-posta adresinize gönderildi.' };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.usersService.findByPasswordResetToken(token);
        if (!user || !user.passwordResetExpiry || new Date(user.passwordResetExpiry) < new Date()) {
            throw new BadRequestException('Geçersiz veya süresi dolmuş şifre sıfırlama linki.');
        }
        await this.usersService.resetPassword(user.id, newPassword);
        return { message: 'Şifreniz başarıyla güncellendi.' };
    }
}
