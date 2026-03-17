"use client"

import { useEffect, useState } from "react"
import { Car, carService } from "@/services/car.service"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Minus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function AdminCarsPage() {
    const [cars, setCars] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCars()
    }, [])

    async function loadCars() {
        try {
            const data = await carService.getCars()
            setCars(data)
        } catch {
            toast.error("Araçlar yüklenemedi")
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu aracı silmek istediğinize emin misiniz?")) return
        try {
            await carService.deleteCar(id)
            toast.success("Araç silindi")
            loadCars()
        } catch {
            toast.error("Silme işlemi başarısız")
        }
    }

    async function handleStockChange(car: any, delta: number) {
        const maxStock = car.totalStock || 99
        const newStock = Math.max(0, Math.min(maxStock, (car.availableStock ?? 0) + delta))
        if (newStock === car.availableStock) return

        // Optimistic UI — anında güncelle
        setCars(prev => prev.map(c => c.id === car.id ? { ...c, availableStock: newStock } : c))

        try {
            await carService.updateCar(car.id, { availableStock: newStock })
            if (newStock === 0) toast.success("🔴 Araç müsait dışı yapıldı")
            else if (car.availableStock === 0) toast.success("✅ Araç tekrar müsait")
            else toast.success(`Müsait stok: ${newStock}`)
        } catch {
            // Geri al
            setCars(prev => prev.map(c => c.id === car.id ? { ...c, availableStock: car.availableStock } : c))
            toast.error("Stok güncellenemedi")
        }
    }

    if (loading) return <div className="p-8 text-center">Yükleniyor...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Araç Yönetimi</h2>
                <Button asChild>
                    <Link href="/admin/cars/new">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Araç Ekle
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Marka / Model</TableHead>
                            <TableHead>Yıl</TableHead>
                            <TableHead>Günlük Fiyat</TableHead>
                            <TableHead>Yakıt</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Müsait Stok</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cars.map((car) => {
                            const isAvailable = (car.availableStock ?? 0) > 0
                            const total = car.totalStock || car.availableStock || 1
                            return (
                                <TableRow key={car.id}>
                                    <TableCell className="font-medium">{car.brand} {car.model}</TableCell>
                                    <TableCell>{car.year}</TableCell>
                                    <TableCell>₺{car.dailyPrice}</TableCell>
                                    <TableCell>{car.fuelType}</TableCell>
                                    <TableCell>
                                        <span className={isAvailable ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                                            {isAvailable ? "✅ Müsait" : "🔴 Müsait Değil"}
                                        </span>
                                    </TableCell>
                                    {/* Stok Sayacı: - [sayı] + */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleStockChange(car, -1)}
                                                disabled={(car.availableStock ?? 0) <= 0}
                                                className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className={`w-8 text-center font-bold text-lg ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                                                {car.availableStock ?? 0}
                                            </span>
                                            <button
                                                onClick={() => handleStockChange(car, +1)}
                                                disabled={(car.availableStock ?? 0) >= total}
                                                className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-green-50 hover:border-green-300 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            >
                                                <span className="text-base leading-none">+</span>
                                            </button>
                                            <span className="text-xs text-slate-400">/ {total}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/cars/${car.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(car.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
