import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { FloatingButtons } from "@/components/layout/floating-buttons";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://elazigotokiralamapusula.com"),
  title: {
    default: "Elazığ Oto Kiralama & Rent a Car | Pusula Oto Kiralama | 0553 619 81 64",
    template: "%s | Pusula Oto Kiralama",
  },
  description:
    "Elazığ oto kiralama ve rent a car hizmetinde kaskolu araçlar, 7/24 havalimanı teslimatı ve en uygun günlük fiyatlar. Pusula Oto Kiralama ile hemen rezervasyon yapın!",
  keywords: [
    "elazığ oto kiralama",
    "elazığ araç kiralama",
    "elazığ rent a car",
    "elazığ havalimanı araç kiralama",
    "elazığ kiralık araba",
    "pusula oto kiralama elazığ",
    "izzetpaşa araç kiralama",
  ],
  authors: [{ name: "Pusula Oto Kiralama - Hasan Aktaş" }],
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
    url: "https://elazigotokiralamapusula.com/",
    locale: "tr_TR",
    siteName: "Pusula Oto Kiralama",
    title: "Elazığ Oto Kiralama & Rent a Car | Pusula Oto Kiralama",
    description:
      "Elazığ'da kaskolu, güvenilir ve uygun fiyatlı oto kiralama. Havalimanı ve şehir merkezi 7/24 teslimat imkanı.",
    images: [
      {
        url: "https://elazigotokiralamapusula.com/images/og-share.jpg",
        width: 1200,
        height: 630,
        alt: "Elazığ Oto Kiralama & Rent a Car | Pusula Oto Kiralama",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elazığ Oto Kiralama & Rent a Car | Pusula Oto Kiralama",
    description:
      "Elazığ'da uygun fiyatlı, kaskolu ve 7/24 teslimatlı araç kiralama hizmeti.",
    images: ["https://elazigotokiralamapusula.com/images/og-share.jpg"],
  },
  alternates: {
    canonical: "https://elazigotokiralamapusula.com/",
  },
  other: {
    "geo.region": "TR-23",
    "geo.placename": "Elazığ",
    "geo.position": "38.6748;39.2225",
    ICBM: "38.6748, 39.2225",
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
        <meta name="geo.region" content="TR-23" />
        <meta name="geo.placename" content="Elazığ" />
        <meta name="geo.position" content="38.6748;39.2225" />
        <meta name="ICBM" content="38.6748, 39.2225" />
        {/* Google Harita ve Yerel İşletme Yapısal Verisi (JSON-LD AutoRental Schema) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRental",
              name: "Pusula Oto Kiralama - Hasan Aktaş",
              alternateName: "Elazığ Pusula Rent a Car",
              url: "https://elazigotokiralamapusula.com/",
              logo: "https://elazigotokiralamapusula.com/logo.png",
              image: "https://elazigotokiralamapusula.com/images/og-share.jpg",
              telephone: "+905536198164",
              priceRange: "₺₺",
              address: {
                "@type": "PostalAddress",
                streetAddress: "İzzet Paşa Mah. Hacı Tevfik Efendi Sk. No: 2 İç Kapı No: 11",
                addressLocality: "Merkez",
                addressRegion: "Elazığ",
                postalCode: "23200",
                addressCountry: "TR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 38.6748,
                longitude: 39.2225,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              areaServed: [
                { "@type": "AdministrativeArea", name: "Elazığ" },
                { "@type": "AdministrativeArea", name: "Elazığ Havalimanı (EZS)" },
              ],
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
        <FloatingButtons />
      </body>

    </html>
  );
}
