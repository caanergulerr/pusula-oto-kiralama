"use client"

import Link from "next/link"
import { Shield, Clock, Star, Users, Car, Award, Phone, ChevronRight, CheckCircle } from "lucide-react"

export function WhyUs() {
    const features = [
        { icon: Shield, title: "Tam Sigorta Güvencesi", desc: "Tüm araçlarımız tam kasko ve trafik sigortası ile güvence altındadır.", color: "bg-blue-50 border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
        { icon: Clock, title: "7/24 Destek Hattı", desc: "Günün her saati ulaşabileceğiniz müşteri hizmetleri ekibimiz yanınızda.", color: "bg-emerald-50 border-emerald-200", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
        { icon: Car, title: "Geniş Araç Filosu", desc: "Ekonomikten lükse, her bütçeye ve ihtiyaca uygun araç seçenekleri.", color: "bg-violet-50 border-violet-200", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
        { icon: Star, title: "Bakımlı & Temiz Araçlar", desc: "Her kiralama öncesi detaylı temizlik ve teknik kontrol yapılmaktadır.", color: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    ]

    const stats = [
        { value: "500+", label: "Mutlu Müşteri", icon: Users },
        { value: "15+", label: "Araç Çeşidi", icon: Car },
        { value: "5★", label: "Müşteri Puanı", icon: Star },
        { value: "3+", label: "Yıllık Deneyim", icon: Award },
    ]

    const whyList = [
        "Rekabetçi ve şeffaf fiyatlandırma",
        "Geniş ve modern araç filosu",
        "7/24 müşteri desteği",
        "Hızlı ve kolay kiralama süreci",
        "Tam kasko sigorta güvencesi",
        "Deneyimli ve güler yüzlü ekip",
    ]

    return (
        <div className="bg-white">
            {/* Why Us Features */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                            Neden Biz?
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                            Farkımızı <span className="text-blue-600">Hissedin</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Elazığ'ın en güvenilir araç kiralama hizmeti olarak müşteri memnuniyetini her şeyin önünde tutuyoruz.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f) => (
                            <div key={f.title} className={`p-6 rounded-2xl border ${f.color} hover:shadow-lg transition-all duration-300 group`}>
                                <div className={`inline-flex items-center justify-center w-12 h-12 ${f.iconBg} rounded-xl mb-4`}>
                                    <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                                </div>
                                <h3 className="text-slate-800 font-bold text-lg mb-2">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((s) => (
                            <div key={s.label} className="text-center">
                                <s.icon className="h-7 w-7 text-blue-200 mx-auto mb-3" />
                                <div className="text-4xl font-bold text-white mb-1">{s.value}</div>
                                <div className="text-blue-200 text-sm font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Preview */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                                Hakkımızda
                            </div>
                            <h2 className="text-4xl font-bold text-slate-800 mb-6 leading-tight">
                                Elazığ'ın Güvenilir<br />
                                <span className="text-blue-600">Araç Kiralama</span> Firması
                            </h2>
                            <p className="text-slate-500 leading-relaxed text-lg mb-6">
                                Pusula Oto Kiralama olarak 3 yılı aşkın süredir Elazığ'da kaliteli ve güvenilir araç kiralama hizmeti sunuyoruz.
                                Müşteri memnuniyetini ön planda tutarak, bakımlı araç filomuz ve uzman ekibimizle hizmetinizdeyiz.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {whyList.map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/hakkimizda" className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 w-full sm:w-auto">
                                    Daha Fazla Bilgi <ChevronRight className="h-4 w-4" />
                                </Link>
                                <a href="tel:+905536198164" className="inline-flex justify-center items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 font-semibold rounded-xl transition-all w-full sm:w-auto">
                                    <Phone className="h-4 w-4" /> Hemen Ara
                                </a>
                            </div>
                        </div>

                        {/* Visual grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: "%100", label: "Sigortalı", bg: "bg-blue-600", text: "text-white" },
                                { value: "7/24", label: "Destek", bg: "bg-emerald-500", text: "text-white" },
                                { value: "500+", label: "Müşteri", bg: "bg-violet-500", text: "text-white" },
                                { value: "5★", label: "Puan", bg: "bg-amber-500", text: "text-white" },
                            ].map((item, i) => (
                                <div key={item.label} className={`${item.bg} rounded-2xl p-8 flex flex-col items-center justify-center text-center ${i % 2 === 1 ? 'mt-6' : ''}`}>
                                    <div className={`text-4xl font-bold ${item.text} mb-1`}>{item.value}</div>
                                    <div className={`text-sm font-medium ${item.text} opacity-80`}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center shadow-2xl shadow-blue-500/20">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Hemen Rezervasyon Yapın</h3>
                        <p className="text-blue-100 text-lg mb-8">Araçlarımızı keşfedin ve size en uygun olanı seçin.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/cars" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg w-full sm:w-auto">
                                <Car className="h-5 w-5" /> Araçları İncele
                            </Link>
                            <a href="tel:+905536198164" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all text-lg border border-blue-400 w-full sm:w-auto">
                                <Phone className="h-5 w-5" /> Bizi Arayın
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
