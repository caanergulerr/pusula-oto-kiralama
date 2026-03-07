"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const FUEL_TYPES = ["Benzin", "Dizel", "Elektrik", "Hybrid"]
const GEAR_TYPES = ["Otomatik", "Manuel"]
const FEATURES = [
    { id: "gps", label: "GPS Navigasyon" },
    { id: "bluetooth", label: "Bluetooth" },
    { id: "heatedSeats", label: "Isıtmalı Koltuklar" },
    { id: "camera360", label: "360 Kamera" },
    { id: "sunroof", label: "Sunroof" },
    { id: "parkingSensor", label: "Park Sensörü" },
    { id: "cruiseControl", label: "Hız Sabitleyici" },
    { id: "leatherSeats", label: "Deri Koltuk" },
]

interface CarFiltersProps {
    onFilterChange: (filters: FilterValues) => void
}

export interface FilterValues {
    minPrice?: number
    maxPrice?: number
    fuelType?: string
    gearType?: string
    features?: string[]
}

export function CarFilters({ onFilterChange }: CarFiltersProps) {
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")
    const [fuelType, setFuelType] = useState<string>("")
    const [gearType, setGearType] = useState<string>("")
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

    const handleApplyFilters = () => {
        const filters: FilterValues = {}

        if (minPrice) filters.minPrice = parseFloat(minPrice)
        if (maxPrice) filters.maxPrice = parseFloat(maxPrice)
        if (fuelType && fuelType !== "all") filters.fuelType = fuelType
        if (gearType && gearType !== "all") filters.gearType = gearType
        if (selectedFeatures.length > 0) filters.features = selectedFeatures

        onFilterChange(filters)
    }

    const handleResetFilters = () => {
        setMinPrice("")
        setMaxPrice("")
        setFuelType("")
        setGearType("")
        setSelectedFeatures([])
        onFilterChange({})
    }

    const toggleFeature = (featureId: string) => {
        setSelectedFeatures(prev =>
            prev.includes(featureId)
                ? prev.filter(f => f !== featureId)
                : [...prev, featureId]
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-blue-600 hover:text-blue-700"
                >
                    Temizle
                </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Fiyat Aralığı (₺/Gün)</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Fuel Type */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Yakıt Tipi</Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Tümü" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {FUEL_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Gear Type */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Vites Tipi</Label>
                <Select value={gearType} onValueChange={setGearType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Tümü" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        {GEAR_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Features */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Özellikler</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {FEATURES.map(feature => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={feature.id}
                                checked={selectedFeatures.includes(feature.id)}
                                onCheckedChange={() => toggleFeature(feature.id)}
                            />
                            <label
                                htmlFor={feature.id}
                                className="text-sm text-gray-700 cursor-pointer"
                            >
                                {feature.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Apply Button */}
            <Button
                onClick={handleApplyFilters}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
                Filtrele
            </Button>
        </div>
    )
}
