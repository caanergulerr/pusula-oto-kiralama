"use client"

import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SifremiUnuttumPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return
        setLoading(true)
        setError("")
        try {
            const res = await fetch(`${'/api'}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setSent(true)
            } else {
                setError("Bir hata oluştu. Lütfen tekrar deneyin.")
            }
        } catch {
            setError("Sunucuya bağlanılamadı.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
                <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-medium mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Giriş sayfasına dön
                </Link>

                {!sent ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                                <Mail className="h-8 w-8 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800">Şifremi Unuttum</h1>
                            <p className="text-slate-400 mt-2 text-sm">
                                E-posta adresinizi girin, size şifre sıfırlama linki gönderelim.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">E-posta Adresi</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ornek@email.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 text-sm bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor...</>
                                ) : (
                                    "Sıfırlama Linki Gönder"
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Link Gönderildi!</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            <strong>{email}</strong> adresine şifre sıfırlama linki gönderdik. Lütfen mail kutunuzu kontrol edin.
                        </p>
                        <Link href="/login">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all">
                                Giriş Sayfasına Dön
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
