"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/admin/stat-card"
import { Card } from "@/components/ui/card"
import { Car, Calendar, Users, DollarSign, Clock, CheckCircle } from "lucide-react"

interface DashboardStats {
    totalCars: number
    availableCars: number
    totalBookings: number
    pendingBookings: number
    activeBookings: number
    totalUsers: number
    totalRevenue: number
}

interface PopularCar {
    id: string
    brand: string
    model: string
    bookingCount: number
    imageUrl?: string
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [popularCars, setPopularCars] = useState<PopularCar[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    async function fetchDashboardData() {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pusula-oto-kiralama-production.up.railway.app'
        try {
            const token = localStorage.getItem('token')

            // Fetch dashboard stats
            const statsRes = await fetch(`${API_URL}/stats/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }

            // Fetch popular cars
            const carsRes = await fetch(`${API_URL}/stats/popular-cars`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (carsRes.ok) {
                const carsData = await carsRes.json()
                setPopularCars(carsData)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Hoş geldiniz! İşte işletmenizin genel görünümü.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Toplam Araç"
                    value={stats?.totalCars || 0}
                    icon={Car}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                />
                <StatCard
                    title="Müsait Araç"
                    value={stats?.availableCars || 0}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
                <StatCard
                    title="Toplam Rezervasyon"
                    value={stats?.totalBookings || 0}
                    icon={Calendar}
                    iconColor="text-purple-600"
                    iconBgColor="bg-purple-100"
                />
                <StatCard
                    title="Toplam Gelir"
                    value={`₺${stats?.totalRevenue?.toLocaleString('tr-TR') || 0}`}
                    icon={DollarSign}
                    iconColor="text-yellow-600"
                    iconBgColor="bg-yellow-100"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Bekleyen Rezervasyonlar"
                    value={stats?.pendingBookings || 0}
                    icon={Clock}
                    iconColor="text-orange-600"
                    iconBgColor="bg-orange-100"
                />
                <StatCard
                    title="Aktif Rezervasyonlar"
                    value={stats?.activeBookings || 0}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
                <StatCard
                    title="Toplam Kullanıcı"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    iconColor="text-indigo-600"
                    iconBgColor="bg-indigo-100"
                />
            </div>

            {/* Popular Cars */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">En Popüler Araçlar</h2>
                {popularCars.length > 0 ? (
                    <div className="space-y-4">
                        {popularCars.map((car, index) => (
                            <div
                                key={car.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-bold">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {car.brand} {car.model}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {car.bookingCount} rezervasyon
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="w-24 bg-blue-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{
                                                width: `${Math.min((car.bookingCount / (popularCars[0]?.bookingCount || 1)) * 100, 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">Henüz popüler araç verisi yok</p>
                )}
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
                    <div className="space-y-3">
                        <a
                            href="/admin/cars/new"
                            className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <p className="font-medium text-blue-900">Yeni Araç Ekle</p>
                            <p className="text-sm text-blue-600">Filoya yeni araç ekleyin</p>
                        </a>
                        <a
                            href="/admin/bookings"
                            className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                            <p className="font-medium text-green-900">Rezervasyonları Görüntüle</p>
                            <p className="text-sm text-green-600">Tüm rezervasyonları yönetin</p>
                        </a>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Doluluk Oranı</span>
                            <span className="font-semibold text-gray-900">
                                {stats?.totalCars ? Math.round(((stats.totalCars - stats.availableCars) / stats.totalCars) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                    width: `${stats?.totalCars ? ((stats.totalCars - stats.availableCars) / stats.totalCars) * 100 : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
