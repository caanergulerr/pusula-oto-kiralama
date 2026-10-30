"use client";

import { useEffect, useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { paymentService } from '@/services/payment.service';

interface PaytrModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
    merchantOid: string;
    totalAmount: number;
    carName: string;
}

export function PaytrModal({
    isOpen,
    onClose,
    token,
    merchantOid,
    totalAmount,
    carName,
}: PaytrModalProps) {
    const router = useRouter();
    const [isSimulating, setIsSimulating] = useState(false);
    const isMock = token.startsWith('mock_paytr');

    useEffect(() => {
        if (!isOpen || isMock) return;

        // Load PayTR iframe resizer script
        const scriptId = 'paytr-resizer-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        const initResizer = () => {
            if (typeof window !== 'undefined' && (window as any).iFrameResize) {
                try {
                    (window as any).iFrameResize({}, '#paytriframe');
                } catch (e) {
                    console.error('iFrameResize error:', e);
                }
            }
        };

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://www.paytr.com/js/iframeResizer.min.js';
            script.async = true;
            script.onload = () => {
                setTimeout(initResizer, 300);
            };
            document.body.appendChild(script);
        } else {
            initResizer();
        }
    }, [isOpen, isMock]);

    if (!isOpen) return null;

    const handleSimulateSuccess = async () => {
        setIsSimulating(true);
        try {
            await paymentService.simulateSuccess(merchantOid);
            router.push(`/odeme/basarili?oid=${encodeURIComponent(merchantOid)}`);
        } catch (err: any) {
            alert('Simülasyon hatası: ' + err.message);
            setIsSimulating(false);
        }
    };

    const handleSimulateFail = () => {
        router.push(`/odeme/hata?oid=${encodeURIComponent(merchantOid)}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-white leading-snug">PayTR 256-Bit Güvenli Ödeme</h3>
                            <p className="text-xs text-slate-300">
                                {carName} • <span className="text-green-400 font-bold">₺{totalAmount.toLocaleString('tr-TR')}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Kapat"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 min-h-[460px] flex flex-col items-center justify-center">
                    {isMock ? (
                        /* Geliştirme / Test Modu Simülasyon Kartı */
                        <div className="w-full max-w-lg bg-white rounded-2xl border border-blue-200 p-6 shadow-sm text-center">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-3">
                                Test / Geliştirme Modu
                            </span>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">
                                PayTR iFrame Simülatörü
                            </h4>
                            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                                Lokal geliştirme ortamındasınız. Rezervasyon ve ödeme kaydınız <strong>{merchantOid}</strong> koduyla hazırlandı. Aşağıdaki butonlarla ödeme akışını ve otomatik bildirimleri test edebilirsiniz:
                            </p>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs text-slate-700 space-y-1.5 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Sipariş No:</span>
                                    <span className="font-mono font-bold text-slate-800">{merchantOid}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Ödenecek Tutar:</span>
                                    <span className="font-bold text-green-600">₺{totalAmount.toLocaleString('tr-TR')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Güvenlik Hash:</span>
                                    <span className="text-green-600 font-medium">Doğrulandı (HMAC-SHA256)</span>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <button
                                    onClick={handleSimulateSuccess}
                                    disabled={isSimulating}
                                    className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    {isSimulating ? 'İşlem Tamamlanıyor...' : 'Başarılı Ödemeyi Simüle Et'}
                                </button>
                                <button
                                    onClick={handleSimulateFail}
                                    disabled={isSimulating}
                                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                                >
                                    Başarısız Ödemeyi Test Et
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Gerçek PayTR iFrame */
                        <div className="w-full flex-1">
                            <iframe
                                src={`https://www.paytr.com/odeme/guvenli/${token}`}
                                id="paytriframe"
                                frameBorder="0"
                                scrolling="no"
                                style={{ width: '100%', minHeight: '520px' }}
                                title="PayTR Sanal POS"
                            />
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>SSL & PayTR Güvenli Ödeme Altyapısı</span>
                    </div>
                    <span className="text-slate-400">Pusula Oto Kiralama</span>
                </div>
            </div>
        </div>
    );
}

