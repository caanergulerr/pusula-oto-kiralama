"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Car } from "@/services/car.service"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"
import Image from "next/image"

const carSchema = z.object({
    brand: z.string().min(2, "Marka en az 2 karakter olmalı"),
    model: z.string().min(2, "Model en az 2 karakter olmalı"),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    dailyPrice: z.coerce.number().min(0, "Fiyat 0'dan küçük olamaz"),
    totalStock: z.coerce.number().min(1, "Stok en az 1 olmalı"),
    kmLimit: z.coerce.number().min(0, "Kilometre sınırı 0'dan küçük olamaz").optional(),
    imageUrl: z.string().optional(),
    description: z.string().optional(),
    fuelType: z.string().min(1, "Yakıt tipi seçiniz"),
    gearType: z.string().min(1, "Vites tipi seçiniz"),
    category: z.string().optional(),
})

const CAR_CATEGORIES = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'suv', label: 'SUV' },
    { value: 'minivan', label: 'Minivan' },
]

interface CarFormProps {
    initialData?: Car;
    onSubmit: (data: z.infer<typeof carSchema> & { features?: string }) => Promise<void>;
}

const AVAILABLE_FEATURES = [
    { id: 'gps', label: 'GPS Navigasyon' },
    { id: 'bluetooth', label: 'Bluetooth' },
    { id: 'heatedSeats', label: 'Isıtmalı Koltuklar' },
    { id: 'camera360', label: '360 Kamera' },
    { id: 'sunroof', label: 'Sunroof' },
    { id: 'parkingSensor', label: 'Park Sensörü' },
    { id: 'cruiseControl', label: 'Hız Sabitleyici' },
    { id: 'leatherSeats', label: 'Deri Koltuk' },
]

// Backend dosyaları frontend/public/cars/ klasörüne kaydediyor
// Bu yüzden URL formatı /cars/filename.jpg ve direkt servis ediliyor
function toDisplayUrl(url: string | undefined): string {
    if (!url) return ""
    return url  // Zaten /cars/... formatında, Next.js public'ten direkt servis eder
}

export function CarForm({ initialData, onSubmit }: CarFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>(toDisplayUrl(initialData?.imageUrl))
    // Mevcut kayıtlı ek fotoğraf URL'leri (veritabanından geldi)
    const [existingExtraUrls, setExistingExtraUrls] = useState<string[]>(() => {
        if (initialData?.imageUrls) {
            try { return JSON.parse(initialData.imageUrls) } catch { return [] }
        }
        return []
    })
    // Kullanıcının yeni seçtiği dosyalar (henüz yüklenmedi)
    const [extraFiles, setExtraFiles] = useState<File[]>([])
    const [newExtraPreviews, setNewExtraPreviews] = useState<string[]>([])
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() => {
        if (initialData?.features) {
            try {
                return JSON.parse(initialData.features)
            } catch {
                return []
            }
        }
        return []
    })
    const [customFeatures, setCustomFeatures] = useState<string[]>([])
    const [newFeature, setNewFeature] = useState("")

    // specs JSON'dan yakıt/vites bilgilerini çıkar
    const parsedSpecs = (() => {
        if (!initialData?.specs) return {}
        try { return JSON.parse(initialData.specs as string) } catch { return {} }
    })()

    const form = useForm({
        resolver: zodResolver(carSchema),
        defaultValues: {
            brand: initialData?.brand || "",
            model: initialData?.model || "",
            year: initialData?.year || new Date().getFullYear(),
            dailyPrice: initialData?.dailyPrice || 0,
            totalStock: initialData?.totalStock || 1,
            kmLimit: initialData?.kmLimit || 0,
            imageUrl: initialData?.imageUrl || "",
            description: initialData?.description || "",
            fuelType: initialData?.fuelType || parsedSpecs?.fuelType || parsedSpecs?.fuel || "",
            gearType: initialData?.gearType || parsedSpecs?.transmission || parsedSpecs?.gear || "",
            category: (initialData as any)?.category || "",
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return
        setExtraFiles(prev => [...prev, ...files])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => setNewExtraPreviews(prev => [...prev, reader.result as string])
            reader.readAsDataURL(file)
        })
        e.target.value = ''
    }

    // Mevcut (kayıtlı) ek fotoğrafı sil
    const removeExistingExtra = (idx: number) => {
        setExistingExtraUrls(prev => prev.filter((_, i) => i !== idx))
    }

    // Yeni seçilen (henüz yüklenmemiş) ek fotoğrafı sil
    const removeNewExtra = (idx: number) => {
        setNewExtraPreviews(prev => prev.filter((_, i) => i !== idx))
        setExtraFiles(prev => prev.filter((_, i) => i !== idx))
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview("")
        form.setValue("imageUrl", "")
    }

    const toggleFeature = (featureId: string) => {
        setSelectedFeatures(prev =>
            prev.includes(featureId)
                ? prev.filter(f => f !== featureId)
                : [...prev, featureId]
        )
    }

    const addCustomFeature = () => {
        if (newFeature.trim() && !customFeatures.includes(newFeature.trim())) {
            const feature = newFeature.trim()
            setCustomFeatures(prev => [...prev, feature])
            setSelectedFeatures(prev => [...prev, feature])
            setNewFeature("")
        }
    }

    const removeCustomFeature = (feature: string) => {
        setCustomFeatures(prev => prev.filter(f => f !== feature))
        setSelectedFeatures(prev => prev.filter(f => f !== feature))
    }

    async function handleSubmit(data: z.infer<typeof carSchema>) {
        setLoading(true)
        try {
            let imageUrl = data.imageUrl || initialData?.imageUrl || ''
            // Başlangıç noktası: mevcut kayıtlı ek fotoğraflar (kullanıcı silmedikleri)
            let imageUrls: string[] = [...existingExtraUrls]

            // Upload main image if new file selected
            if (imageFile) {
                const formData = new FormData()
                formData.append('file', imageFile)
                const token = localStorage.getItem('token')
                const uploadRes = await fetch('/api/cars/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                })
                if (!uploadRes.ok) throw new Error('Image upload failed')
                const uploadData = await uploadRes.json()
                imageUrl = uploadData.path || imageUrl
            }

            // Upload yeni ek fotoğraflar
            if (extraFiles.length > 0) {
                const formData = new FormData()
                extraFiles.forEach(f => formData.append('files', f))
                const token = localStorage.getItem('token')
                const uploadRes = await fetch('/api/cars/upload-multiple', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                })
                if (uploadRes.ok) {
                    const uploaded = await uploadRes.json()
                    imageUrls = [...imageUrls, ...uploaded.map((u: any) => u.path)]
                } else {
                    throw new Error('Extra image upload failed')
                }
            }

            const submitData: any = {
                ...data,
                imageUrl,
                features: JSON.stringify(selectedFeatures),
                imageUrls: JSON.stringify(imageUrls)  // her zaman gönder (boş array bile)
            }

            await onSubmit(submitData)
            toast.success(initialData ? "Araç güncellendi" : "Araç eklendi")
            router.refresh()
            router.push("/admin/cars")
        } catch (error) {
            console.error(error)
            toast.error("Bir hata oluştu")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-4xl">
                {/* Image Upload Section */}
                <div className="space-y-4">
                    <Label>Araç Görseli</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        {imagePreview ? (
                            <div className="relative">
                                <div className="relative w-full h-64 mb-4">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        unoptimized
                                        className="object-contain rounded-lg"
                                    />
                                </div>
                                <div className="flex gap-2 justify-center">
                                    {/* Fotoğrafı Değiştir butonu — seçince direkt yeni dosya */}
                                    <label htmlFor="image-upload-replace" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                        <Upload className="h-3.5 w-3.5" />
                                        Fotoğrafı Değiştir
                                        <input
                                            id="image-upload-replace"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={removeImage}
                                    >
                                        <X className="mr-1.5 h-3.5 w-3.5" />
                                        Kaldır
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                                        Dosya Seç
                                    </span>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-sm text-gray-500 mt-2">
                                    PNG, JPG, GIF veya WEBP (MAX. 5MB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ek Fotoğraflar */}
                <div>
                    <Label className="text-base font-semibold">Ek Fotoğraflar (Opsiyonel)</Label>
                    <div className="mt-2 flex flex-wrap gap-3">
                        {/* Mevcut kayıtlı ek fotoğraflar */}
                        {existingExtraUrls.map((src, i) => (
                            <div key={`existing-${i}`} className="relative w-24 h-24 border rounded-lg overflow-hidden bg-slate-50">
                                <img src={src} alt={`mevcut-ek-${i}`} className="w-full h-full object-contain p-1" />
                                <button type="button" onClick={() => removeExistingExtra(i)} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {/* Yeni eklenen (henüz yüklenmemiş) ek fotoğraflar */}
                        {newExtraPreviews.map((src, i) => (
                            <div key={`new-${i}`} className="relative w-24 h-24 border-2 border-blue-300 rounded-lg overflow-hidden bg-blue-50">
                                <img src={src} alt={`yeni-ek-${i}`} className="w-full h-full object-contain p-1" />
                                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-[9px] text-center py-0.5">Yeni</div>
                                <button type="button" onClick={() => removeNewExtra(i)} className="absolute bottom-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <label htmlFor="extra-images" className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition-colors">
                            <Upload className="h-6 w-6 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-400">Ekle</span>
                            <input id="extra-images" type="file" accept="image/*" multiple onChange={handleExtraImages} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marka</FormLabel>
                                <FormControl>
                                    <Input placeholder="Örn: Toyota" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                    <Input placeholder="Örn: Corolla" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Yıl</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="2024" {...field} value={field.value as number | string || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dailyPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Günlük Fiyat (₺)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1000" {...field} value={field.value as number | string || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="totalStock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Toplam Stok</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1" {...field} value={field.value as number | string || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="kmLimit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kilometre Sınırı (günlük)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="150" {...field} value={field.value as number | string || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Yakıt Tipi</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full px-3 py-2 border rounded-md">
                                        <option value="">Seçiniz</option>
                                        <option value="Benzin">Benzin</option>
                                        <option value="Dizel">Dizel</option>
                                        <option value="Elektrik">Elektrik</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gearType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vites Tipi</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full px-3 py-2 border rounded-md">
                                        <option value="">Seçiniz</option>
                                        <option value="Manuel">Manuel</option>
                                        <option value="Otomatik">Otomatik</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Araç Kategorisi</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full px-3 py-2 border rounded-md">
                                        <option value="">Kategori Seçiniz</option>
                                        {CAR_CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Açıklama</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Araç hakkında detaylı bilgi..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Features Selection */}
                <div className="space-y-4">
                    <Label>Araç Özellikleri</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {AVAILABLE_FEATURES.map((feature) => (
                            <div key={feature.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={feature.id}
                                    checked={selectedFeatures.includes(feature.id)}
                                    onCheckedChange={() => toggleFeature(feature.id)}
                                />
                                <label
                                    htmlFor={feature.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {feature.label}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Custom Features */}
                    <div className="space-y-3 mt-6">
                        <Label>Özel Özellikler Ekle</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Örn: Şerit Takip Sistemi"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        addCustomFeature()
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                onClick={addCustomFeature}
                                variant="outline"
                                className="shrink-0"
                            >
                                ➕ Ekle
                            </Button>
                        </div>

                        {/* Display Custom Features */}
                        {customFeatures.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                                {customFeatures.map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md"
                                    >
                                        <div className="flex items-center space-x-2 flex-1">
                                            <Checkbox
                                                id={`custom-${feature}`}
                                                checked={selectedFeatures.includes(feature)}
                                                onCheckedChange={() => toggleFeature(feature)}
                                            />
                                            <label
                                                htmlFor={`custom-${feature}`}
                                                className="text-sm font-medium cursor-pointer flex-1"
                                            >
                                                {feature}
                                            </label>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeCustomFeature(feature)}
                                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                    >
                        {loading ? "Kaydediliyor..." : initialData ? "Güncelle" : "Ekle"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        İptal
                    </Button>
                </div>
            </form>
        </Form>
    )
}
