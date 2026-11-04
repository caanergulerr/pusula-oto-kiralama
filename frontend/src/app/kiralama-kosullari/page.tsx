import { Metadata } from "next";
import { FileText, RotateCcw, Lock, Cookie, KeyRound, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Kiralama Koşulları & Sözleşmeler | Pusula Oto Kiralama",
    description: "Pusula Oto Kiralama mesafeli kiralama sözleşmesi, iptal ve iade koşulları, gizlilik politikası, KVKK aydınlatma metni ve araç teslimat şartları.",
};

const SECTIONS = [
    { id: "mesafeli-satis", label: "Mesafeli Satış (Kiralama) Sözleşmesi" },
    { id: "iptal-iade", label: "İptal, İade ve Değişiklik Koşulları" },
    { id: "gizlilik-guvenlik", label: "Gizlilik ve Güvenlik Politikası" },
    { id: "kvkk-cerez", label: "KVKK Aydınlatma Metni ve Çerez Politikası" },
    { id: "teslimat-iade", label: "Araç Teslimat ve İade Şartları" },
];

function Section({
    id, icon: Icon, color, title, subtitle, children,
}: {
    id: string; icon: LucideIcon; color: string; title: string; subtitle: string; children: ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-28 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
            </div>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">{children}</div>
        </section>
    );
}

export default function KiralamaKosullariPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider inline-block mb-3 border border-blue-400/30">
                            Güvenli Kiralama &amp; Hukuki Bilgilendirme
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                            Kiralama Koşulları ve Sözleşmeler
                        </h1>
                        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                            Pusula Oto Kiralama olarak şeffaflık, müşteri memnuniyeti ve 256-Bit SSL güvenli ödeme standartlarıyla hizmet veriyoruz.
                        </p>
                    </div>
                </div>

                {/* İçindekiler */}
                <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">İçindekiler</p>
                    <ol className="grid sm:grid-cols-2 gap-2 text-sm">
                        {SECTIONS.map((s, i) => (
                            <li key={s.id}>
                                <a href={`#${s.id}`} className="text-blue-600 hover:underline">
                                    {i + 1}. {s.label}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* 1. Mesafeli Satış */}
                <Section
                    id="mesafeli-satis"
                    icon={FileText}
                    color="bg-blue-50 border-blue-100 text-blue-600"
                    title="Mesafeli Satış (Kiralama) Sözleşmesi"
                    subtitle="6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenlenmiştir."
                >
                    <p>
                        <strong>1. Taraflar:</strong> İşbu sözleşme; <strong>Pusula Oto Kiralama - Hasan Aktaş</strong> (Hazar Vergi Dairesi, VKN: 0400708479,
                        Adres: İzzet Paşa Mah. Hacı Tevfik Efendi Sk. No: 2 İç Kapı No: 11 Merkez / Elazığ, Tel: +90 553 619 81 64, E-posta: otokiralamapusula@gmail.com) (&quot;Kiraya Veren&quot;)
                        ile elazigotokiralamapusula.com üzerinden rezervasyon yapan müşteri (&quot;Kiracı&quot;) arasında akdedilmiştir.
                    </p>
                    <p><strong>2. Konu:</strong> Sözleşmenin konusu, Kiracı&apos;nın web sitesi üzerinden seçtiği aracın, belirtilen tarih aralığında ve rezervasyon özetinde gösterilen bedel karşılığında kiralanmasıdır.</p>
                    <p><strong>3. Ehliyet ve Yaş Şartları:</strong> Ekonomik sınıf araçlar için en az 21 yaş ve 2 yıllık ehliyet; orta/lüks segment araçlar için 25 yaş ve 3 yıllık geçerli sürücü belgesi aranır.</p>
                    <p><strong>4. Bedel ve Ödeme:</strong> Kiralama bedeli, KDV dahil olarak rezervasyon özetinde gösterilir ve PayTR güvenli ödeme altyapısı üzerinden kredi/banka kartı ile tahsil edilir.</p>
                    <p><strong>5. Sigorta &amp; Kasko:</strong> Fiyatlara Standart Kasko dahildir. İsteğe bağlı Mini Kasko (+₺300/gün) veya Full Kasko (+₺500/gün) seçilebilir. Alkol/uyuşturucu etkisinde kullanım veya yasal hız limitlerinin aşılması halinde sigorta teminatları geçersiz olur.</p>
                    <p><strong>6. Uyuşmazlık:</strong> Uyuşmazlıklarda Ticaret Bakanlığınca ilan edilen parasal sınırlar dahilinde Tüketici Hakem Heyetleri, aşan durumlarda Elazığ Tüketici Mahkemeleri yetkilidir.</p>
                </Section>

                {/* 2. İptal ve İade */}
                <Section
                    id="iptal-iade"
                    icon={RotateCcw}
                    color="bg-emerald-50 border-emerald-100 text-emerald-600"
                    title="İptal, İade ve Değişiklik Koşulları"
                    subtitle="Rezervasyon iptali, ücret iadesi ve tarih değişikliği prosedürleri"
                >
                    <p><strong>• 24 saatten önceki iptaller:</strong> Alış saatine 24 saat veya daha fazla kala yapılan iptallerde ödenen tutarın tamamı (%100) kesintisiz iade edilir.</p>
                    <p><strong>• 24 saatten az kalan iptaller:</strong> 1 günlük kiralama bedeli kesilerek kalan tutar iade edilir.</p>
                    <p><strong>• Değişiklik:</strong> Tarih, saat veya araç değişikliği talepleri, araç müsaitliğine bağlı olarak alış saatinden en geç 24 saat önce ücretsiz yapılır. Fiyat farkı oluşursa tahsil veya iade edilir.</p>
                    <p><strong>• İade süreci:</strong> İadeler, ödemenin yapıldığı karta PayTR üzerinden gerçekleştirilir. Tutarın hesabınıza yansıması bankanıza bağlı olarak genellikle 1-7 iş günü sürebilir.</p>
                    <p><strong>• Talep kanalı:</strong> İptal ve değişiklik talepleri +90 553 619 81 64 veya otokiralamapusula@gmail.com üzerinden iletilebilir.</p>
                </Section>

                {/* 3. Gizlilik ve Güvenlik */}
                <Section
                    id="gizlilik-guvenlik"
                    icon={Lock}
                    color="bg-purple-50 border-purple-100 text-purple-600"
                    title="Gizlilik ve Güvenlik Politikası"
                    subtitle="Ödeme güvenliği ve bilgilerinizin korunması"
                >
                    <p><strong>• Kart güvenliği:</strong> Tüm kart işlemleri PayTR güvenli ödeme altyapısı ve 3D Secure doğrulamasıyla gerçekleştirilir. Kart bilgileriniz Pusula Oto Kiralama sunucularında saklanmaz ve tarafımızca görüntülenemez.</p>
                    <p><strong>• Şifreli bağlantı:</strong> Sitemizdeki tüm veri iletimi 256-Bit SSL sertifikasıyla şifrelenir.</p>
                    <p><strong>• Hesap güvenliği:</strong> Kullanıcı şifreleri geri döndürülemez şekilde (hash) saklanır. Şifrenizi üçüncü kişilerle paylaşmamanız önerilir.</p>
                    <p><strong>• Bilgi paylaşımı:</strong> Kişisel bilgileriniz yasal yükümlülükler dışında üçüncü kişilerle paylaşılmaz, satılmaz veya kiralanmaz.</p>
                </Section>

                {/* 4. KVKK ve Çerez */}
                <Section
                    id="kvkk-cerez"
                    icon={Cookie}
                    color="bg-amber-50 border-amber-100 text-amber-600"
                    title="KVKK Aydınlatma Metni ve Çerez Politikası"
                    subtitle="6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme"
                >
                    <p><strong>• Veri sorumlusu:</strong> Pusula Oto Kiralama - Hasan Aktaş (VKN: 0400708479), İzzet Paşa Mah. Hacı Tevfik Efendi Sk. No: 2 İç Kapı No: 11 Merkez / Elazığ.</p>
                    <p><strong>• İşlenen veriler:</strong> Ad-soyad, T.C. kimlik/pasaport numarası, ehliyet bilgileri, telefon, e-posta ve rezervasyon bilgileri.</p>
                    <p><strong>• İşleme amaçları:</strong> Kiralama sözleşmesinin kurulması ve ifası, faturalandırma, Emniyet Genel Müdürlüğü KABİS bildirimi gibi yasal yükümlülüklerin yerine getirilmesi ve müşteri iletişimi.</p>
                    <p><strong>• Aktarım:</strong> Veriler yalnızca yasal zorunluluk halinde yetkili kamu kurumlarıyla ve ödeme işlemi için PayTR ile paylaşılır.</p>
                    <p><strong>• Haklarınız:</strong> KVKK md. 11 kapsamındaki bilgi edinme, düzeltme, silme ve itiraz haklarınızı otokiralamapusula@gmail.com adresine başvurarak kullanabilirsiniz.</p>
                    <p><strong>• Çerezler:</strong> Sitemizde oturum yönetimi ve temel işlevler için zorunlu çerezler kullanılır. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman yönetebilir veya silebilirsiniz.</p>
                </Section>

                {/* 5. Teslimat ve İade */}
                <Section
                    id="teslimat-iade"
                    icon={KeyRound}
                    color="bg-sky-50 border-sky-100 text-sky-600"
                    title="Araç Teslimat ve İade Şartları"
                    subtitle="Aracın teslim alınması ve geri teslim edilmesine ilişkin kurallar"
                >
                    <p><strong>• Teslim noktası:</strong> Araçlar Elazığ Merkez ofisimizden veya Elazığ Havalimanı transfer noktasından, rezervasyonda belirtilen gün ve saatte teslim edilir.</p>
                    <p><strong>• Gerekli belgeler:</strong> Teslimat sırasında Kiracı&apos;nın kimlik/pasaportu ve geçerli sürücü belgesinin aslı ibraz edilmelidir.</p>
                    <p><strong>• Teslim tutanağı:</strong> Araç; yakıt seviyesi, kilometre ve hasar durumu karşılıklı kontrol edilerek tutanakla teslim edilir.</p>
                    <p><strong>• İade:</strong> Araç, teslim alındığı yakıt seviyesinde ve temizlikte, belirtilen saatte iade edilmelidir. 2 saati aşan gecikmelerde ek gün ücreti uygulanabilir.</p>
                    <p><strong>• Kilometre sınırı:</strong> Her aracın ilan sayfasında belirtilen günlük kilometre sınırı geçerlidir; aşım halinde ek ücret uygulanabilir.</p>
                </Section>

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
