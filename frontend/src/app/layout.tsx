import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Pusula Oto Kiralama | Elazığ, Malatya, Tunceli, Diyarbakır Araç Kiralama",
    template: "%s | Pusula Oto Kiralama",
  },
  description:
    "Elazığ, Malatya, Tunceli ve Diyarbakır'da güvenilir ve uygun fiyatlı araç kiralama hizmeti. Elazığ rent a car, havalimanı transfer, günlük kiralık araç. 7/24 destek.",
  keywords: [
    "elazığ rent a car",
    "elazığ oto kiralama",
    "elazığ araç kiralama",
    "malatya rent a car",
    "malatya oto kiralama",
    "malatya araç kiralama",
    "tunceli rent a car",
    "tunceli oto kiralama",
    "tunceli araç kiralama",
    "diyarbakır rent a car",
    "diyarbakır oto kiralama",
    "diyarbakır araç kiralama",
    "havalimanı oto kiralama",
    "havalimanı araç kiralama",
    "elazığ havalimanı araç kiralama",
    "günlük araç kiralama",
    "kiralık araba elazığ",
    "ucuz araç kiralama elazığ",
    "pusula oto kiralama",
    "doğu anadolu araç kiralama",
  ],
  authors: [{ name: "Pusula Oto Kiralama" }],
  creator: "Pusula Oto Kiralama",
  publisher: "Pusula Oto Kiralama",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Pusula Oto Kiralama",
    title: "Pusula Oto Kiralama | Elazığ & Bölge Araç Kiralama",
    description:
      "Elazığ, Malatya, Tunceli ve Diyarbakır'da uygun fiyatlı kiralık araç. Geniş filo, 7/24 destek, kapıdan teslimat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pusula Oto Kiralama | Elazığ Araç Kiralama",
    description: "Elazığ ve çevre illerde güvenilir araç kiralama hizmeti.",
  },
  alternates: {
    canonical: "https://pusulaotokiralama.com.tr",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="t2Fnwo6VdGcEyJf0-Q5MlbBcWo-Dig-tY2m5VMdI8I0" />
        {/* Local Business Schema - Google'a işletme bilgilerini iletir */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://pusulaotokiralama.com.tr",
              name: "Pusula Oto Kiralama",
              description:
                "Elazığ, Malatya, Tunceli ve Diyarbakır'da araç kiralama hizmeti. Geniş araç filosu, uygun fiyatlar ve 7/24 müşteri desteği.",
              url: "https://pusulaotokiralama.com.tr",
              telephone: "+90-553-619-81-64",
              email: "otokiralamapusula@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Elazığ Merkez",
                addressLocality: "Elazığ",
                addressRegion: "Elazığ",
                postalCode: "23000",
                addressCountry: "TR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 38.6810,
                longitude: 39.2264,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "08:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
              areaServed: [
                { "@type": "City", name: "Elazığ" },
                { "@type": "City", name: "Malatya" },
                { "@type": "City", name: "Tunceli" },
                { "@type": "City", name: "Diyarbakır" },
                { "@type": "City", name: "Bingöl" },
                { "@type": "City", name: "Adıyaman" },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Kiralık Araç Hizmetleri",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Günlük Araç Kiralama",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Havalimanı Transfer ve Araç Kiralama",
                    },
                  },
                ],
              },
              priceRange: "₺₺",
              currenciesAccepted: "TRY",
              paymentAccepted: "Cash, Credit Card",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </div>
        <Toaster richColors position="top-right" />

        {/* Floating İletişim Butonları */}
        <div className="fixed left-4 bottom-8 z-50 flex flex-col gap-3">
          {/* WhatsApp */}
          <a
            href="https://wa.me/905536198164"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-13 h-13 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            style={{ width: 52, height: 52, backgroundColor: '#25D366' }}
            title="WhatsApp ile yazın"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.564 4.138 1.545 5.865L.057 23.457a.5.5 0 0 0 .612.612l5.588-1.485A11.951 11.951 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.866 9.866 0 0 1-5.034-1.376l-.361-.215-3.744.995.998-3.712-.236-.381A9.866 9.866 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z" />
            </svg>
          </a>

          {/* Telefon 1 */}
          <a
            href="tel:+905536198164"
            className="group flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            style={{ width: 52, height: 52, backgroundColor: '#2563eb' }}
            title="Bizi arayın"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </a>
        </div>
      </body>

    </html>
  );
}
