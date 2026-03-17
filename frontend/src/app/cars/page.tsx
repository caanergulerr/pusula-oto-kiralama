"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CarCard } from "@/components/home/car-card"
import { CarFilters, FilterValues } from "@/components/cars/car-filters"
import { Filter, X, Car as CarIcon } from "lucide-react" // Renamed Car to CarIcon to avoid conflict with type Car
import { carService, Car } from "@/services/car.service" // Import carService and Car type

import { Suspense } from "react"

function CarsPageContent() {
    const searchParams = useSearchParams()
    const [cars, setCars] = useState<Car[]>([])
    const [loading, setLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)
    const [activeFilters, setActiveFilters] = useState<FilterValues>({})

    useEffect(() => {
        const initialFilters: FilterValues = {}
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const fuelType = searchParams.get('fuelType')
        const gearType = searchParams.get('gearType')
        const features = searchParams.get('features')
        const category = searchParams.get('category')
        if (minPrice) initialFilters.minPrice = parseFloat(minPrice)
        if (maxPrice) initialFilters.maxPrice = parseFloat(maxPrice)
        if (fuelType) initialFilters.fuelType = fuelType
        if (gearType) initialFilters.gearType = gearType
        if (features) initialFilters.features = features.split(',')
        if (category) (initialFilters as any).category = category
        setActiveFilters(initialFilters)
        fetchCars(initialFilters)
    }, [searchParams])

    async function fetchCars(filters?: FilterValues) {
        setLoading(true)
        try {
            const data = await carService.getCars()
            let filtered = [...data]
            
            if (filters) {
                if (filters.minPrice) filtered = filtered.filter(c => c.dailyPrice >= (filters.minPrice ?? 0))
                if (filters.maxPrice) filtered = filtered.filter(c => c.dailyPrice <= (filters.maxPrice ?? Infinity))
                if (filters.fuelType) filtered = filtered.filter(c => c.fuelType === filters.fuelType)
                if (filters.gearType) filtered = filtered.filter(c => c.gearType === filters.gearType)
                if ((filters as any).category) filtered = filtered.filter(c => c.category === (filters as any).category)
            }
            // Sadece müsait araçları göster
            setCars(filtered.filter((c: Car) => (c.availableStock ?? 0) > 0))
        } catch (error) {
            console.error('Error fetching cars:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (filters: FilterValues) => {
        setActiveFilters(filters)
        fetchCars(filters)
    }

    const hasFilters = Object.keys(activeFilters).length > 0

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-0 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
                    <h1 className="text-5xl font-bold text-white mb-3">
                        Araç <span className="text-blue-400">Filomuz</span>
                    </h1>
                    <p className="text-slate-400 text-lg">{cars.length} araç arasından size en uygun olanı bulun</p>
                </div>
                {/* Dalga Geçişi */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 block">
                        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc" />
                    </svg>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
                {/* Filter Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-8 flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${showFilters || hasFilters
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                        {showFilters ? 'Kapat' : 'Filtrele'}
                        {hasFilters && <span className="bg-white text-blue-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{Object.keys(activeFilters).length}</span>}
                    </button>

                    {hasFilters && (
                        <>
                            {activeFilters.minPrice && <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">Min: ₺{activeFilters.minPrice}</span>}
                            {activeFilters.maxPrice && <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">Max: ₺{activeFilters.maxPrice}</span>}
                            {activeFilters.fuelType && <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-medium">{activeFilters.fuelType}</span>}
                            {activeFilters.gearType && <span className="px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-sm font-medium">{activeFilters.gearType}</span>}
                            <button onClick={() => handleFilterChange({})} className="text-sm text-red-500 hover:text-red-600 font-semibold ml-2">Temizle</button>
                        </>
                    )}
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {showFilters && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <CarFilters onFilterChange={handleFilterChange} />
                            </div>
                        </div>
                    )}

                    <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
                        {loading ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                                        <div className="h-48 bg-slate-100" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-5 bg-slate-100 rounded w-2/3" />
                                            <div className="h-4 bg-slate-100 rounded w-1/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                                <CarIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-700 mb-2">Araç Bulunamadı</h3>
                                <p className="text-slate-400 mb-6">Filtreleri değiştirmeyi deneyin.</p>
                                <button onClick={() => handleFilterChange({})} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
                                    Filtreleri Temizle
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {cars.map(car => (
                                    <div key={car.id} className="hover:-translate-y-1 transition-transform duration-300">
                                        <CarCard car={car} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CarsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <CarsPageContent />
        </Suspense>
    )
}
