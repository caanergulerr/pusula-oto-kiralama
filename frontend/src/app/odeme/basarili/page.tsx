"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Calendar, Shield, CreditCard, ArrowRight, Phone, Car as CarIcon, MapPin } from 'lucide-react';
import { paymentService, PaymentStatusResponse } from '@/services/payment.service';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const oid = searchParams.get('oid') || '';
    const [details, setDetails] = useState<PaymentStatusResponse | null>(null);
    const [loading, setLoading] = useState(Boolean(oid));

    useEffect(() => {
        if (!oid) return;

        async function fetchDetails() {
            try {
                const data = await paymentService.getPaymentStatus(oid);
                setDetails(data);
            } catch (err) {
                console.error('Rezervasyon detayları alınamadı:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [oid]);

    const booking = details?.booking;
    const car = booking?.car;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('tr-TR', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 p-8 text-center text-white relative">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/40 shadow-inner">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                            Rezervasyonunuz Onaylandı!
                        </h1>
                        <p className="text-emerald-100 text-sm max-w-md mx-auto">
                            PayTR güvenli ödemeniz başarıyla gerçekleşti. Rezervasyon detaylarınız e-posta adresinize gönderildi.
                        </p>
                    </div>

                    {/* Booking Details Card */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {loading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3">
                                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-slate-500">Rezervasyon detayları yükleniyor...</p>
                            </div>
                        ) : (
                            <>
                                {/* Quick summary banner */}
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Sipariş / Rezervasyon No</p>
                                        <p className="font-mono font-bold text-slate-800 text-base">{oid || '-'}</p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="text-xs text-slate-400 font-medium">Ödenen Tutar</p>
                                        <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                                            ₺{Number(details?.amount || booking?.totalPrice || 0).toLocaleString('tr-TR')}
                                        </p>
                                    </div>
                                </div>

                                {/* Vehicle Information */}
                                {car && (
                                    <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                            <CarIcon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Kiralanan Araç</p>
                                            <h3 className="font-bold text-slate-900 text-lg">
                                                {car.brand} {car.model}
                                            </h3>
                                            <p className="text-xs text-slate-500">Model Yılı: {car.year}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Date and Customer Info Grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Alış Tarihi</span>
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">
                                            {formatDate(booking?.startDate)}
                                        </p>
                                    </div>

                                    <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">İade Tarihi</span>
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">
                                            {formatDate(booking?.endDate)}
                                        </p>
                                    </div>

                                    <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                                            <Shield className="w-4 h-4 text-emerald-600" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Kasko Paketi</span>
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">
                                            {booking?.insuranceType || 'STANDART'}
                                        </p>
                                    </div>

                                    <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                                            <CreditCard className="w-4 h-4 text-purple-600" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Ödeme Yöntemi</span>
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">
                                            PayTR 3D Secure / Sanal POS
                                        </p>
                                    </div>
                                </div>

                                {/* Pickup info */}
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-sm text-blue-900">
                                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Teslimat Bilgisi</p>
                                        <p className="text-xs text-blue-700 mt-0.5">
                                            Aracınızı Elazığ ofisimizden veya Elazığ Havalimanı transfer noktamızdan teslim alabilirsiniz. Sorularınız veya özel talepleriniz için bize ulaşabilirsiniz.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Link
                                href="/"
                                className="flex-1 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl text-center transition-colors shadow-md"
                            >
                                Ana Sayfaya Dön
                            </Link>
                            <Link
                                href="/cars"
                                className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl text-center transition-colors shadow-md flex items-center justify-center gap-2"
                            >
                                Diğer Araçları İncele
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Contact info footer */}
                        <div className="text-center pt-2">
                            <a
                                href="tel:+905536198164"
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                7/24 Çağrı Merkezi: +90 553 619 81 64
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}

