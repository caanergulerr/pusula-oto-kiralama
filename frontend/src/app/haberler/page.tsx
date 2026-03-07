import { Calendar, User, ArrowRight, ChevronRight, Newspaper } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
    title: "Haberler & Duyurular | Pusula Oto Kiralama",
    description: "Pusula Oto Kiralama ile ilgili en güncel haberler, duyurular ve kampanyalar.",
}

const NEWS_ITEMS = [
    {
        id: 1,
        title: "Pusula Oto Kiralama Yeni Web Sitesi Yayında!",
        excerpt: "Siz değerli müşterilerimize daha yenilikçi, hızlı ve kesintisiz hizmet sunabilmek amacıyla tamamen yenilenen ve modern tasarıma sahip yeni web sitemiz bugün itibarıyla yayına girdi. Artık bölgedeki en geniş araç filomuzu telefonlarınızdan veya bilgisayarınızdan çok daha kolay inceleyebilir, fiyatları karşılaştırıp hızlıca rezervasyon talebi oluşturabilirsiniz. Yeni sitemizle birlikte araç kiralama sürecini sizler için pürüzsüz ve keyifli bir deneyime dönüştürmeyi hedefliyoruz.",
        date: "1 Mart 2026",
        category: "Duyuru",
        author: "Site Yönetimi",
        imageUrl: "/images/hero-bg.jpg", // Temsili bir resim kullanabilir veya arkaplan verebiliriz. Sitede varsa. Yoksa gradyan.
    }
]

export default function HaberlerPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-400/20">
                        <Newspaper className="h-4 w-4" />
                        Güncel Gelişmeler
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Haberler & <span className="text-blue-400">Duyurular</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                        Pusula Oto Kiralama ile ilgili en son haberler, yeni eklenen araçlar ve özel kampanyalardan ilk siz haberdar olun.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {NEWS_ITEMS.map((news) => (
                        <Link key={news.id} href={`/haberler/${news.id}`} className="block group">
                            <article className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer">
                                {/* Resim alanı */}
                                <div className="h-56 bg-slate-100 relative overflow-hidden">
                                    <Image
                                        src="/images/news-1.png"
                                        alt={news.title}
                                        fill
                                        className="object-cover object-top hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-white/95 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                            {news.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {news.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" />
                                            {news.author}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                        {news.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed mb-6 flex-1">
                                        {news.excerpt}
                                    </p>
                                    <div className="pt-6 border-t border-slate-100 mt-auto">
                                        <span className="inline-flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all">
                                            Haberi Oku <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
