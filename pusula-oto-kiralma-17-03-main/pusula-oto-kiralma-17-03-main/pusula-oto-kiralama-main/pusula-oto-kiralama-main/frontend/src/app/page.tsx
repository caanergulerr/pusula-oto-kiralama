import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { FeaturedCars } from "@/components/home/featured-cars"
import { WhyUs } from "@/components/home/why-us"
import { Testimonials } from "@/components/home/testimonials"

export const metadata: Metadata = {
  title: "Elazığ Rent A Car | Uygun Fiyatlı Araç Kiralama - Pusula Oto Kiralama",
  description:
    "Elazığ'da araç kiralama mı arıyorsunuz? Pusula Oto Kiralama ile Elazığ, Malatya, Tunceli ve Diyarbakır'da uygun fiyatlı, güvenilir rent a car hizmeti. Havalimanı teslimat. Hemen rezervasyon yapın!",
  alternates: {
    canonical: "https://pusulaotokiralama.com.tr",
  },
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <Hero />
      <FeaturedCars />
      <WhyUs />
      <Testimonials />

      {/* SEO Hizmet Bölgeleri - Görünür içerik */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            Hizmet Bölgelerimiz
          </h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-10">
            Elazığ merkez ofisimizden Malatya, Tunceli, Diyarbakır ve çevre illere araç kiralama ve havalimanı transfer hizmeti sunuyoruz.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { city: "Elazığ", kws: ["Elazığ Rent A Car", "Elazığ Oto Kiralama", "Elazığ Havalimanı Araç Kiralama"] },
              { city: "Malatya", kws: ["Malatya Rent A Car", "Malatya Oto Kiralama", "Malatya Araç Kiralama"] },
              { city: "Tunceli", kws: ["Tunceli Rent A Car", "Tunceli Oto Kiralama", "Tunceli Araç Kiralama"] },
              { city: "Diyarbakır", kws: ["Diyarbakır Rent A Car", "Diyarbakır Oto Kiralama", "Diyarbakır Araç Kiralama"] },
              { city: "Havalimanı", kws: ["Havalimanı Transfer", "Havalimanı Araç Kiralama"] },
            ].map(({ city, kws }) => (
              <div key={city} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h3 className="font-bold text-slate-700 text-sm mb-2">📍 {city}</h3>
                <ul className="space-y-1">
                  {kws.map((kw) => (
                    <li key={kw} className="text-xs text-slate-500">{kw}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
