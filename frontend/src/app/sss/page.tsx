"use client"

import { useState } from "react"
import { ChevronDown, Phone, MessageCircle, HelpCircle, Car, CreditCard, Shield, Clock, MapPin, FileText } from "lucide-react"
import Link from "next/link"

const faqCategories = [
    {
        id: "genel",
        label: "Genel",
        icon: HelpCircle,
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200",
    },
    {
        id: "arac",
        label: "Araç & Teslimat",
        icon: Car,
        color: "text-violet-600",
        bg: "bg-violet-50 border-violet-200",
    },
    {
        id: "odeme",
        label: "Ödeme",
        icon: CreditCard,
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200",
    },
    {
        id: "sigorta",
        label: "Sigorta & Güvence",
        icon: Shield,
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200",
    },
]

const faqs = [
    // Genel
    {
        category: "genel",
        question: "Araç kiralamak için hangi belgeler gereklidir?",
        answer: "Araç kiralamak için geçerli bir sürücü belgesi, kimlik kartı veya pasaport ve kredi/banka kartı yeterlidir. Yabancı uyruklu misafirlerimiz için pasaport ve uluslararası sürücü belgesi kabul edilmektedir.",
    },
    {
        category: "genel",
        question: "Minimum kiralama süresi nedir?",
        answer: "Minimum kiralama süremiz 1 gündür. Günlük, haftalık ve aylık kiralama seçeneklerimiz mevcuttur. Uzun süreli kiralamalarda özel indirimler uygulanmaktadır.",
    },
    {
        category: "genel",
        question: "Kaç yaşında araç kiralayabilirim?",
        answer: "Araç kiralayabilmek için en az 21 yaşında olmanız ve en az 2 yıllık sürücü belgesine sahip olmanız gerekmektedir. Bazı araç segmentleri için yaş ve deneyim şartı farklılık gösterebilir.",
    },
    {
        category: "genel",
        question: "Rezervasyonu ne kadar önceden yapmalıyım?",
        answer: "Rezervasyonunuzu ne kadar erken yaparsanız o kadar iyi! Özellikle yoğun dönemlerde (bayramlar, yaz ayları) araç stoklarımız hızla tükenmektedir. En az 24 saat öncesinden rezervasyon yapmanızı öneririz.",
    },
    {
        category: "genel",
        question: "İptal veya değişiklik yapabilir miyim?",
        answer: "Rezervasyon iptali ve değişiklikleri için en az 24 saat önceden bizi aramanız yeterlidir. 24 saatten az süre kala yapılan iptallerde 1 günlük kiralama bedeli iptal ücreti olarak uygulanabilir.",
    },
    // Araç & Teslimat
    {
        category: "arac",
        question: "Araçları nerede teslim alıp teslim edebilirim?",
        answer: "Araçlarımızı ofisimizden teslim alabilir, Elazığ Havalimanı dahil belirlediğiniz adrese ücret karşılığı teslim edebilir ve aynı şekilde alabilirsiniz. Teslimat ücreti mesafeye göre belirlenmektedir.",
    },
    {
        category: "arac",
        question: "Araçta kilometre sınırı var mı?",
        answer: "Araçlarımızın günlük kilometre limiti 150 km'dir. Limit aşıldığında her km için ek ücret uygulanmaktadır. Sınırsız kilometre paketleri için müşteri hizmetlerimizi arayabilirsiniz.",
    },
    {
        category: "arac",
        question: "Farklı bir şehirde araç bırakabilir miyim?",
        answer: "Evet, tek yönlü kiralama hizmetimiz mevcuttur. Elazığ'dan aldığınız aracı Malatya, Tunceli, Diyarbakır gibi hizmet verdiğimiz illerde bırakabilirsiniz. Bu hizmet için ek ücret uygulanmaktadır.",
    },
    {
        category: "arac",
        question: "Yakıt politikası nasıldır?",
        answer: "Araçlarımız dolu yakıt ile teslim edilir, dolu yakıt ile iade alınır. Eksik yakıt durumunda, yakıt farkı kiracı tarafından karşılanır.",
    },
    {
        category: "arac",
        question: "Araçta kaza veya hasar olursa ne yapmalıyım?",
        answer: "Kaza durumunda önce güvende olduğunuzdan emin olun ve 112'yi arayın. Ardından bizi mutlaka bilgilendirin: +90 553 619 81 64. Kaza tutanağı düzenleyin ve bize gönderin. Sigorta kapsamındaki hasarlar için herhangi bir ekstra ödeme yapılmaz.",
    },
    // Ödeme
    {
        category: "odeme",
        question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        answer: "Nakit, kredi kartı ve banka kartı ile ödeme kabul ediyoruz. Tüm major kredi kartları (Visa, Mastercard, American Express) geçerlidir. Online ödeme seçeneğimiz de mevcuttur.",
    },
    {
        category: "odeme",
        question: "Depozito alıyor musunuz?",
        answer: "Evet, kiralama başlangıcında araç kategorisine göre 500₺ - 2.000₺ arasında depozito alınmaktadır. Depozito, aracın hasarsız iadesi ve yakıt tamamlanması durumunda kiralama bitiminde tamamen iade edilir.",
    },
    {
        category: "odeme",
        question: "Fatura alabilir miyim?",
        answer: "Evet, talep etmeniz halinde e-fatura veya kağıt fatura düzenlenebilmektedir. Kurumsal müşterilerimiz için özel fatura ve ödeme koşulları uygulanmaktadır.",
    },
    // Sigorta
    {
        category: "sigorta",
        question: "Araçlar sigortalı mı?",
        answer: "Tüm araçlarımız güncel trafik sigortası ve standart kasko kapsamındadır. Kiralama ücretine trafik sigortası ve standart kasko dahildir.",
    },
    {
        category: "sigorta",
        question: "Ek sigorta seçenekleri var mı?",
        answer: "Evet! Mini Kasko (+300₺/gün) veya Full Kasko (+500₺/gün) seçeneklerimizle kendinizi daha kapsamlı güvence altına alabilirsiniz. Full Kasko'da muafiyet uygulanmaz.",
    },
    {
        category: "sigorta",
        question: "Hasar muafiyeti nedir?",
        answer: "Standart kasko ile hasar muafiyeti araç değerine ve hasarın büyüklüğüne göre değişmektedir. Full Kasko paketini seçtiğinizde muafiyet uygulanmaz ve olası hasarlar tamamen karşılanır.",
    },
]

export default function SSSPage() {
    const [activeCategory, setActiveCategory] = useState("genel")
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const filtered = faqs.filter(f => f.category === activeCategory)

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-6 relative overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl" />
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 pb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <HelpCircle className="h-4 w-4" />
                            Merak Ettikleriniz
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Sıkça Sorulan<br />
                            <span className="text-blue-400">Sorular</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                            Aklınızdaki soruların cevaplarını burada bulabilirsiniz.
                            Bulamadığınız bir şey varsa bizi arayın, yardımcı olalım.
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 block">
                        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#ffffff" />
                    </svg>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-10">

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-3 mb-10 justify-center">
                        {faqCategories.map(cat => {
                            const Icon = cat.icon
                            const isActive = activeCategory === cat.id
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setOpenIndex(null) }}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${isActive
                                        ? `${cat.bg} ${cat.color} shadow-sm`
                                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {cat.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-3">
                        {filtered.map((faq, idx) => {
                            const isOpen = openIndex === idx
                            return (
                                <div
                                    key={idx}
                                    className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen
                                        ? "border-blue-200 shadow-md shadow-blue-50"
                                        : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <button
                                        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left bg-white hover:bg-slate-50 transition-colors"
                                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`font-semibold text-base leading-snug transition-colors ${isOpen ? "text-blue-700" : "text-slate-800"}`}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : "text-slate-400"}`}
                                        />
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                                    >
                                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                                            <div className="h-px bg-slate-100 mb-4" />
                                            <p className="text-slate-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Still have questions */}
                    <div className="mt-16 bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-5">
                                <MessageCircle className="h-8 w-8 text-blue-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                Sorunuz hâlâ çözülmedi mi?
                            </h2>
                            <p className="text-slate-300 mb-8 max-w-md mx-auto">
                                Merak ettiğiniz herhangi bir konuda bize ulaşın, uzman ekibimiz size en kısa sürede yardımcı olsun.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="tel:+905536198164"
                                    className="inline-flex items-center justify-center gap-2.5 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg"
                                >
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    +90 553 619 81 64
                                </a>
                                <a
                                    href="https://wa.me/905536198164"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}
