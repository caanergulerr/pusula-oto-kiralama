"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkAdmin() {
            try {
                if (!authService.isAuthenticated()) {
                    router.push("/login")
                    return
                }

                const user = await authService.getProfile()
                if (user.role !== 'ADMIN') {
                    toast.error("Bu sayfaya erişim yetkiniz yok!")
                    router.push("/")
                    return
                }

                setIsAdmin(true)
            } catch (error) {
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }
        checkAdmin()
    }, [router])

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Kontrol ediliyor...</div>
    }

    if (!isAdmin) return null;

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <AdminSidebar />
            </div>
            <main className="md:pl-72">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
