"use client"

import { useEffect, useState } from "react"
import { CarCard } from "./car-card"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function FeaturedCars() {
    const [cars, setCars] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCars() {
            try {
                const res = await fetch("http://127.0.0.1:3000/cars")
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                // Sadece müsait araçları göster
                const available = data.filter((c: any) => c.availableStock > 0)
                setCars(available.slice(0, 3))
            } catch (error) {
                console.error(error)
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                            <Sparkles className="h-4 w-4" />
                            Müsait Araçlar
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
                            Kiralık <span className="text-blue-600">Araçlarımız</span>
                        </h2>
                        <p className="text-slate-500 mt-3 text-lg max-w-xl">
                            Güncel araç filomuzdan size en uygun aracı seçin ve hemen kiralayın.
                        </p>
                    </div>
                    <Link href="/cars" className="flex-shrink-0">
                        <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all">
                            Tümünü Gör
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </Link>
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
