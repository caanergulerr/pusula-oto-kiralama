import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: (process.env.GMAIL_PASS || '').replace(/\s/g, ''),
            },
        });
    }

    async sendVerificationEmail(toEmail: string, token: string): Promise<void> {
        const appUrl = process.env.APP_URL || 'http://localhost:3001';
        const verifyUrl = `${appUrl}/dogrulama?token=${token}`;

        await this.transporter.sendMail({
            from: `"Pusula Oto Kiralama" <${process.env.GMAIL_USER}>`,
            to: toEmail,
            subject: 'Pusula Oto Kiralama - E-posta Adresinizi Doğrulayın',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Pusula Oto Kiralama</h1>
                        <p style="color: #93c5fd; margin: 8px 0 0;">Elazığ'ın En Güvenilir Araç Kiralama Hizmeti</p>
                    </div>
                    <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
                        <h2 style="color: #1e293b; margin: 0 0 16px;">E-posta Adresinizi Doğrulayın</h2>
                        <p style="color: #64748b; line-height: 1.6;">
                            Merhaba! Pusula Oto Kiralama'ya kayıt olduğunuz için teşekkür ederiz. 
                            Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın.
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${verifyUrl}" 
                               style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; 
                                      text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                                ✉️ Hesabımı Doğrula
                            </a>
                        </div>
                        <p style="color: #94a3b8; font-size: 13px; text-align: center;">
                            Bu link 24 saat geçerlidir. Eğer bu kaydı siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                            📞 +90 553 619 81 64 | ✉️ otokiralamapusula@gmail.com
                        </p>
                    </div>
                </div>
            `,
        });
    }

    async sendPasswordResetEmail(toEmail: string, token: string): Promise<void> {
        const appUrl = process.env.APP_URL || 'http://localhost:3001';
        const resetUrl = `${appUrl}/sifre-sifirla?token=${token}`;

        await this.transporter.sendMail({
            from: `"Pusula Oto Kiralama" <${process.env.GMAIL_USER}>`,
            to: toEmail,
            subject: 'Pusula Oto Kiralama - Şifre Sıfırlama',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Pusula Oto Kiralama</h1>
                        <p style="color: #93c5fd; margin: 8px 0 0;">Şifre Sıfırlama Talebi</p>
                    </div>
                    <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
                        <h2 style="color: #1e293b; margin: 0 0 16px;">Şifrenizi Sıfırlayın</h2>
                        <p style="color: #64748b; line-height: 1.6;">
                            Şifre sıfırlama talebi aldık. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${resetUrl}" 
                               style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; 
                                      text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                                🔑 Şifremi Sıfırla
                            </a>
                        </div>
                        <p style="color: #94a3b8; font-size: 13px; text-align: center;">
                            Bu link 1 saat geçerlidir. Eğer bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                            📞 +90 553 619 81 64 | ✉️ otokiralamapusula@gmail.com
                        </p>
                    </div>
                </div>
            `,
        });
    }
}
