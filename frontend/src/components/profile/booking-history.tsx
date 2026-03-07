import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, Phone, MessageCircle, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BookingHistoryProps {
    bookings: any[];
}

export function BookingHistory({ bookings }: BookingHistoryProps) {
    if (!bookings || bookings.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Kiralamalarım</h2>

                {/* Bilgi Notu */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4 items-start">
                    <div className="bg-blue-100 p-2.5 rounded-xl shrink-0">
                        <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-blue-800 mb-1">Henüz kiralamanız bulunmuyor</p>
                        <p className="text-blue-600 text-sm leading-relaxed">
                            Araç kiralama talebi oluşturmak için bize telefonla ulaşabilir veya WhatsApp üzerinden mesaj gönderebilirsiniz. Taleplerinizi en kısa sürede yanıtlıyoruz.
                        </p>
                    </div>
                </div>

                {/* İletişim Kartları */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="tel:+905536198164">
                        <div className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg rounded-2xl p-6 flex items-center gap-4 transition-all group cursor-pointer">
                            <div className="bg-blue-100 group-hover:bg-blue-600 p-3.5 rounded-xl transition-colors shrink-0">
                                <Phone className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium mb-0.5">Hemen Ara</p>
                                <p className="font-bold text-slate-800">+90 553 619 81 64</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="https://wa.me/905536198164?text=Merhaba%2C%20ara%C3%A7%20kiralamak%20istiyorum." target="_blank" rel="noopener noreferrer">
                        <div className="bg-white border border-slate-200 hover:border-green-300 hover:shadow-lg rounded-2xl p-6 flex items-center gap-4 transition-all group cursor-pointer">
                            <div className="bg-green-100 group-hover:bg-green-600 p-3.5 rounded-xl transition-colors shrink-0">
                                <MessageCircle className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium mb-0.5">WhatsApp ile Yaz</p>
                                <p className="font-bold text-slate-800">Mesaj Gönder</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'default'; // primary color
            case 'PENDING': return 'secondary';
            case 'CANCELLED': return 'destructive';
            case 'COMPLETED': return 'outline';
            default: return 'secondary';
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'Onaylandı';
            case 'PENDING': return 'Bekliyor';
            case 'CANCELLED': return 'İptal Edildi';
            case 'COMPLETED': return 'Tamamlandı';
            default: return status;
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Geçmiş Kiralamalar</h2>
            <div className="grid gap-4">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                            <div className="relative h-48 w-full sm:h-auto sm:w-48 bg-muted">
                                {booking.car?.imageUrl ? (
                                    <Image
                                        src={booking.car.imageUrl}
                                        alt={`${booking.car.brand} ${booking.car.model}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-6">
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg">{booking.car?.brand} {booking.car?.model}</h3>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {new Date(booking.startDate).toLocaleDateString("tr-TR")} - {new Date(booking.endDate).toLocaleDateString("tr-TR")}
                                            </div>
                                        </div>
                                        <Badge variant={getStatusColor(booking.status) as any}>
                                            {getStatusText(booking.status)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Toplam Tutar: <span className="font-medium text-foreground ml-1">${booking.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
