"use client"

import { useEffect, useState } from "react"
import { CarCard } from "./car-card"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { carService, Car } from "@/services/car.service"

const CATEGORIES = [
    {
        key: "sedan",
        label: "Sedan",
        image: "/cars/sedan.jpg",
    },
    {
        key: "hatchback",
        label: "Hatchback",
        image: "/cars/hatchback.jpg",
    },
    {
        key: "suv",
        label: "SUV",
        image: "/cars/suv.jpg",
    },
    {
        key: "minivan",
        label: "Minivan",
        image: "/cars/minivan.jpg",
    },
]

export function FeaturedCars() {
    const [cars, setCars] = useState<any[]>([])
    const [allCars, setAllCars] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

    useEffect(() => {
        async function fetchCars() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
                const res = await fetch(`${API_URL}/cars`)
                const data = await carService.getCars()
                setCars(data.slice(0, 3))
            } catch (error) {
                console.error('Error fetching cars:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchCars()
    }, [])

    function handleCategoryClick(catKey: string) {
        if (activeCategory === catKey) {
            // Tekrar tıklayınca filtreyi kaldır
            setActiveCategory(null)
            setCars(allCars.slice(0, 3))
        } else {
            setActiveCategory(catKey)
            const filtered = allCars.filter(c => c.category === catKey)
            setCars(filtered)
        }
    }

    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Kategori Kartları */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8 sm:mb-12">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.key}
                            href={`/cars?category=${cat.key}`}
                            className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                        >
                            <div className="w-full h-16 sm:h-24 flex items-center justify-center overflow-hidden">
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
                                    style={{ maxWidth: '200px' }}
                                />
                            </div>
                            <span className="font-bold text-xs sm:text-sm uppercase tracking-wide text-slate-700 group-hover:text-blue-600 transition-colors text-center">
                                {cat.label}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400">
                                {categoryCounts[cat.key] ?? 0} araç
                            </span>
                        </Link>
                    ))}
                </div>


                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                            <Sparkles className="h-4 w-4" />
                            {activeCategory ? CATEGORIES.find(c => c.key === activeCategory)?.label + ' Araçları' : 'Müsait Araçlar'}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
                            Kiralık <span className="text-blue-600">Araçlarımız</span>
                        </h2>
                        <p className="text-slate-500 mt-3 text-lg max-w-xl">
                            Güncel araç filomuzdan size en uygun aracı seçin ve hemen kiralayın.
                        </p>
                    </div>
                    <Link
                        href={activeCategory ? `/cars?category=${activeCategory}` : '/cars'}
                        className="flex-shrink-0"
                    >
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
                ) : cars.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-500 text-lg mb-4">Bu kategoride müsait araç bulunamadı.</p>
                        <button
                            onClick={() => { setActiveCategory(null); setCars(allCars.slice(0, 3)); }}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                        >
                            Tüm Araçları Göster
                        </button>
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
