"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"
import Link from "next/link"

const formSchema = z.object({
    email: z.string().email("Geçerli bir e-posta giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
})

import { Suspense } from "react"

function LoginFormContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: { email: "", password: "" },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const response = await authService.login({ email: values.email, password: values.password })
            authService.saveToken(response.access_token)
            const profile = await authService.getProfile()
            toast.success("Giriş başarılı! Hoş geldiniz.")
            const redirectTo = searchParams.get('from') || (profile.role === 'ADMIN' ? '/admin/cars' : '/')
            router.push(redirectTo)
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || ""
            if (msg.includes("EMAIL_NOT_VERIFIED") || msg.includes("email") || msg.includes("doğrulan")) {
                toast.error("E-posta adresiniz henüz doğrulanmamış. Lütfen mail kutunuzu kontrol edin.")
            } else {
                toast.error("E-posta veya şifre hatalı.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md relative z-10">
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                {/* Top accent */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-sky-400" />

                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                            <LogIn className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Giriş Yap</h1>
                        <p className="text-slate-400 mt-1 text-sm">Hesabınıza erişmek için giriş yapın</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">E-posta</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    {...form.register("email")}
                                    type="email"
                                    placeholder="ornek@email.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 text-sm bg-slate-50 focus:bg-white"
                                />
                            </div>
                            {form.formState.errors.email && (
                                <p className="text-red-500 text-xs mt-1.5">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-700">Şifre</label>
                                <Link href="/sifremi-unuttum" className="text-xs text-blue-600 hover:underline font-medium">
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    {...form.register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 text-sm bg-slate-50 focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-red-500 text-xs mt-1.5">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoading ? (
                                <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Giriş yapılıyor...</>
                            ) : (
                                <><LogIn className="h-4 w-4" /> Giriş Yap</>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Hesabınız yok mu?{" "}
                            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function LoginForm() {
    return (
        <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>}>
            <LoginFormContent />
        </Suspense>
    )
}
