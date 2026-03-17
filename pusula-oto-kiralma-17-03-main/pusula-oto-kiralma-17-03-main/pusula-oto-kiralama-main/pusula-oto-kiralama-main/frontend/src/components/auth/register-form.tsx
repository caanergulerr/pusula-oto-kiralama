"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/auth.service"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

const formSchema = z.object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
    email: z.string().email("Geçerli bir e-posta giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

export function RegisterForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const { confirmPassword, ...registerData } = values
            await authService.register(registerData)
            setEmailSent(true)
        } catch (error: any) {
            toast.error(error.message || "Kayıt işlemi başarısız")
        } finally {
            setLoading(false)
        }
    }

    if (emailSent) {
        return (
            <div className="mx-auto max-w-sm text-center space-y-6 py-10">
                <div className="text-6xl">📧</div>
                <h1 className="text-2xl font-bold text-slate-800">E-posta Kutunuzu Kontrol Edin!</h1>
                <p className="text-slate-500 leading-relaxed">
                    <strong>Kayıt başarılı!</strong> Size e-posta adresinize bir doğrulama linki gönderdik. Mail kutunuzu kontrol edip linke tıklayın, ardından giriş yapabilirsiniz.
                </p>
                <Link href="/login">
                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
                        Giriş Sayfasına Git
                    </button>
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Kayıt Ol</h1>
                <p className="text-gray-500 dark:text-gray-400">Yeni bir hesap oluşturun</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ahmet" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Soyad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Yılmaz" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-posta</FormLabel>
                                <FormControl>
                                    <Input placeholder="ornek@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Şifre</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Şifre Tekrar</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm">
                Zaten hesabınız var mı?{" "}
                <Link href="/login" className="underline hover:text-primary">
                    Giriş Yap
                </Link>
            </div>
        </div>
    )
}
