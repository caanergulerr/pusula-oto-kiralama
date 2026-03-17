"use client"

import { useEffect, useState } from "react"
import { bookingService } from "@/services/booking.service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadBookings()
    }, [])

    async function loadBookings() {
        try {
            const data = await bookingService.getBookings()
            setBookings(data)
        } catch (error) {
            toast.error("Rezervasyonlar yüklenemedi")
        } finally {
            setLoading(false)
        }
    }

    async function handleStatusUpdate(id: string, status: string) {
        try {
            await bookingService.updateStatus(id, status)
            toast.success("Durum güncellendi")
            loadBookings()
        } catch (error) {
            toast.error("Güncelleme başarısız")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'default';
            case 'PENDING': return 'secondary';
            case 'CANCELLED': return 'destructive';
            case 'COMPLETED': return 'outline';
            default: return 'secondary';
        }
    }

    if (loading) return <div>Yükleniyor...</div>

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
        cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length,
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Rezervasyon Yönetimi</h2>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm font-medium text-muted-foreground">Toplam</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-950 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Beklemede</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="rounded-lg border bg-green-50 dark:bg-green-950 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Onaylandı</p>
                    <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Tamamlandı</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <div className="rounded-lg border bg-red-50 dark:bg-red-950 p-4">
                    <p className="text-sm font-medium text-muted-foreground">İptal</p>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Araç</TableHead>
                            <TableHead>Müşteri</TableHead>
                            <TableHead>Tarihler</TableHead>
                            <TableHead>Tutar</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell className="font-medium">
                                    {booking.car?.brand} {booking.car?.model}
                                </TableCell>
                                <TableCell>
                                    {booking.user?.fullName || booking.user?.email}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {new Date(booking.startDate).toLocaleDateString("tr-TR")} -
                                    {new Date(booking.endDate).toLocaleDateString("tr-TR")}
                                </TableCell>
                                <TableCell>${booking.totalPrice}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(booking.status) as any}>
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {booking.status === 'PENDING' && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 border-green-200 hover:bg-green-100 hover:text-green-600"
                                                onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 border-red-200 hover:bg-red-100 hover:text-red-600"
                                                onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
