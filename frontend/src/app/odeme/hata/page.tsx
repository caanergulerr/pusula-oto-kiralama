"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, Phone, ArrowLeft, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';

function PaymentErrorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const oid = searchParams.get('oid') || '';

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 sm:px-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 p-8 text-center text-white">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/40 shadow-inner">
                            <XCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                            Ödeme Tamamlanamadı
                        </h1>
                        <p className="text-red-100 text-sm max-w-sm mx-auto">
                            İşlem bankanız veya PayTR tarafından onaylanmadı veya işlem iptal edildi.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Notice Box */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                                <p className="font-bold mb-1">Kartınızdan Herhangi Bir Ücret Çekilmedi</p>
                                <p className="text-amber-700">
                                    Limit yetersizliği, 3D Secure onay süresi aşımı veya kart bilgilerinin hatalı girilmesi sebebiyle ödeme reddedilmiş olabilir.
                                </p>
                            </div>
                        </div>

                        {oid && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center text-xs">
                                <span className="text-slate-500">İşlem Referansı:</span>
                                <span className="font-mono font-bold text-slate-700">{oid}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={() => router.back()}
                                className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl text-center transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Tekrar Dene
                            </button>

                            <Link
                                href="/cars"
                                className="w-full py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl text-center transition-colors block"
                            >
                                Araçlar Sayfasına Dön
                            </Link>

                            <div className="pt-4 border-t border-slate-200 text-center">
                                <p className="text-xs text-slate-500 mb-2">
                                    Yardıma mı ihtiyacınız var? Telefonla rezervasyon oluşturabilirsiniz:
                                </p>
                                <a
                                    href="tel:+905536198164"
                                    className="inline-flex items-center gap-2 py-2.5 px-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-sm rounded-xl transition-colors border border-emerald-200"
                                >
                                    <Phone className="w-4 h-4" />
                                    +90 553 619 81 64 (7/24 Destek)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <PaymentErrorContent />
        </Suspense>
    );
}

