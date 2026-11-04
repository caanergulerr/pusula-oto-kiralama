"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import {
    Fuel, Gauge, Settings2, Phone, ArrowLeft, CheckCircle, Shield, Star,
    ShieldCheck, ChevronLeft, ChevronRight, Calendar, Clock, User, Mail, CreditCard,
    Lock, AlertCircle
} from "lucide-react"
import Link from "next/link"
import { carService, Car } from "@/services/car.service"
import { paymentService } from "@/services/payment.service"
import { PaytrModal } from "@/components/PaytrModal"
import { TermsModal } from "@/components/TermsModal"

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

const HOURS = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00"
]

export default function CarDetailPage() {
    const { id } = useParams()
    const [car, setCar] = useState<Car | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeImg, setActiveImg] = useState(0)

    // Rezervasyon Form State
    const [pickupDate, setPickupDate] = useState("")
    const [pickupTime, setPickupTime] = useState("10:00")
    const [returnDate, setReturnDate] = useState("")
    const [returnTime, setReturnTime] = useState("10:00")
    const [insuranceType, setInsuranceType] = useState<"STANDART" | "MINI" | "FULL">("STANDART")

    const [customerName, setCustomerName] = useState("")
    const [customerPhone, setCustomerPhone] = useState("")
    const [customerEmail, setCustomerEmail] = useState("")
    const [identityNumber, setIdentityNumber] = useState("")

    // Ödeme & Modal State
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [preInfoAccepted, setPreInfoAccepted] = useState(false)
    const [contractAccepted, setContractAccepted] = useState(false)
    const [paytrData, setPaytrData] = useState<{
        isOpen: boolean;
        token: string;
        merchantOid: string;
        totalAmount: number;
    }>({
        isOpen: false,
        token: "",
        merchantOid: "",
        totalAmount: 0,
    })

    // Varsayılan tarihleri belirle (Yarın ve 3 gün sonrası)
    useEffect(() => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const afterTomorrow = new Date()
        afterTomorrow.setDate(afterTomorrow.getDate() + 3)

        const formatIso = (d: Date) => d.toISOString().split("T")[0]
        setPickupDate(formatIso(tomorrow))
        setReturnDate(formatIso(afterTomorrow))
    }, [])

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

    // Minimum seçilebilir tarihler (bugün)
    const todayStr = useMemo(() => new Date().toISOString().split("T")[0], [])

    // Gün ve Fiyat Hesaplaması
    const calculation = useMemo(() => {
        if (!pickupDate || !returnDate || !car) {
            return { days: 1, carTotal: 0, insuranceTotal: 0, grandTotal: 0 }
        }

        const start = new Date(`${pickupDate}T${pickupTime || "10:00"}`)
        const end = new Date(`${returnDate}T${returnTime || "10:00"}`)

        const diffMs = end.getTime() - start.getTime()
        const rawDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
        const days = Math.max(1, rawDays)

        const daily = Number(car.dailyPrice) || 0
        const carTotal = daily * days

        let insuranceDaily = 0
        if (insuranceType === "MINI") insuranceDaily = 300
        else if (insuranceType === "FULL") insuranceDaily = 500

        const insuranceTotal = insuranceDaily * days
        const grandTotal = carTotal + insuranceTotal

        return { days, carTotal, insuranceTotal, grandTotal }
    }, [pickupDate, pickupTime, returnDate, returnTime, insuranceType, car])

    const handleBookingAndPayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)

        if (!car) return

        if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || !identityNumber.trim()) {
            setErrorMessage("Lütfen tüm iletişim ve kimlik bilgilerini eksiksiz doldurun.")
            return
        }

        if (!preInfoAccepted || !contractAccepted) {
            setErrorMessage("Lütfen Ön Bilgilendirme Formu'nu ve Mesafeli Satış (Kiralama) Sözleşmesi'ni okuyup onaylayın.")
            return
        }

        const start = new Date(`${pickupDate}T${pickupTime}`)
        const end = new Date(`${returnDate}T${returnTime}`)
        if (end <= start) {
            setErrorMessage("İade tarihi ve saati, alış tarihinden sonra olmalıdır.")
            return
        }

        setSubmitting(true)
        try {
            const res = await paymentService.createPaytrToken({
                carId: car.id,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                customerEmail: customerEmail.trim(),
                identityNumber: identityNumber.trim(),
                insuranceType,
            })

            setPaytrData({
                isOpen: true,
                token: res.token,
                merchantOid: res.merchantOid,
                totalAmount: res.totalPrice,
            })
        } catch (err: any) {
            setErrorMessage(err.message || "Ödeme başlatılırken bir hata meydana geldi.")
        } finally {
            setSubmitting(false)
        }
    }

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
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-24 sm:pt-28 pb-0 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pb-12 sm:pb-16">
                    <Link href="/cars" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 sm:mb-6 group relative z-10">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Araçlara Dön
                    </Link>
                    <h1 className="text-2xl sm:text-4xl font-bold text-white relative z-10 select-none">{car.brand} {car.model}</h1>
                    <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 relative z-10 select-none">
                        <span className="px-2.5 py-1 bg-white/10 text-slate-300 rounded-full text-xs sm:text-sm font-medium">{car.year}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold ${isAvailable ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left: Image + specs (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Image Gallery */}
                        {(() => {
                            const allImages: string[] = []
                            if (car.imageUrls) {
                                try { allImages.push(...JSON.parse(car.imageUrls)) } catch { }
                            }
                            if (car.imageUrl && !allImages.includes(car.imageUrl)) allImages.unshift(car.imageUrl)
                            const mainImg = allImages[activeImg] || null
                            return (
                                <div className="space-y-3">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative" style={{ height: '340px' }}>
                                        {mainImg ? (
                                            <>
                                                <div className="relative w-full h-full bg-white">
                                                    <Image src={mainImg} alt={`${car.brand} ${car.model}`} fill unoptimized className="object-contain p-6" style={{ mixBlendMode: 'multiply' }} priority />
                                                </div>
                                                {allImages.length > 1 && (
                                                    <>
                                                        <button onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-transform active:scale-95"><ChevronLeft className="h-5 w-5 text-slate-700" /></button>
                                                        <button onClick={() => setActiveImg(i => (i + 1) % allImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-transform active:scale-95"><ChevronRight className="h-5 w-5 text-slate-700" /></button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-7xl bg-white">🚗</div>
                                        )}
                                    </div>
                                    {allImages.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {allImages.map((img, i) => (
                                                <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-white transition-all ${i === activeImg ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 opacity-60 hover:opacity-100'}`}>
                                                    <img src={img} alt="" className="w-full h-full object-contain p-1" style={{ mixBlendMode: 'multiply' as any }} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })()}

                        {/* Spec cards */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Settings2, label: 'Vites', value: specs.transmission || specs.gear || 'Otomatik' },
                                { icon: Fuel, label: 'Yakıt', value: specs.fuelType || specs.fuel || 'Benzin' },
                                { icon: Gauge, label: 'Günlük Limit', value: `${car.kmLimit || 250} km` },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="bg-white rounded-xl border border-slate-200 p-3.5 text-center shadow-sm">
                                    <Icon className="h-5 w-5 text-blue-600 mx-auto mb-1.5" />
                                    <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">Açıklama & Donanım</h3>
                            <p className="text-slate-600 leading-relaxed mb-5 text-sm">
                                {car.description || `${car.brand} ${car.model} ile konforlu, ekonomik ve güvenli bir sürüş deneyimi yaşayın. Tüm periyodik bakımları ve dezenfeksiyon işlemleri eksiksiz yapılmıştır.`}
                            </p>
                            {features.length > 0 && (
                                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                                    {features.map((fId: string) => (
                                        <div key={fId} className="flex items-center gap-2 text-slate-700 text-sm">
                                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                            {FEATURE_LABELS[fId] || fId}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Depozito / Provizyon Uyarısı (Araç Detay) */}
                        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 shadow-sm flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                                <CreditCard className="h-5 w-5 text-amber-700" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                                    Depozito / Provizyon Bilgilendirmesi
                                </h4>
                                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                                    Araç teslimi esnasında sürücü adına kayıtlı kredi kartından <strong>2.000 TL depozito/provizyon</strong> işlemi uygulanmaktadır. Araç hasarsız ve eksiksiz teslim edildiğinde provizyon kaldırılır / iade edilir.
                                </p>
                            </div>
                        </div>

                        {/* Trust items */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 grid sm:grid-cols-2 gap-3">
                            {[
                                { icon: ShieldCheck, title: "7/24 Yol Yardımı", desc: "Arıza ve kaza anında anında destek" },
                                { icon: Star, title: "Müşteri Memnuniyeti", desc: "Elazığ'ın en yüksek puanlı araç kiralama servisi" },
                                { icon: Lock, title: "PayTR 256-Bit SSL", desc: "Banka güvencesiyle 3D Secure ödeme" },
                                { icon: CheckCircle, title: "Havalimanı Teslimat", desc: "Uçuş saatine göre kapıda teslim" },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <Icon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">{title}</p>
                                        <p className="text-[11px] text-slate-500">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Dynamic Booking & Payment Panel (5 Cols) */}
                    <div className="lg:col-span-5 space-y-5">
                        {/* Booking Form Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sm:p-6 relative overflow-hidden">
                            {/* Price Header */}
                            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4 mb-5">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Günlük Ücret</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                                        ₺{Number(car.dailyPrice).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                                    KDV Dahil
                                </span>
                            </div>

                            <form onSubmit={handleBookingAndPayment} className="space-y-4">
                                {/* Error Alert */}
                                {errorMessage && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
                                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                {/* Dates Section */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                        Alış Tarihi & Saati
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            type="date"
                                            min={todayStr}
                                            value={pickupDate}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            required
                                            className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <select
                                            value={pickupTime}
                                            onChange={(e) => setPickupTime(e.target.value)}
                                            className="px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                        İade Tarihi & Saati
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            type="date"
                                            min={pickupDate || todayStr}
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            required
                                            className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <select
                                            value={returnTime}
                                            onChange={(e) => setReturnTime(e.target.value)}
                                            className="px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Kasko Paketi Seçimi */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                        Kasko & Güvence Paketi
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { type: "STANDART", title: "Standart", extra: "Ücretsiz" },
                                            { type: "MINI", title: "Mini Kasko", extra: "+₺300/gün" },
                                            { type: "FULL", title: "Full Kasko", extra: "+₺500/gün" },
                                        ].map((opt) => {
                                            const isSelected = insuranceType === opt.type
                                            return (
                                                <button
                                                    type="button"
                                                    key={opt.type}
                                                    onClick={() => setInsuranceType(opt.type as any)}
                                                    className={`py-2 px-2 rounded-xl border text-center transition-all ${isSelected
                                                        ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600 font-bold"
                                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium"
                                                        }`}
                                                >
                                                    <p className="text-xs">{opt.title}</p>
                                                    <p className={`text-[10px] ${isSelected ? "text-blue-600 font-bold" : "text-slate-400"}`}>
                                                        {opt.extra}
                                                    </p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Müşteri Bilgileri */}
                                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                                    <p className="text-xs font-bold text-slate-800">Sürücü & İletişim Bilgileri</p>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Adınız ve Soyadınız"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="tel"
                                            placeholder="Telefon (05XX...)"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="T.C. / Pasaport No"
                                            value={identityNumber}
                                            onChange={(e) => setIdentityNumber(e.target.value)}
                                            required
                                            maxLength={11}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            placeholder="E-posta Adresi (Onay için)"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Dinamik Fiyat Özeti */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Kiralama Süresi:</span>
                                        <span className="font-bold text-slate-700">{calculation.days} Gün</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Araç Tutarı:</span>
                                        <span className="font-medium text-slate-700">₺{calculation.carTotal.toLocaleString('tr-TR')}</span>
                                    </div>
                                    {calculation.insuranceTotal > 0 && (
                                        <div className="flex justify-between text-slate-500">
                                            <span>Kasko ({insuranceType}):</span>
                                            <span className="font-medium text-slate-700">+₺{calculation.insuranceTotal.toLocaleString('tr-TR')}</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm">
                                        <span className="text-slate-900">Toplam Ödenecek:</span>
                                        <span className="text-blue-600 text-lg">₺{calculation.grandTotal.toLocaleString('tr-TR')}</span>
                                    </div>

                                    {/* Rezervasyon Özeti İçinde Depozito / Provizyon Uyarısı */}
                                    <div className="mt-2.5 pt-2.5 border-t border-amber-200/80 bg-amber-50/90 -mx-3.5 -mb-3.5 p-3 rounded-b-xl flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed">
                                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <span>
                                            <strong>Depozito / Provizyon:</strong> Araç teslimi esnasında sürücü adına kayıtlı kredi kartından <strong>2.000 TL</strong> depozito/provizyon işlemi uygulanmaktadır. Araç hasarsız ve eksiksiz teslim edildiğinde provizyon kaldırılır / iade edilir.
                                        </span>
                                    </div>
                                </div>

                                {/* Yasal Sözleşmeler ve İki Ayrı Zorunlu Onay Kutucuğu */}
                                <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2.5">
                                    <div className="flex items-start gap-2.5">
                                        <input
                                            type="checkbox"
                                            id="pre-info-agree"
                                            checked={preInfoAccepted}
                                            onChange={(e) => setPreInfoAccepted(e.target.checked)}
                                            required
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                                        />
                                        <label htmlFor="pre-info-agree" className="leading-snug cursor-pointer select-none">
                                            <TermsModal
                                                type="preInfo"
                                                trigger={
                                                    <span
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                                                    >
                                                        Ön Bilgilendirme Formu
                                                    </span>
                                                }
                                            />&apos;nu okudum ve onaylıyorum.
                                        </label>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <input
                                            type="checkbox"
                                            id="distance-contract-agree"
                                            checked={contractAccepted}
                                            onChange={(e) => setContractAccepted(e.target.checked)}
                                            required
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                                        />
                                        <label htmlFor="distance-contract-agree" className="leading-snug cursor-pointer select-none">
                                            <TermsModal
                                                type="rental"
                                                trigger={
                                                    <span
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                                                    >
                                                        Mesafeli Satış (Kiralama) Sözleşmesi
                                                    </span>
                                                }
                                            />&apos;ni okudum ve onaylıyorum.
                                        </label>
                                    </div>

                                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/70 flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <TermsModal
                                            type="cancellation"
                                            trigger={<span className="text-slate-500 hover:text-blue-600 underline cursor-pointer">İptal &amp; İade Koşulları</span>}
                                        />
                                        <span>•</span>
                                        <TermsModal
                                            type="privacy"
                                            trigger={<span className="text-slate-500 hover:text-blue-600 underline cursor-pointer">KVKK Aydınlatma Metni</span>}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting || !isAvailable || !preInfoAccepted || !contractAccepted}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Ödeme Ekranı Hazırlanıyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            <span>Rezervasyon Yap ve Güvenli Öde</span>
                                        </>
                                    )}
                                </button>

                                {/* PayTR ve Kart Logoları (Zarif ve Güven Veren Rozetler) */}
                                <div className="pt-2 flex flex-col items-center justify-center gap-2 border-t border-slate-100">
                                    <div className="flex items-center justify-center gap-2 text-slate-400">
                                        <div className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-extrabold text-blue-900 tracking-wider">
                                            VISA
                                        </div>
                                        <div className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-extrabold text-red-600 tracking-wider flex items-center gap-0.5">
                                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 -mr-1"></span>
                                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                                            <span className="text-[9px] text-slate-700 font-bold ml-1">Mastercard</span>
                                        </div>
                                        <div className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-extrabold text-cyan-700 tracking-wider">
                                            TROY
                                        </div>
                                        <div className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700 flex items-center gap-1">
                                            <Lock className="w-2.5 h-2.5 text-emerald-600" />
                                            <span>256-Bit SSL</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        Ödemeleriniz <strong className="text-slate-600">PayTR</strong> 3D Secure güvencesiyle alınır.
                                    </p>
                                </div>
                            </form>

                            {/* Alternative: Phone Call */}
                            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400 mb-2">veya telefonla hemen ayırtın:</p>
                                <a
                                    href="tel:+905536198164"
                                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                                >
                                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                                    +90 553 619 81 64 (7/24 Çağrı)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PayTR iFrame Modalı */}
            <PaytrModal
                isOpen={paytrData.isOpen}
                onClose={() => setPaytrData(prev => ({ ...prev, isOpen: false }))}
                token={paytrData.token}
                merchantOid={paytrData.merchantOid}
                totalAmount={paytrData.totalAmount}
                carName={`${car.brand} ${car.model}`}
            />
        </div>
    )
}
