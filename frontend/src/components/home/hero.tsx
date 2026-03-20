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
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-950/75 to-slate-900/80" />
            </div>

            {/* Decorative circles - Sadece masaüstünde */}
            <div className="hidden md:block absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="hidden md:block absolute bottom-1/4 left-1/4 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-24 sm:pb-32 w-full flex flex-col justify-center min-h-[90vh]">
                <div className="max-w-3xl mb-12">
                    {/* Badge */}
                    <div className="hero-item-1 inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse" />
                        Elazığ'ın En Güvenilir Araç Kiralama Hizmeti
                    </div>

                    <h1 className="hero-item-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
                        Yola Çıkmanın
                        <br />
                        <span className="text-blue-400">En Kolay</span> Yolu
                    </h1>

                    <p className="hero-item-3 text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl">
                        İhtiyacınıza uygun aracı seçin, dakikalar içinde kiralayın.
                        Geniş araç filomuz ve uygun fiyatlarımızla hizmetinizdeyiz.
                    </p>

                    <div className="hero-item-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link href="/cars" className="w-full sm:w-auto">
                            <button className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105 text-base sm:text-lg">
                                Araçları İncele
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </Link>
                        <a href="tel:+905536198164" className="w-full sm:w-auto">
                            <button className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl backdrop-blur-sm transition-all text-base sm:text-lg">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                                Hemen Ara
                            </button>
                        </a>
                    </div>

                    {/* Trust badges */}
                    <div className="hero-item-5 flex flex-wrap gap-3 sm:gap-6 mt-10 sm:mt-14">
                        {[
                            { text: "✓ Tam Sigorta Güvencesi" },
                            { text: "✓ 7/24 Destek" },
                            { text: "✓ 5★ Müşteri Puanı" },
                        ].map(({ text }) => (
                            <div key={text} className="text-slate-300 text-xs sm:text-sm font-medium">
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Widget */}
                <div className="hero-item-6 w-full mt-auto mb-10">
                    <BookingWidget />
                </div>
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
