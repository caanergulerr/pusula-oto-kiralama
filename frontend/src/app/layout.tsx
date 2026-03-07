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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
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
      </body>
    </html>
  );
}
