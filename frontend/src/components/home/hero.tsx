"use client"

import { motion } from "framer-motion"
import { ArrowRight, Phone, Shield, Clock, Star } from "lucide-react"
import Link from "next/link"
import { BookingWidget } from "./booking-widget"

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Background video with overlay */}
            <div className="absolute inset-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-950/75 to-slate-900/80" />
            </div>

            {/* Decorative circles - Sadece masaüstünde */}
            <div className="hidden md:block absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="hidden md:block absolute bottom-1/4 left-1/4 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-32 w-full">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm"
                    >
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        Elazığ'ın En Güvenilir Araç Kiralama Hizmeti
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
                    >
                        Yola Çıkmanın
                        <br />
                        <span className="text-blue-400">En Kolay</span> Yolu
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl"
                    >
                        İhtiyacınıza uygun aracı seçin, dakikalar içinde kiralayın.
                        Geniş araç filomuz ve uygun fiyatlarımızla hizmetinizdeyiz.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link href="/cars">
                            <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105 text-lg">
                                Araçları İncele
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </Link>
                        <a href="tel:+905536198164">
                            <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl backdrop-blur-sm transition-all text-lg">
                                <Phone className="h-5 w-5" />
                                Hemen Ara
                            </button>
                        </a>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-wrap gap-6 mt-14"
                    >
                        {[
                            { icon: Shield, text: "Tam Sigorta Güvencesi" },
                            { icon: Clock, text: "7/24 Destek" },
                            { icon: Star, text: "5★ Müşteri Puanı" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <Icon className="h-4 w-4 text-blue-400" />
                                {text}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Booking Widget (Arama Çubuğu) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="w-full"
                >
                    <BookingWidget />
                </motion.div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="#f8fafc" />
                </svg>
            </div>
        </section>
    )
}
