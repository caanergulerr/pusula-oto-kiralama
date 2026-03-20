"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, LogOut, Shield, Menu, X, ChevronDown } from "lucide-react"
import { authService } from "@/services/auth.service"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        if (authService.isAuthenticated()) {
            authService.getProfile().then(setUser).catch(() => {
                authService.logout()
            })
        }

        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Admin sayfalarında navbar gösterilmez — hook'lardan SONRA kontrol edilmeli
    if (pathname?.startsWith('/admin')) return null

    const handleLogout = () => {
        authService.logout()
        setUser(null)
        toast.success("Çıkış yapıldı")
        router.push('/')
    }

    const SERVICES = [
        { label: 'Elazığ Oto Kiralama', href: '/cars' },
        { label: 'Havalimanı Oto Kiralama', href: '/cars' },
        { label: 'Malatya Oto Kiralama', href: '/cars' },
        { label: 'Tunceli Oto Kiralama', href: '/cars' },
        { label: 'Diyarbakır Oto Kiralama', href: '/cars' },
    ]

    // Giriş/Kayıt vb. açık renkli arkaplana sahip sayfalarda navbar her zaman beyaz kalmalı
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const showScrolled = scrolled || isAuthPage;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
                <div className="flex h-16 md:h-20 items-center justify-between transition-all">

                    {/* Logo - Sol */}
                    <div className="flex-shrink-0 md:mr-8">
                        <Link href="/">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/logo.png"
                                alt="Pusula Oto Kiralama"
                                className="h-10 md:h-16 w-auto object-contain transition-all"
                            />
                        </Link>
                    </div>

                    {/* Desktop Nav - Ortada */}
                    <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
                        <Link href="/" className={`text-sm font-semibold transition-colors relative group ${showScrolled ? pathname === '/' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600' : pathname === '/' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                            Anasayfa
                            <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${pathname === '/' ? 'w-full bg-blue-500' : 'w-0 group-hover:w-full bg-blue-400'}`} />
                        </Link>
                        <Link href="/cars" className={`text-sm font-semibold transition-colors relative group ${showScrolled ? pathname === '/cars' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600' : pathname === '/cars' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                            Araçlar
                            <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${pathname === '/cars' ? 'w-full bg-blue-500' : 'w-0 group-hover:w-full bg-blue-400'}`} />
                        </Link>

                        {/* Hizmetlerimiz Dropdown */}
                        <div className="relative group/dropdown py-4">
                            <button className={`flex items-center gap-1 text-sm font-semibold transition-colors ${showScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white'}`}>
                                Hizmetlerimiz
                                <ChevronDown className="h-4 w-4 transition-transform group-hover/dropdown:rotate-180" />
                            </button>
                            <div className="absolute top-[calc(100%-0.5rem)] left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform origin-top group-hover/dropdown:translate-y-0 translate-y-2">
                                <div className="p-2 space-y-1">
                                    {SERVICES.map(link => (
                                        <Link key={link.label} href={link.href} className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link href="/hakkimizda" className={`text-sm font-semibold transition-colors relative group ${showScrolled ? pathname === '/hakkimizda' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600' : pathname === '/hakkimizda' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                            Hakkımızda
                            <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${pathname === '/hakkimizda' ? 'w-full bg-blue-500' : 'w-0 group-hover:w-full bg-blue-400'}`} />
                        </Link>
                        <Link href="/haberler" className={`text-sm font-semibold transition-colors relative group ${showScrolled ? pathname === '/haberler' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600' : pathname === '/haberler' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                            Haberler
                            <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${pathname === '/haberler' ? 'w-full bg-blue-500' : 'w-0 group-hover:w-full bg-blue-400'}`} />
                        </Link>
                        <Link href="/iletisim" className={`text-sm font-semibold transition-colors relative group ${showScrolled ? pathname === '/iletisim' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600' : pathname === '/iletisim' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                            İletişim
                            <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${pathname === '/iletisim' ? 'w-full bg-blue-500' : 'w-0 group-hover:w-full bg-blue-400'}`} />
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                        {user ? (
                            <>
                                {user.role === 'ADMIN' && (
                                    <Link href="/admin/cars">
                                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-sm">
                                            <Shield className="mr-1.5 h-4 w-4" />
                                            Yönetim
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm" className={`rounded-xl font-semibold ${showScrolled ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50' : 'text-white hover:bg-white/10'}`}>
                                        <User className="mr-1.5 h-4 w-4" />
                                        Profil
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className={`rounded-xl font-semibold ${showScrolled ? 'text-slate-500 hover:text-red-500 hover:bg-red-50' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    <LogOut className="mr-1.5 h-4 w-4" />
                                    Çıkış
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className={`rounded-xl font-semibold ${showScrolled ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50' : 'text-white hover:bg-white/10'}`}>
                                        Giriş Yap
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20">
                                        Kayıt Ol
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden ml-auto p-2 rounded-lg ${scrolled ? 'text-slate-600' : 'text-white'}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg overflow-y-auto w-full" style={{maxHeight: 'calc(100vh - 64px)'}}>
                    <div className="px-6 py-4 pb-28 space-y-3">
                        <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-blue-600">Anasayfa</Link>
                        <Link href="/cars" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-blue-600">Araçlar</Link>

                        {/* Mobile Hizmetlerimiz */}
                        <div className="py-2">
                            <div className="text-slate-700 font-semibold mb-2">Hizmetlerimiz</div>
                            <div className="pl-4 space-y-2 border-l-2 border-slate-100">
                                {SERVICES.map(link => (
                                    <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link href="/hakkimizda" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-blue-600">Hakkımızda</Link>
                        <Link href="/haberler" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-blue-600">Haberler</Link>
                        <Link href="/iletisim" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-blue-600">İletişim</Link>
                        <div className="pt-3 border-t border-slate-100 flex gap-3">
                            {user ? (
                                <Button onClick={handleLogout} variant="outline" className="flex-1 rounded-xl">Çıkış</Button>
                            ) : (
                                <>
                                    <Link href="/login" className="flex-1"><Button variant="outline" className="w-full rounded-xl">Giriş</Button></Link>
                                    <Link href="/register" className="flex-1"><Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl">Kayıt</Button></Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
