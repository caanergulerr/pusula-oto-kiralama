"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Fuel, Gauge, Settings2, Users, Phone, ArrowLeft, CheckCircle, Shield, Star } from "lucide-react"
import Link from "next/link"
import { carService, Car } from "@/services/car.service"

const FEATURE_LABELS: Record<string, string> = {
    gps: 'GPS Navigasyon',
    bluetooth: 'Bluetooth',
    heatedSeats: 'Isıtmalı Koltuklar',
    camera360: '360 Kamera',
    sunroof: 'Sunroof',
    parkingSensor: 'Park Sensörü',
    cruiseControl: 'Hız Sabitleyici',
    leatherSeats: 'Deri Koltuk',
}

export default function CarDetailPage() {
    const { id } = useParams()
    const [car, setCar] = useState<Car | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCar() {
            try {
                const data = await carService.getCar(id as string)
                if (data.specs && typeof data.specs === 'string') {
                    try { data.parsedSpecs = JSON.parse(data.specs) } catch { data.parsedSpecs = {} }
                }
                if (data.features && typeof data.features === 'string') {
                    try { data.parsedFeatures = JSON.parse(data.features) } catch { data.parsedFeatures = [] }
                } else { data.parsedFeatures = [] }
                setCar(data)
            } catch (error) { console.error(error) }
            finally { setLoading(false) }
        }
        if (id) fetchCar()
    }, [id])

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Yükleniyor...</p>
            </div>
        </div>
    )
    if (!car) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-2xl font-bold text-slate-700 mb-2">Araç bulunamadı</p>
                <Link href="/cars" className="text-blue-600 hover:underline">Araçlara Dön</Link>
            </div>
        </div>
    )

    const specs = car.parsedSpecs || {}
    const features = car.parsedFeatures || []
    const isAvailable = (car.availableStock ?? 0) > 0

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header band */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-28 pb-0 relative">
                <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-16">
                    <Link href="/cars" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group relative z-10">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Araçlara Dön
                    </Link>
                    <h1 className="text-4xl font-bold text-white relative z-10">{car.brand} {car.model}</h1>
                    <div className="flex items-center gap-3 mt-3 relative z-10">
                        <span className="px-3 py-1 bg-white/10 text-slate-300 rounded-full text-sm font-medium">{car.year}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${isAvailable ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                            {isAvailable ? '✓ Müsait' : '✗ Dolu'}
                        </span>
                    </div>
                </div>
                {/* Dalga Geçişi */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-0">
                    <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 block">
                        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc" />
                    </svg>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left: Image + specs */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Image */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '380px' }}>
                            {car.imageUrl ? (
                                <div className="relative w-full h-full bg-white">
                                    <Image
                                        src={car.imageUrl}
                                        alt={`${car.brand} ${car.model}`}
                                        fill
                                        className="object-contain p-8"
                                        style={{ mixBlendMode: 'multiply' }}
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-7xl bg-white">🚗</div>
                            )}
                        </div>

                        {/* Spec cards */}
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { icon: Settings2, label: 'Vites', value: specs.transmission || specs.gear || 'Otomatik' },
                                { icon: Fuel, label: 'Yakıt', value: specs.fuelType || specs.fuel || 'Benzin' },
                                { icon: Users, label: 'Koltuk', value: `${specs.seats || 5} Kişi` },
                                { icon: Gauge, label: 'Limit', value: `${car.kmLimit || 150} km` },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                                    <Icon className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                                    <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                                    <p className="text-sm font-bold text-slate-700 leading-tight">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">Açıklama & Özellikler</h3>
                            <p className="text-slate-500 leading-relaxed mb-4">
                                {car.description || `${car.brand} ${car.model} ile konforlu ve güvenli bir seyahat deneyimi yaşayın.`}
                            </p>
                            {features.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {features.map((fId: string) => (
                                        <div key={fId} className="flex items-center gap-2 text-slate-600 text-sm">
                                            <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                            {FEATURE_LABELS[fId] || fId}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Price + CTA */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Price card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <p className="text-slate-400 text-sm mb-1">Günlük Kiralama Ücreti</p>
                            <p className="text-5xl font-bold text-blue-600 mb-1">₺{car.dailyPrice}</p>
                            <p className="text-slate-400 text-sm">KDV dahil, sigorta dahil</p>
                        </div>

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-center shadow-xl shadow-blue-500/20">
                            <h3 className="text-lg font-bold text-white mb-2">Rezervasyon ve Bilgi İçin</h3>
                            <p className="text-blue-100 text-sm mb-5">Bu aracı kiralamak için bizi hemen arayın.</p>
                            <a
                                href="tel:+905536198164"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg mb-3"
                            >
                                <Phone className="h-5 w-5" />
                                +90 553 619 81 64
                            </a>
                            <p className="text-blue-200 text-xs font-medium">7/24 Müşteri Hizmetleri</p>
                        </div>

                        {/* Trust items */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                            {[
                                { icon: Shield, text: "Tam kasko sigorta dahil" },
                                { icon: Star, text: "5★ müşteri memnuniyeti" },
                                { icon: CheckCircle, text: "Teknik kontrol yapılmış" },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-3 text-slate-600 text-sm">
                                    <Icon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
