import { Calendar, User, ArrowLeft, Newspaper, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // Image importunu ekledim

export const metadata = {
    title: "Pusula Oto Kiralama Yeni Web Sitesi Yayında!",
    description: "Siz değerli müşterilerimize daha yenilikçi, hızlı ve kesintisiz hizmet sunabilmek amacıyla tamamen yenilenen ve modern tasarıma sahip yeni web sitemiz yayına girdi.",
}

export default async function HaberDetayPage({ params }: { params: Promise<{ id: string }> }) {
    // Şimdilik id'yi promise üzerinden çözüyoruz (Next.js 16 uyumluluğu)
    const resolvedParams = await params;
    const haberId = resolvedParams.id;

    // Şimdilik id=1 için statik içerik. Gerçek API olunca burası dinamikleşebilir.

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-6 lg:px-10">
                {/* Geri Dönüş Linki */}
                <Link href="/haberler" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Tüm Haberlere Dön
                </Link>

                <article className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                    {/* Üst Görsel (Site Anasayfa Screenshot) */}
                    <div className="h-64 md:h-[450px] bg-slate-100 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                        <Image
                            src="/images/news-1.png"
                            alt="Yenilenen Web Sitemiz"
                            fill
                            className="object-cover object-top hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Meta Bilgileri */}
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500 mb-6">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Duyuru
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                1 Mart 2026
                            </div>
                            <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                Site Yönetimi
                            </div>
                        </div>

                        {/* Başlık ve İçerik */}
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 leading-tight">
                            Pusula Oto Kiralama Yeni Web Sitesi Yayında!
                        </h1>

                        <div className="prose prose-lg prose-blue max-w-none text-slate-600 space-y-6">
                            <p className="text-xl font-medium text-slate-700 leading-relaxed">
                                Değerli müşterilerimiz; araç kiralama deneyiminizi kusursuz bir hale getirmek için aylardır üzerinde çalıştığımız yepyeni web sitemizi sizlerle paylaşmaktan büyük heyecan duyuyoruz.
                            </p>

                            <p>
                                Teknoloji hızla gelişirken, ulaşım ihtiyaçlarınız da değişiyor ve farklılaşıyor. Bizler de Pusula Oto Kiralama olarak, sizlere Elazığ, Malatya, Diyarbakır ve Tunceli başta olmak üzere tüm bölgede kesintisiz hizmet sunabilmek adına dijital altyapımızı baştan aşağı yeniledik. Eski web sitemizi rafa kaldırarak, kullanıcı dostu, mobil cihazlarla %100 uyumlu ve çok daha hızlı çalışan bu yeni platformu hayata geçirdik.
                            </p>

                            <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4">Yeni Web Sitemizde Neler Var?</h3>

                            <ul className="list-disc pl-6 space-y-3">
                                <li><strong>Hızlı ve Kolay Araç Kiralama Modülü:</strong> Anasayfamızdaki arama çubuğunu kullanarak alış ve teslim noktalarını seçebilir, dilediğiniz aracı saniyeler içinde bulabilirsiniz.</li>
                                <li><strong>Geniş Araç Filosu Gösterimi:</strong> Araçlar sayfamızda arabalarımızın tüm teknik özelliklerini, günlük fiyatlarını, vites ve yakıt türlerini anında görüntüleyebilirsiniz.</li>
                                <li><strong>Mobil Uyumluluk:</strong> İster otobüste seyahat ediyor olun, ister evdeki tabletinizden bağlanın; sitemiz her cihazda size mükemmel, akıcı ve bozulmayan bir deneyim sunmak üzere özel olarak tasarlandı.</li>
                                <li><strong>Hızlı İletişim, 7/24 Destek:</strong> Sitede yer alan tek tuşla arama özellikleri ve iletişim formları sayesinde bize dilediğiniz an ulaşabilirsiniz.</li>
                            </ul>

                            <p>
                                Müşteri memnuniyetini her zaman odak noktamız haline getirdik. Yeni web sitemiz de bu vizyonumuzun dijital bir yansımasıdır. Artık havalimanı transferlerinden günlük kiralamalara kadar her türlü ihtiyacınız için sadece saniyeler içerisinde bize ulaşabileceksiniz.
                            </p>

                            <p>
                                Araçlarımızı incelemeye hemen başlayın, güvenle yola çıkın. Yenilenen Pusula Oto Kiralama ile kaliteli hizmetin ayrıcalığını yaşamaya davetlisiniz!
                            </p>
                        </div>

                        {/* Paylaşımı Butonları vs */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-sm text-slate-500 font-medium">Bu haberi etrafındakilerle paylaş:</p>
                            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                                <Share2 className="h-4 w-4" /> Haberi Paylaş
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
