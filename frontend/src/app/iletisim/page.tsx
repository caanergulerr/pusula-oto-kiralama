"use client"

import { motion } from "framer-motion"
import { Phone, MapPin, Clock, Mail, MessageCircle } from "lucide-react"

const contactInfo = [
    { icon: Phone, title: "Telefon", lines: ["+90 553 619 81 64"], color: "bg-blue-50 border-blue-200 text-blue-600", iconBg: "bg-blue-100", href: "tel:+905536198164" },
    { icon: MapPin, title: "Adres", lines: ["Pusula Oto Kiralama", "Elazığ"], color: "bg-emerald-50 border-emerald-200 text-emerald-600", iconBg: "bg-emerald-100", href: "https://maps.app.goo.gl/MsBza54gUJPv2hAp9" },
    { icon: Clock, title: "Çalışma Saatleri", lines: ["Hafta içi: 08:00 - 20:00", "Hafta sonu: 09:00 - 18:00"], color: "bg-violet-50 border-violet-200 text-violet-600", iconBg: "bg-violet-100", href: null },
    { icon: Mail, title: "E-posta", lines: ["otokiralamapusula@gmail.com"], color: "bg-amber-50 border-amber-200 text-amber-600", iconBg: "bg-amber-100", href: "mailto:otokiralamapusula@gmail.com" },
]

export default function IletisimPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            Bize Ulaşın
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">İletişim</h1>
                        <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                            Sorularınız için bize ulaşın. 7/24 müşteri hizmetlerimiz ile her zaman yanınızdayız.
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 15C480 30 240 60 0 30L0 60Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactInfo.map((info, i) => {
                            const Card = (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className={`p-6 rounded-2xl border ${info.color} hover:shadow-lg transition-all cursor-pointer`}
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 ${info.iconBg} rounded-xl mb-4`}>
                                        <info.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">{info.title}</h3>
                                    {info.lines.map(line => <p key={line} className="text-slate-500 text-sm">{line}</p>)}
                                </motion.div>
                            )
                            return info.href ? (
                                <a key={info.title} href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{Card}</a>
                            ) : <div key={info.title}>{Card}</div>
                        })}
                    </div>

                    {/* CTA Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-blue-600 rounded-3xl p-10 text-center shadow-xl shadow-blue-500/20">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                                <Phone className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">Hemen Arayın</h2>
                            <p className="text-blue-100 mb-8 text-lg">Rezervasyon ve bilgi için bizi arayın. Uzman ekibimiz size yardımcı olacaktır.</p>
                            <a href="tel:+905536198164" className="inline-flex items-center gap-3 bg-white text-blue-600 font-bold text-xl px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg">
                                <Phone className="h-6 w-6" />
                                +90 553 619 81 64
                            </a>
                            <p className="mt-4 text-blue-200 text-sm">7/24 Müşteri Hizmetleri</p>
                        </div>

                        <div className="bg-emerald-500 rounded-3xl p-10 text-center shadow-xl shadow-emerald-500/20">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                                <MessageCircle className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">WhatsApp ile Yazın</h2>
                            <p className="text-emerald-100 mb-8 text-lg">WhatsApp üzerinden de bize ulaşabilir, hızlıca bilgi alabilirsiniz.</p>
                            <a href="https://wa.me/905536198164" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-white text-emerald-600 font-bold text-xl px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-all shadow-lg">
                                <MessageCircle className="h-6 w-6" />
                                WhatsApp
                            </a>
                            <p className="mt-4 text-emerald-100 text-sm">Hızlı yanıt garantisi</p>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Konumumuz</h2>
                        <p className="text-slate-500">Elazığ Merkez'de hizmetinizdeyiz</p>
                    </div>
                    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg" style={{ height: '450px' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24918.49907973817!2d39.19472987701775!3d38.676179617784186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4076c151fc8beab3%3A0xc19766cb091f982d!2sPusula%20Oto%20Kiralama!5e0!3m2!1str!2str!4v1772788700538!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Pusula Oto Kiralama Konumu"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}
