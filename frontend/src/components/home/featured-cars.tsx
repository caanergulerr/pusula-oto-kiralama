"use client"

import { useEffect, useState } from "react"
import { CarCard } from "./car-card"
import { Sparkles } from "lucide-react"
import { carService } from "@/services/car.service"

const CATEGORY_ORDER = ["sedan", "hatchback", "suv", "minivan", "panelvan"]

export function FeaturedCars() {
    const [cars, setCars] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCars() {
            try {
                const data = await carService.getCars()
                // Kategori sırasına göre sırala: sedan > hatchback > suv > minivan
                const sorted = [...data].sort((a, b) => {
                    const ai = CATEGORY_ORDER.indexOf(a.category ?? "")
                    const bi = CATEGORY_ORDER.indexOf(b.category ?? "")
                    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
                })
                setCars(sorted)
            } catch (error) {
                console.error('Error fetching cars:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchCars()
    }, [])

    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Header */}
                <div className="flex flex-col items-start gap-4 mb-14">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                        <Sparkles className="h-4 w-4" />
                        Müsait Araçlar
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
                        Kiralık <span className="text-blue-600">Araçlarımız</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl">
                        Güncel araç filomuzdan size en uygun aracı seçin ve hemen kiralayın.
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                                <div className="h-48 bg-slate-100" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-slate-100 rounded w-2/3" />
                                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                                    <div className="h-10 bg-slate-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-500 text-lg">Henüz araç eklenmemiş.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cars.map((car) => (
                            <div key={car.id} className="transform transition-all duration-300 hover:-translate-y-1">
                                <CarCard car={car} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
