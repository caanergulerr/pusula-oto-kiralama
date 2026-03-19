"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Fuel, Users, Cog, ArrowRight, Phone } from "lucide-react"

interface CarCardProps {
    car: {
        id: string
        brand: string
        model: string
        year: number
        dailyPrice: number
        imageUrl?: string
        specs?: string
        status?: string
        availableStock?: number
    }
}

export function CarCard({ car }: CarCardProps) {
    let specs: any = {}
    try { specs = car.specs ? JSON.parse(car.specs) : {} } catch { specs = {} }

    const isAvailable = car.availableStock !== undefined ? car.availableStock > 0 : car.status === 'AVAILABLE'
    const [imgError, setImgError] = useState(false)

    return (
        <Link href={`/cars/${car.id}`} className="block group">
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden cursor-pointer">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
                    {car.imageUrl && !imgError ? (
                        <Image
                            src={car.imageUrl}
                            alt={`${car.brand} ${car.model}`}
                            fill
                            unoptimized
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                            style={{ mixBlendMode: 'multiply' }}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">🚗</div>
                    )}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow ${isAvailable ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {isAvailable ? 'Müsait' : 'Dolu'}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="mb-3">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-slate-400">{car.year}</p>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                            { icon: Fuel, label: specs.fuelType || specs.fuel || 'Benzin' },
                            { icon: Cog, label: specs.transmission || specs.gear || 'Otomatik' },
                            { icon: Users, label: `${specs.seats || '5'} Kişi` },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl border border-slate-100">
                                <Icon className="h-4 w-4 text-blue-500" />
                                <span className="text-xs text-slate-500 font-medium text-center leading-tight">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                            <p className="text-xs text-slate-400">Günlük</p>
                            <p className="text-2xl font-bold text-blue-600">₺{car.dailyPrice}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.location.href = 'tel:+905536198164'
                                }}
                            >
                                <Phone className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-500/20">
                                İncele
                                <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
