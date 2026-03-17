"use client"

import { CarForm } from "@/components/admin/car-form"
import { carService, Car } from "@/services/car.service"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditCarPage() {
    const params = useParams()
    const router = useRouter()
    const [car, setCar] = useState<Car | null>(null)
    const [loading, setLoading] = useState(true)

    // Handle params.id which might be string or array
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
        async function loadCar() {
            try {
                if (!id) return;
                const data = await carService.getCar(id)
                setCar(data)
            } catch (error) {
                toast.error("Araç bilgileri yüklenemedi")
                router.push("/admin/cars")
            } finally {
                setLoading(false)
            }
        }
        loadCar()
    }, [id, router])

    async function onSubmit(data: any) {
        try {
            if (!id) return;
            await carService.updateCar(id, data)
            toast.success("Araç başarıyla güncellendi")
        } catch (error) {
            toast.error("Güncelleme başarısız")
            throw error
        }
    }

    if (loading) return <div>Yükleniyor...</div>
    if (!car) return null

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Araç Düzenle</h2>
            <CarForm initialData={car} onSubmit={onSubmit} />
        </div>
    )
}
