"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, ShieldAlert, RotateCcw, ShieldCheck, X } from "lucide-react";

export function TermsModal({ 
    type, 
    trigger 
}: { 
    type: "rental" | "cancellation" | "privacy"; 
    trigger?: React.ReactNode 
}) {
    const [open, setOpen] = useState(false);

    const contentMap = {
        rental: {
            title: "Mesafeli Araç Kiralama ve Hizmet Sözleşmesi",
            icon: FileText,
            body: (
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">1. TARAFLAR VE AMAÇ</h4>
                        <p>
                            İşbu sözleşme, Pusula Oto Kiralama (Kiraya Veren) ile web sitesi (elazigotokiralamapusula.com) üzerinden araç kiralama rezervasyonu yapan ve ödemesini gerçekleştiren Müşteri (Kiracı) arasında akdedilmiştir.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">2. SÜRÜCÜ VE EHLİYET KOŞULLARI</h4>
                        <p>
                            Kiracı, aracı teslim alırken geçerli sürücü belgesi ve kimlik/pasaport ibraz etmekle yükümlüdür. Ekonomik grup araçlar için en az 21 yaş ve 2 yıllık ehliyet; orta ve lüks grup araçlar için en az 25 yaş ve 3 yıllık ehliyet şartı aranır.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">3. TESLİMAT VE İADE</h4>
                        <p>
                            Araç, rezervasyonda belirtilen gün ve saatte Elazığ Merkez ofisi veya Elazığ Havalimanı teslimat noktasında teslim edilir ve aynı noktada teslim alınır. Gecikmelerde saatlik ek ücret veya günlük kiralama bedeli uygulanır.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">4. KASKO, SİGORTA VE KULLANIM</h4>
                        <p>
                            Kiralanan tüm araçlarımızda standart Zorunlu Mali Mesuliyet ve Kasko güvencesi dahildir. Mini veya Full Kasko tercih edilmişse poliçe kapsamındaki teminatlar geçerlidir. Alkol, uyuşturucu etkisi altında araç kullanımı veya yasal hız sınırlarının aşılması durumunda kasko ve sigortalar geçersiz kalır; tüm hukuki ve cezai sorumluluk kiracıya aittir.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">5. GÜVENLİK VE ÖDEME</h4>
                        <p>
                            Ödemeler PayTR 256-Bit SSL korumalı altyapı ile tahsil edilir. Kart bilgileri sistemlerimizde saklanmaz.
                        </p>
                    </div>
                </div>
            )
        },
        cancellation: {
            title: "İptal ve İade Koşulları",
            icon: RotateCcw,
            body: (
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">1. REZERVASYON İPTALİ VE ÜCRET İADESİ</h4>
                        <p>
                            Kiracı, araç alış saatine <strong>24 saat veya daha fazla</strong> süre kala rezervasyonunu iptal etmesi halinde, ödediği toplam kiralama bedeli <strong>kesintisiz %100</strong> olarak ödeme yapılan kredi kartına/banka hesabına iade edilir.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">2. 24 SAATTEN AZ KALAN İPTALLER</h4>
                        <p>
                            Araç teslim saatine 24 saatten daha az bir süre kala yapılan iptallerde ya da aracın teslim alınmaması (No-Show) durumunda 1 günlük kiralama ücreti kesilerek kalan tutar iade edilir.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">3. İADE SÜRESİ VE USULÜ</h4>
                        <p>
                            İptal onayı verildiği andan itibaren iade tutarı PayTR Sanal POS altyapısı üzerinden bankanıza aynı gün iletilir. Bankaların iç süreçlerine bağlı olarak tutarın ekstrenize yansıması 1-3 iş günü (banka kartlarında 3-7 gün) sürebilir.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">4. DEĞİŞİKLİK VE TARİH GÜNCELLEMESİ</h4>
                        <p>
                            Araç müsaitliğine bağlı olarak rezervasyon tarihleri, alış saatine 12 saat kalana kadar ücretsiz olarak değiştirilebilir.
                        </p>
                    </div>
                </div>
            )
        },
        privacy: {
            title: "Gizlilik, Güvenlik ve KVKK Aydınlatma Metni",
            icon: ShieldCheck,
            body: (
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">1. VERİ SORUMLUSU</h4>
                        <p>
                            Pusula Oto Kiralama olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca müşterilerimizin kişisel verilerinin güvenliğine azami önem göstermekteyiz.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">2. TOPLANAN VERİLER VE KULLANIM AMACI</h4>
                        <p>
                            Rezervasyon sırasında alınan Ad Soyad, Telefon, T.C. Kimlik / Pasaport No ve E-posta bilgileri yalnızca kiralama sözleşmesinin düzenlenmesi, faturalandırma, emniyet KABİS araç kiralama bildirim zorunluluğu ve bilgilendirme amacıyla işlenir.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">3. ÖDEME VE KART GÜVENLİĞİ</h4>
                        <p>
                            Sitemizde ödemeler BDDK lisanslı PayTR Sanal POS altyapısı ve 3D Secure güvencesiyle gerçekleşir. Kredi kartı numarası, son kullanma tarihi veya CVV kodları sitemizde kesinlikle tutulmaz ve saklanmaz.
                        </p>
                    </div>
                </div>
            )
        }
    };

    const current = contentMap[type];
    const Icon = current.icon;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <button type="button" className="text-blue-600 hover:text-blue-700 underline text-xs font-semibold">
                        {current.title}
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
                <DialogHeader className="border-b border-slate-100 pb-3 mb-3 text-left">
                    <DialogTitle className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
                        <Icon className="w-5 h-5 text-blue-600 shrink-0" />
                        {current.title}
                    </DialogTitle>
                </DialogHeader>
                {current.body}
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                        Anladım ve Kapat
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
