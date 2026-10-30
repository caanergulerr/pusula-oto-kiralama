"use client"

import { useEffect, useState } from "react"
import { bookingService } from "@/services/booking.service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Phone, User as UserIcon, Shield, CreditCard } from "lucide-react"
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
            case 'FAILED': return 'destructive';
            case 'COMPLETED': return 'outline';
            default: return 'secondary';
        }
    }

    const getPaymentBadge = (payment?: any) => {
        if (!payment) {
            return <Badge variant="secondary">Ödeme Yok</Badge>
        }
        if (payment.status === 'SUCCESS') {
            return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">✓ Ödendi</Badge>
        }
        if (payment.status === 'FAILED') {
            return <Badge variant="destructive">✗ Başarısız</Badge>
        }
        return <Badge variant="secondary">Bekliyor</Badge>
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
        cancelled: bookings.filter(b => b.status === 'CANCELLED' || b.status === 'FAILED').length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length,
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Rezervasyon Yönetimi</h2>
                <span className="text-xs text-slate-500">PayTR Entegre Rezervasyonlar</span>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">Toplam</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-xl border bg-yellow-50 dark:bg-yellow-950 p-4 shadow-sm">
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Beklemede</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="rounded-xl border bg-green-50 dark:bg-green-950 p-4 shadow-sm">
                    <p className="text-xs font-medium text-green-800 dark:text-green-200">Onaylandı</p>
                    <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <div className="rounded-xl border bg-blue-50 dark:bg-blue-950 p-4 shadow-sm">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200">Tamamlandı</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <div className="rounded-xl border bg-red-50 dark:bg-red-950 p-4 shadow-sm col-span-2 sm:col-span-1">
                    <p className="text-xs font-medium text-red-800 dark:text-red-200">İptal / Başarısız</p>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/70">
                            <TableHead className="font-bold">Araç</TableHead>
                            <TableHead className="font-bold">Müşteri Bilgileri</TableHead>
                            <TableHead className="font-bold">Tarihler & Süre</TableHead>
                            <TableHead className="font-bold">Kasko & Tutar</TableHead>
                            <TableHead className="font-bold">Ödeme (PayTR)</TableHead>
                            <TableHead className="font-bold">Rezervasyon</TableHead>
                            <TableHead className="text-right font-bold">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                                    Henüz rezervasyon kaydı bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking) => {
                                const customerName = booking.customerName || booking.user?.fullName || 'Misafir Müşteri'
                                const customerPhone = booking.customerPhone || booking.user?.phone
                                const customerEmail = booking.customerEmail || booking.user?.email

                                return (
                                    <TableRow key={booking.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium">
                                            <div className="font-bold text-slate-800">
                                                {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Bilinmeyen Araç'}
                                            </div>
                                            <div className="text-xs text-slate-400">{booking.car?.year}</div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="font-medium text-slate-800 flex items-center gap-1.5">
                                                <UserIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span>{customerName}</span>
                                            </div>
                                            {customerPhone && (
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Phone className="w-3 h-3 text-slate-400" />
                                                    <a href={`tel:${customerPhone}`} className="hover:underline">{customerPhone}</a>
                                                </div>
                                            )}
                                            {booking.identityNumber && (
                                                <div className="text-[11px] text-slate-400 font-mono">
                                                    TC: {booking.identityNumber}
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-xs">
                                            <div className="font-medium text-slate-700">
                                                {new Date(booking.startDate).toLocaleDateString("tr-TR")} - {new Date(booking.endDate).toLocaleDateString("tr-TR")}
                                            </div>
                                            <div className="text-slate-400 mt-0.5">
                                                {booking.days || 1} Günlük
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="font-bold text-slate-900">
                                                ₺{Number(booking.totalPrice).toLocaleString('tr-TR')}
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Shield className="w-3 h-3 text-emerald-500" />
                                                <span>{booking.insuranceType || 'STANDART'}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {getPaymentBadge(booking.payment)}
                                            {booking.merchantOid && (
                                                <div className="text-[10px] text-slate-400 font-mono mt-1" title={booking.merchantOid}>
                                                    Ref: {booking.merchantOid.slice(0, 14)}...
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={getStatusColor(booking.status) as any}>
                                                {booking.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {booking.status === 'PENDING' && (
                                                <div className="flex justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 border-green-200 hover:bg-green-100 hover:text-green-600"
                                                        onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                                        title="Onayla"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 border-red-200 hover:bg-red-100 hover:text-red-600"
                                                        onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                                        title="İptal Et"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
