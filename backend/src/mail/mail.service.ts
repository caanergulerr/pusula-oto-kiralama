import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    private getTransporter(): nodemailer.Transporter {
        const user = (process.env.GMAIL_USER || 'otokiralamapusula@gmail.com').replace(/"/g, '').trim();
        const pass = (process.env.GMAIL_PASS || '').replace(/[\s"]/g, '');
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user, pass },
        });
    }

    private getFromAddress(): string {
        const user = (process.env.GMAIL_USER || 'otokiralamapusula@gmail.com').replace(/"/g, '').trim();
        return `"Pusula Oto Kiralama" <${user}>`;
    }

    async sendVerificationEmail(toEmail: string, token: string): Promise<void> {
        const appUrl = (process.env.APP_URL || 'https://elazigotokiralamapusula.com').replace(/"/g, '').trim();
        const verifyUrl = `${appUrl}/dogrulama?token=${token}`;

        await this.getTransporter().sendMail({
            from: this.getFromAddress(),
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
        const appUrl = (process.env.APP_URL || 'https://elazigotokiralamapusula.com').replace(/"/g, '').trim();
        const resetUrl = `${appUrl}/sifre-sifirla?token=${token}`;

        await this.getTransporter().sendMail({
            from: this.getFromAddress(),
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

    async sendBookingConfirmation(booking: any, car: any, payment: any): Promise<void> {
        try {
            const recipientEmail = booking.customerEmail || (booking.user && booking.user.email);
            if (!recipientEmail) {
                this.logger.warn(`No recipient email found for booking ID: ${booking.id}`);
                return;
            }

            const formatDate = (d: any) => {
                if (!d) return '-';
                const dateObj = new Date(d);
                return dateObj.toLocaleString('tr-TR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                });
            };

            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f1f5f9;">
                    <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: -0.5px;">Pusula Oto Kiralama</h1>
                        <p style="color: #93c5fd; margin: 8px 0 0; font-size: 15px;">Rezervasyonunuz ve Ödemeniz Başarıyla Onaylandı! ✅</p>
                    </div>
                    <div style="background: #ffffff; padding: 36px 28px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <p style="color: #334155; font-size: 16px; margin-top: 0;">
                            Sayın <strong>${booking.customerName || 'Müşterimiz'}</strong>,
                        </p>
                        <p style="color: #64748b; line-height: 1.6; font-size: 15px;">
                            PayTR Sanal POS ile güvenli ödemeniz gerçekleşmiş olup rezervasyonunuz kesinleşmiştir. Detaylar aşağıda yer almaktadır:
                        </p>

                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
                                <tr style="border-bottom: 1px solid #e2e8f0;">
                                    <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Rezervasyon No:</td>
                                    <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #0284c7;">${booking.merchantOid || booking.id}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e2e8f0;">
                                    <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Kiralanan Araç:</td>
                                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${car ? `${car.brand} ${car.model} (${car.year})` : 'Araç Bilgisi'}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e2e8f0;">
                                    <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Alış Tarihi:</td>
                                    <td style="padding: 10px 0; text-align: right;">${formatDate(booking.startDate)}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e2e8f0;">
                                    <td style="padding: 10px 0; font-weight: bold; color: #64748b;">İade Tarihi:</td>
                                    <td style="padding: 10px 0; text-align: right;">${formatDate(booking.endDate)}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e2e8f0;">
                                    <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Kiralama Süresi:</td>
                                    <td style="padding: 10px 0; text-align: right;">${booking.days || 1} Gün</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e2e8f0;">
                                    <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Kasko Paketi:</td>
                                    <td style="padding: 10px 0; text-align: right;">${booking.insuranceType || 'STANDART'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0 4px; font-weight: bold; font-size: 16px; color: #0f172a;">Ödenen Toplam Tutar:</td>
                                    <td style="padding: 12px 0 4px; text-align: right; font-weight: bold; font-size: 18px; color: #16a34a;">₺${Number(payment?.amount || booking.totalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px;">
                            <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                                📍 <strong>Teslimat ve Destek:</strong> Aracınızı Elazığ ofisimizden veya havalimanından teslim alabilirsiniz. Sorularınız için 7/24 bizi arayabilirsiniz: <strong>+90 553 619 81 64</strong>
                            </p>
                        </div>

                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                            Pusula Oto Kiralama - Elazığ, Malatya, Tunceli, Diyarbakır Araç Kiralama Hizmetleri<br/>
                            📞 +90 553 619 81 64 | ✉️ otokiralamapusula@gmail.com
                        </p>
                    </div>
                </div>
            `;

            await this.getTransporter().sendMail({
                from: this.getFromAddress(),
                to: recipientEmail,
                subject: `Pusula Oto Kiralama - Rezervasyon Onayı (#${booking.merchantOid || booking.id})`,
                html,
            });
            this.logger.log(`Booking confirmation email sent to: ${recipientEmail}`);
        } catch (err: any) {
            this.logger.error(`Error sending booking confirmation email: ${err.message}`, err.stack);
        }
    }

    async sendAdminNewBookingNotification(booking: any, car: any, payment: any): Promise<void> {
        try {
            const adminEmail = process.env.GMAIL_USER || 'otokiralamapusula@gmail.com';
            const formatDate = (d: any) => {
                if (!d) return '-';
                return new Date(d).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
            };

            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #16a34a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: white;">
                        <h2 style="margin: 0;">🚨 Yeni Rezervasyon ve Başarılı Ödeme!</h2>
                    </div>
                    <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                        <p style="font-size: 15px; color: #334155;">Sitenizden yeni bir online rezervasyon ve PayTR ödemesi alındı:</p>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
                            <tr><td style="padding: 6px 0; color: #64748b;">Sipariş/Rez No:</td><td style="font-weight: bold; text-align: right;">${booking.merchantOid || booking.id}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Müşteri:</td><td style="font-weight: bold; text-align: right;">${booking.customerName || '-'}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Telefon:</td><td style="font-weight: bold; text-align: right;"><a href="tel:${booking.customerPhone}">${booking.customerPhone || '-'}</a></td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">E-posta:</td><td style="font-weight: bold; text-align: right;">${booking.customerEmail || '-'}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">T.C. / Pasaport:</td><td style="font-weight: bold; text-align: right;">${booking.identityNumber || '-'}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Araç:</td><td style="font-weight: bold; text-align: right;">${car ? `${car.brand} ${car.model} (${car.year})` : '-'}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Tarihler:</td><td style="font-weight: bold; text-align: right;">${formatDate(booking.startDate)} - ${formatDate(booking.endDate)} (${booking.days || 1} Gün)</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Kasko:</td><td style="font-weight: bold; text-align: right;">${booking.insuranceType || 'STANDART'}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b;">Ödenen Tutar:</td><td style="font-weight: bold; font-size: 16px; color: #16a34a; text-align: right;">₺${Number(payment?.amount || booking.totalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td></tr>
                        </table>
                    </div>
                </div>
            `;

            await this.getTransporter().sendMail({
                from: this.getFromAddress(),
                to: adminEmail,
                subject: `🔔 Yeni Rezervasyon: ${booking.customerName || 'Müşteri'} - ${car?.brand || ''} ${car?.model || ''}`,
                html,
            });
            this.logger.log(`Admin notification sent to: ${adminEmail}`);
        } catch (err: any) {
            this.logger.error(`Error sending admin notification: ${err.message}`);
        }
    }
}
