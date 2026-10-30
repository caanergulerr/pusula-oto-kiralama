import { Metadata } from "next";
import { ShieldCheck, FileText, RotateCcw, Lock, CheckCircle, Phone } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Kiralama Koşulları & Sözleşmeler | Pusula Oto Kiralama",
    description: "Pusula Oto Kiralama araç kiralama koşulları, mesafeli satış sözleşmesi, iptal ve iade politikası ile KVKK aydınlatma metni.",
};

export default function KiralamaKosullariPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider inline-block mb-3 border border-blue-400/30">
                            Güvenli Kiralama & Hukuki Bilgilendirme
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                            Kiralama Koşulları ve Sözleşmeler
                        </h1>
                        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                            Pusula Oto Kiralama olarak şeffaflık, müşteri memnuniyeti ve 256-Bit SSL güvenli ödeme standartlarıyla hizmet veriyoruz.
                        </p>
                    </div>
                </div>

                {/* Section 1: Mesafeli Araç Kiralama Sözleşmesi */}
                <div id="mesafeli-satis" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Mesafeli Araç Kiralama Sözleşmesi</h2>
                            <p className="text-xs text-slate-500">6502 Sayılı Tüketicinin Korunması Hakkında Kanun uyarınca düzenlenmiştir.</p>
                        </div>
                    </div>

                    <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                        <p><strong>1. Taraflar:</strong> İşbu sözleşme, Pusula Oto Kiralama (Elazığ Merkez) ile web sitesi üzerinden araç kiralama rezervasyonu gerçekleştiren Müşteri (Kiracı) arasındadır.</p>
                        <p><strong>2. Ehliyet ve Yaş Şartları:</strong> Ekonomik sınıf araçlar için en az 21 yaş ve 2 yıllık ehliyet; orta/lüks segment araçlar için 25 yaş ve 3 yıllık geçerli sürücü belgesi aranır.</p>
                        <p><strong>3. Teslimat:</strong> Araçlar tam bakımlı, temiz ve belirtilen gün/saatte teslim edilir. Teslimat Elazığ Merkez ofisimizden veya Elazığ Havalimanı transfer noktasından sağlanır.</p>
                        <p><strong>4. Sigorta & Kasko Kapsamı:</strong> Fiyatlarımıza Standart Kasko dahildir. İsteğe bağlı olarak Mini Kasko (+₺300/gün) veya Full Kasko (+₺500/gün) tercih edilebilir. Alkol ve uyuşturucu etkisi altında kullanım veya yasal hız limitlerinin aşılması durumunda tüm sigortalar geçersiz kalır.</p>
                    </div>
                </div>

                {/* Section 2: İptal ve İade Koşulları */}
                <div id="iptal-iade" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">İptal ve İade Koşulları</h2>
                            <p className="text-xs text-slate-500">Kesintisiz iade ve güvence prosedürlerimiz</p>
                        </div>
                    </div>

                    <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                        <p><strong>• 24 Saatten Önceki İptaller:</strong> Rezervasyon saatine 24 saat veya daha fazla süre kala yapılan iptallerde, ödenen tüm kiralama tutarı <strong>kesintisiz (%100)</strong> kartınıza iade edilir.</p>
                        <p><strong>• 24 Saatten Az Kalan İptaller:</strong> Alış saatine 24 saatten az bir süre kala yapılan iptallerde 1 günlük araç kiralama bedeli tahsil edilip kalan bakiye iade edilir.</p>
                        <p><strong>• İade Süreci:</strong> İade tutarı PayTR Sanal POS altyapımız üzerinden bankanıza aynı gün iletilir. Bankanızın hesap kesim dönemine bağlı olarak ekstrenize yansıması 1-3 iş günüdür.</p>
                    </div>
                </div>

                {/* Section 3: Güvenlik, PayTR ve KVKK */}
                <div id="guvenlik-kvkk" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Ödeme Güvenliği ve KVKK Politikası</h2>
                            <p className="text-xs text-slate-500">Kişisel veri ve 256-Bit SSL kart koruma taahhüdü</p>
                        </div>
                    </div>

                    <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                        <p><strong>• PayTR 256-Bit SSL:</strong> Tüm kart işlemleri BDDK lisanslı PayTR Sanal POS ve 3D Secure onay sistemiyle korunmaktadır. Kart bilgileriniz Pusula Oto Kiralama sunucularında asla tutulmaz.</p>
                        <p><strong>• KVKK Aydınlatması:</strong> Toplanan kimlik ve iletişim verileri 6698 sayılı KVKK kapsamında yalnızca kiralama sözleşmesi, fatura ve Emniyet KABİS araç takip sistemi gereğince işlenir; üçüncü şahıslarla paylaşılmaz.</p>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div>
                        <p className="font-bold text-slate-800 text-sm">Sorularınız veya özel talepleriniz için 7/24 yanınızdayız.</p>
                        <p className="text-xs text-slate-500 mt-0.5">Elazığ Merkez ve Havalimanı Araç Kiralama</p>
                    </div>
                    <a
                        href="tel:+905536198164"
                        className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                        <Phone className="w-4 h-4" />
                        +90 553 619 81 64
                    </a>
                </div>
            </div>
        </div>
    );
}
