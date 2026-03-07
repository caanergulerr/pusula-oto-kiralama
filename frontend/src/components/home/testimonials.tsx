"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const REVIEWS = [
    {
        name: "Zaim Can Vayiç",
        location: "Google Yorumu",
        rating: 5,
        comment: "İlgilerinden dolayı teşekkürler",
        date: "Bir gün önce",
        avatar: "ZV",
    },
    {
        name: "Hüseyin Güngör",
        location: "Google Yorumu",
        rating: 5,
        comment: "Fiyatları uygun ve güvenilir tavsiye ederim",
        date: "2 gün önce",
        avatar: "HG",
    },
    {
        name: "Caner Güler",
        location: "Google Yorumu",
        rating: 5,
        comment: "Yeni ve bakımlı araçlara sahipler. Biz çok memnun kaldık, Hasan beye ilgilerinden dolayı teşekkür ederiz.",
        date: "3 gün önce",
        avatar: "CG",
    },
]

export function Testimonials() {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                {/* Header */}
                <div className="text-center mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            ⭐ Müşteri Yorumları
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Müşterilerimiz Ne Diyor?
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Yüzlerce mutlu müşterimizin deneyimlerinden bir kısmını sizinle paylaşıyoruz.
                        </p>
                    </motion.div>
                </div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {REVIEWS.map((review, i) => (
                        <motion.div
                            key={review.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                        >
                            {/* Quote icon */}
                            <Quote className="h-6 w-6 text-blue-400 mb-4 opacity-60" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: review.rating }).map((_, j) => (
                                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                                ))}
                            </div>

                            {/* Comment */}
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                "{review.comment}"
                            </p>

                            {/* User */}
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                    {review.avatar}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{review.name}</p>
                                    <p className="text-slate-400 text-xs">{review.location} · {review.date}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
