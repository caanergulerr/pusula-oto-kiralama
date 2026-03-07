import Link from "next/link"
import { Car, Phone, MapPin, Mail, Clock } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Car className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-white text-lg leading-tight">Pusula</p>
                                <p className="text-xs text-slate-400 leading-tight">Oto Kiralama</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Elazığ'ın en güvenilir araç kiralama hizmeti. 3+ yıllık deneyim, 500+ mutlu müşteri.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Hızlı Bağlantılar</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Anasayfa', href: '/' },
                                { label: 'Araçlar', href: '/cars' },
                                { label: 'Hakkımızda', href: '/hakkimizda' },
                                { label: 'İletişim', href: '/iletisim' },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-4">İletişim</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="tel:+905536198164" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                    <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                    +90 553 619 81 64
                                </a>
                            </li>
                            <li>
                                <a href="mailto:otokiralamapusula@gmail.com" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                    <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                    otokiralamapusula@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="https://maps.app.goo.gl/MsBza54gUJPv2hAp9" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                    <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                    Pusula Oto Kiralama, Elazığ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Çalışma Saatleri</h4>
                        <ul className="space-y-2.5">
                            <li className="flex items-start gap-2.5 text-sm text-slate-400">
                                <Clock className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p>Hafta içi: 08:00 - 20:00</p>
                                    <p>Hafta sonu: 09:00 - 18:00</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">© 2024 Pusula Oto Kiralama. Tüm hakları saklıdır.</p>
                    <p className="text-slate-600 text-xs">Elazığ, Türkiye</p>
                </div>
            </div>
        </footer>
    )
}
