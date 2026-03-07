"use client"

import { useState } from "react"
import { MapPin, Calendar, Search } from "lucide-react"
import { useRouter } from "next/navigation"

const LOCATIONS = [
    "Elazığ",
    "Elazığ Havalimanı",
    "Malatya",
    "Diyarbakır",
    "Tunceli"
]

export function BookingWidget() {
    const router = useRouter()
    const [pickup, setPickup] = useState("")
    const [dropoff, setDropoff] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // İleride buraya query parametreleri eklenebilir: ?pickup=Elazığ&dropoff=...
        router.push("/cars")
    }

    return (
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl shadow-blue-900/20 max-w-5xl mx-auto mt-10 md:mt-16 w-full relative z-20">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">

                {/* Alış Yeri */}
                <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                    <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-0.5 uppercase tracking-wider">Alış Yeri</label>
                        <select
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            className="w-full bg-transparent text-slate-700 font-semibold focus:outline-none appearance-none cursor-pointer"
                            required
                        >
                            <option value="" disabled>Şehir veya Havalimanı seçin</option>
                            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                </div>

                {/* Teslim Yeri */}
                <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                    <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-0.5 uppercase tracking-wider">Teslim Yeri</label>
                        <select
                            value={dropoff}
                            onChange={(e) => setDropoff(e.target.value)}
                            className="w-full bg-transparent text-slate-700 font-semibold focus:outline-none appearance-none cursor-pointer"
                            required
                        >
                            <option value="" disabled>Aynı yer veya farklı konum</option>
                            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                </div>

                {/* Buton */}
                <button type="submit" className="w-full md:w-1/4 h-full min-h-[56px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" />
                    <span>Araç Bul</span>
                </button>

            </form>
        </div>
    )
}
