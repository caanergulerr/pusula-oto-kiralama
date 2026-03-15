"use client"

import { useEffect, useState } from "react"
import { CarCard } from "./car-card"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
    {
        key: "sedan",
        label: "Sedan",
        icon: (
            <svg viewBox="0 0 100 40" className="w-20 h-10" fill="currentColor">
                <path d="M10,30 L10,22 Q15,10 30,10 L70,10 Q85,10 88,20 L92,22 L92,30 Q92,34 88,34 L82,34 Q82,38 78,38 Q74,38 74,34 L28,34 Q28,38 24,38 Q20,38 20,34 L12,34 Q10,34 10,30Z" />
            </svg>
        ),
    },
    {
        key: "hatchback",
        label: "Hatchback",
        icon: (
            <svg viewBox="0 0 100 40" className="w-20 h-10" fill="currentColor">
                <path d="M10,30 L10,22 Q20,8 40,8 L70,8 Q84,8 88,20 L92,22 L92,30 Q92,34 88,34 L82,34 Q82,38 78,38 Q74,38 74,34 L28,34 Q28,38 24,38 Q20,38 20,34 L12,34 Q10,34 10,30Z" />
            </svg>
        ),
    },
    {
        key: "suv",
        label: "SUV",
        icon: (
            <svg viewBox="0 0 100 45" className="w-20 h-10" fill="currentColor">
                <path d="M8,32 L8,20 Q12,6 32,6 L70,6 Q86,6 90,18 L94,22 L94,32 Q94,37 90,37 L84,37 Q84,42 79,42 Q74,42 74,37 L26,37 Q26,42 21,42 Q16,42 16,37 L10,37 Q8,37 8,32Z" />
            </svg>
        ),
    },
    {
        key: "panelvan",
        label: "Panelvan",
        icon: (
            <svg viewBox="0 0 110 45" className="w-20 h-10" fill="currentColor">
                <path d="M8,34 L8,14 Q8,6 16,6 L86,6 Q98,6 100,14 L104,18 L104,34 Q104,38 100,38 L90,38 Q90,43 85,43 Q80,43 80,38 L26,38 Q26,43 21,43 Q16,43 16,38 L10,38 Q8,38 8,34Z" />
            </svg>
        ),
    },
    {
        key: "minivan",
        label: "Minivan",
        icon: (
            <svg viewBox="0 0 110 45" className="w-20 h-10" fill="currentColor">
                <path d="M8,34 L8,16 Q10,6 24,6 L76,6 Q88,6 92,14 L102,18 L104,24 L104,34 Q104,38 100,38 L90,38 Q90,43 85,43 Q80,43 80,38 L26,38 Q26,43 21,43 Q16,43 16,38 L10,38 Q8,38 8,34Z" />
            </svg>
        ),
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
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                const available = data.filter((c: any) => c.availableStock > 0)
                setAllCars(available)
                setCars(available.slice(0, 3))

                // Kategori sayılarını hesapla
                const counts: Record<string, number> = {}
                CATEGORIES.forEach(cat => {
                    counts[cat.key] = available.filter((c: any) => c.category === cat.key).length
                })
                setCategoryCounts(counts)
            } catch (error) {
                console.error(error)
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
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-12">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => handleCategoryClick(cat.key)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 group cursor-pointer
                                ${activeCategory === cat.key
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:shadow-md'
                                }`}
                        >
                            <div className={`transition-colors ${activeCategory === cat.key ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
                                {cat.icon}
                            </div>
                            <span className={`font-bold text-sm uppercase tracking-wide ${activeCategory === cat.key ? 'text-white' : 'text-slate-700'}`}>
                                {cat.label}
                            </span>
                            <span className={`text-xs ${activeCategory === cat.key ? 'text-blue-100' : 'text-slate-400'}`}>
                                {categoryCounts[cat.key] ?? 0} araç
                            </span>
                        </button>
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
