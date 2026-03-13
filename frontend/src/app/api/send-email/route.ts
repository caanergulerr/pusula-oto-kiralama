import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { toEmail, subject, html } = body;

        if (!toEmail || !subject || !html) {
            return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
        }

        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error('RESEND_API_KEY environment variable is not set!');
            return NextResponse.json({ error: 'Mail servisi yapılandırılmamış.' }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        const { data, error } = await resend.emails.send({
            from: 'Pusula Oto Kiralama <onboarding@resend.dev>',
            to: [toEmail],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend API hatası:', error);
            return NextResponse.json({ error: 'E-posta gonderilemedi.', details: error.message }, { status: 500 });
        }

        console.log('E-posta başarıyla gönderildi (Resend):', data?.id);
        return NextResponse.json({ message: 'E-posta basariyla gonderildi.', id: data?.id }, { status: 200 });

    } catch (error: any) {
        console.error('E-posta gonderim hatasi:', error);
        return NextResponse.json({ error: 'E-posta gonderilemedi.', details: error.message }, { status: 500 });
    }
}
