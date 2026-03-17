"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

import { Suspense } from "react"

function SifreSifirlaContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMsg, setErrorMsg] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirm) {
            setErrorMsg("Şifreler eşleşmiyor.")
            return
        }
        if (password.length < 6) {
            setErrorMsg("Şifre en az 6 karakter olmalı.")
            return
        }
        setLoading(true)
        setErrorMsg("")
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            })
            if (res.ok) {
                setStatus("success")
            } else {
                const data = await res.json()
                setStatus("error")
                setErrorMsg(data.message || "Sıfırlama başarısız.")
            }
        } catch {
            setStatus("error")
            setErrorMsg("Sunucuya bağlanılamadı.")
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Geçersiz Link</h1>
                    <p className="text-slate-500 mb-6">Bu link geçersiz veya süresi dolmuş.</p>
                    <Link href="/sifremi-unuttum">
                        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Tekrar Dene</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
                {status === "success" ? (
                    <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Şifre Güncellendi!</h1>
                        <p className="text-slate-500 mb-8">Yeni şifrenizle giriş yapabilirsiniz.</p>
                        <Link href="/login">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all">
                                Giriş Yap
                            </button>
                        </Link>
                    </div>
                ) : status === "error" ? (
                    <div className="text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Hata Oluştu</h1>
                        <p className="text-slate-500 mb-8">{errorMsg}</p>
                        <Link href="/sifremi-unuttum">
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all">
                                Tekrar Dene
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                                <Lock className="h-8 w-8 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800">Yeni Şifre Belirle</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Yeni Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm bg-slate-50 focus:bg-white"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Şifre Tekrar</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Kaydediliyor...</> : "Şifremi Güncelle"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default function SifreSifirlaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <SifreSifirlaContent />
        </Suspense>
    )
}
