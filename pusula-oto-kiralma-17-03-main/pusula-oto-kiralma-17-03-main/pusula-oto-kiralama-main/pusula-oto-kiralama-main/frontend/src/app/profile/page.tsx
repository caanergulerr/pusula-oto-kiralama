"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { bookingService } from "@/services/booking.service"
import { Button } from "@/components/ui/button"
import { ProfileInfo } from "@/components/profile/profile-info"
import { BookingHistory } from "@/components/profile/booking-history"
import { toast } from "sonner"

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProfileData() {
            try {
                if (!authService.isAuthenticated()) {
                    router.push("/login")
                    return
                }

                const [userData, bookingsData] = await Promise.all([
                    authService.getProfile(),
                    bookingService.getMyBookings()
                ])

                setUser(userData)
                setBookings(bookingsData)
            } catch (error) {
                console.error("Profile load error:", error)
                toast.error("Profil bilgileri yüklenemedi. Lütfen tekrar giriş yapın.")
                // authService.logout() // Optional: force logout on error
                // router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        loadProfileData()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Yükleniyor...
                </div>
            </div>
        )
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-28 pb-0 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-1">Hesabım</h1>
                    <p className="text-slate-400">Profil bilgilerinizi ve kiralama geçmişinizi görüntüleyin.</p>
                </div>
                {/* Dalga Geçişi */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-0">
                    <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 block">
                        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc" />
                    </svg>
                </div>
            </div>

            {/* İçerik */}
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
                <div className="grid gap-8 md:grid-cols-[320px_1fr]">
                    <div className="space-y-6">
                        <ProfileInfo user={user} />
                        {user.role === 'ADMIN' && (
                            <div className="flex justify-center">
                                <Button variant="destructive" size="lg" className="w-full" onClick={() => router.push('/admin/cars')}>
                                    Yönetim Paneline Git
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        <BookingHistory bookings={bookings} />
                    </div>
                </div>
            </div>
        </div>
    )
}
