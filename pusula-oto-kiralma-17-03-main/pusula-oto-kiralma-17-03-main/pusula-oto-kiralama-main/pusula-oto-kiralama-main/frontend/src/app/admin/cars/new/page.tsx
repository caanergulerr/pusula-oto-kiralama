"use client"

import { CarForm } from "@/components/admin/car-form"
import { carService } from "@/services/car.service"
import { toast } from "sonner"

export default function NewCarPage() {
    async function onSubmit(data: any) {
        try {
            await carService.createCar(data)
            toast.success("Araç başarıyla oluşturuldu")
        } catch (error) {
            toast.error("Araç oluşturulurken bir hata oluştu")
            throw error // Re-throw to handle loading state in form if needed
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Yeni Araç Ekle</h2>
            <CarForm onSubmit={onSubmit} />
        </div>
    )
}
