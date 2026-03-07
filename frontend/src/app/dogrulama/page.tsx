"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function DogrulamaPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Doğrulama linki geçersiz.")
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/verify?token=${token}`)
            .then(async (res) => {
                const data = await res.json()
                if (res.ok) {
                    setStatus("success")
                    setMessage(data.message || "E-posta adresiniz başarıyla doğrulandı!")
                } else {
                    setStatus("error")
                    setMessage(data.message || "Doğrulama başarısız. Link geçersiz veya süresi dolmuş.")
                }
            })
            .catch(() => {
                setStatus("error")
                setMessage("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.")
            })
    }, [token])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                {status === "loading" && (
                    <>
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Doğrulanıyor...</h1>
                        <p className="text-slate-500">Lütfen bekleyin.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Hesabınız Doğrulandı! 🎉</h1>
                        <p className="text-slate-500 mb-8">{message}</p>
                        <Link href="/login">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all">
                                Giriş Yap
                            </button>
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Doğrulama Başarısız</h1>
                        <p className="text-slate-500 mb-8">{message}</p>
                        <Link href="/">
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all">
                                Anasayfaya Dön
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}
