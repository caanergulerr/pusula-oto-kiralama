"use client"

import { useEffect, useState } from "react"

export function FloatingButtons() {
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        // Navbar'ın mobil menü durumunu izle
        const observer = new MutationObserver(() => {
            // md:hidden olan mobil menüyü kontrol et
            const mobileMenu = document.querySelector('header .md\\:hidden.bg-white.border-t')
            setMenuOpen(!!mobileMenu)
        })
        observer.observe(document.body, { childList: true, subtree: true })
        return () => observer.disconnect()
    }, [])

    if (menuOpen) return null

    return (
        <div className="fixed left-4 bottom-8 z-40 flex flex-col gap-3">
            {/* WhatsApp */}
            <a
                href="https://wa.me/905536198164"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                style={{ width: 52, height: 52, backgroundColor: '#25D366' }}
                title="WhatsApp ile yazın"
            >
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.564 4.138 1.545 5.865L.057 23.457a.5.5 0 0 0 .612.612l5.588-1.485A11.951 11.951 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.866 9.866 0 0 1-5.034-1.376l-.361-.215-3.744.995.998-3.712-.236-.381A9.866 9.866 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z" />
                </svg>
            </a>

            {/* Telefon */}
            <a
                href="tel:+905536198164"
                className="flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                style={{ width: 52, height: 52, backgroundColor: '#2563eb' }}
                title="Bizi arayın"
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
            </a>
        </div>
    )
}
