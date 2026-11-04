import Link from "next/link"
import { Phone, MapPin, Mail, Building2, Receipt, ShieldCheck, Lock, ChevronRight } from "lucide-react"

const LEGAL_LINKS = [
    { label: "Mesafeli Satış (Kiralama) Sözleşmesi", href: "/kiralama-kosullari#mesafeli-satis" },
    { label: "İptal, İade ve Değişiklik Koşulları", href: "/kiralama-kosullari#iptal-iade" },
    { label: "Gizlilik ve Güvenlik Politikası", href: "/kiralama-kosullari#gizlilik-guvenlik" },
    { label: "KVKK Aydınlatma Metni ve Çerez Politikası", href: "/kiralama-kosullari#kvkk-cerez" },
    { label: "Araç Teslimat ve İade Şartları", href: "/kiralama-kosullari#teslimat-iade" },
]

const QUICK_LINKS = [
    { label: "Anasayfa", href: "/" },
    { label: "Araç Filomuz", href: "/cars" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "SSS", href: "/sss" },
    { label: "İletişim", href: "/iletisim" },
]

function VisaLogo() {
    return (
        <span className="inline-flex h-8 items-center rounded-md bg-white px-2.5">
            <span className="text-[15px] font-black italic tracking-tight text-[#1A1F71]">VISA</span>
        </span>
    )
}

function MastercardLogo() {
    return (
        <span className="inline-flex h-8 items-center rounded-md bg-white px-2" aria-label="Mastercard">
            <svg viewBox="0 0 38 24" className="h-5 w-auto" aria-hidden="true">
                <circle cx="14" cy="12" r="9" fill="#EB001B" />
                <circle cx="24" cy="12" r="9" fill="#F79E1B" />
                <path d="M19 4.8a9 9 0 0 1 0 14.4a9 9 0 0 1 0-14.4z" fill="#FF5F00" />
            </svg>
        </span>
    )
}

function TroyLogo() {
    return (
        <span className="inline-flex h-8 items-center rounded-md bg-white px-2.5">
            <span className="text-[14px] font-extrabold tracking-wide text-[#00A6A0]">troy</span>
        </span>
    )
}

function Badge({ icon: Icon, title, subtitle }: { icon: typeof Lock; title: string; subtitle: string }) {
    return (
        <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-2.5">
            <Icon className="h-4 w-4 text-emerald-400" />
            <span className="leading-none">
                <span className="block text-[11px] font-bold text-white">{title}</span>
                <span className="block text-[9px] text-slate-400">{subtitle}</span>
            </span>
        </span>
    )
}

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
                    {/* 1. Kurumsal Künye */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-3 mb-5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="Pusula Oto Kiralama" className="h-12 w-auto object-contain" />
                            <div>
                                <p className="font-bold text-white text-lg leading-tight">Pusula</p>
                                <p className="text-xs text-slate-400 leading-tight">Oto Kiralama</p>
                            </div>
                        </Link>

                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2.5">
                                <Building2 className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <span>
                                    <span className="block text-[11px] uppercase tracking-wider text-slate-500">Ticari Ünvan</span>
                                    <span className="text-slate-300">Pusula Oto Kiralama - Hasan Aktaş</span>
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Receipt className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <span>
                                    <span className="block text-[11px] uppercase tracking-wider text-slate-500">Vergi Dairesi / No</span>
                                    <span className="text-slate-300">Hazar V.D. — 0400708479</span>
                                </span>
                            </li>
                            <li>
                                <a
                                    href="https://maps.app.goo.gl/MsBza54gUJPv2hAp9"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-start gap-2.5 text-slate-400 hover:text-blue-400 transition-colors"
                                >
                                    <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <span>İzzet Paşa Mah. Hacı Tevfik Efendi Sk. No: 2 İç Kapı No: 11 Merkez / Elazığ</span>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+905536198164" className="flex items-center gap-2.5 text-slate-400 hover:text-blue-400 transition-colors">
                                    <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                    +90 553 619 81 64
                                </a>
                            </li>
                            <li>
                                <a href="mailto:otokiralamapusula@gmail.com" className="flex items-center gap-2.5 text-slate-400 hover:text-blue-400 transition-colors break-all">
                                    <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                    otokiralamapusula@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* 2. Yasal ve Sözleşmeler */}
                    <div className="lg:col-span-4">
                        <h4 className="font-bold text-white mb-4">Yasal Bilgiler ve Sözleşmeler</h4>
                        <ul className="space-y-2.5">
                            {LEGAL_LINKS.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="group flex items-start gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                        <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Hızlı Menü */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-white mb-4">Hızlı Menü</h4>
                        <ul className="space-y-2.5">
                            {QUICK_LINKS.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Güvenli Ödeme */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-white mb-4">Güvenli Ödeme</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Ödemeleriniz <span className="text-white font-semibold">PayTR</span> güvenli ödeme altyapısı ve 3D Secure doğrulaması ile alınır. Kart bilgileriniz sunucularımızda saklanmaz.
                        </p>
                    </div>
                </div>

                {/* Alt bant: rozetler + telif */}
                <div className="border-t border-slate-800 pt-6 flex flex-col lg:flex-row items-center justify-between gap-5">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Badge icon={ShieldCheck} title="PayTR" subtitle="Güvenli Ödeme Altyapısı" />
                        <Badge icon={Lock} title="256-Bit SSL" subtitle="Şifreli Bağlantı" />
                        <Badge icon={ShieldCheck} title="3D Secure" subtitle="Doğrulamalı Ödeme" />
                        <VisaLogo />
                        <MastercardLogo />
                        <TroyLogo />
                    </div>
                    <p className="text-slate-500 text-sm text-center">
                        © 2026 Pusula Oto Kiralama. Tüm Hakları Saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    )
}
