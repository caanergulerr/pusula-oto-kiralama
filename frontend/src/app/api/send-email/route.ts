import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { toEmail, subject, html } = body;

        if (!toEmail || !subject || !html) {
            return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NEXT_PUBLIC_GMAIL_USER || 'otokiralamapusula@gmail.com',
                pass: (process.env.GMAIL_PASS || 'nqifvtyhupxolxna').replace(/\s/g, ''),
            },
        });

        const fromEmail = `"Pusula Oto Kiralama" <${process.env.NEXT_PUBLIC_GMAIL_USER || 'otokiralamapusula@gmail.com'}>`;

        await transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: subject,
            html: html,
        });

        return NextResponse.json({ message: 'E-posta basariyla gonderildi.' }, { status: 200 });
    } catch (error: any) {
        console.error('E-posta gonderim hatasi:', error);
        return NextResponse.json({ error: 'E-posta gonderilemedi.', details: error.message }, { status: 500 });
    }
}
