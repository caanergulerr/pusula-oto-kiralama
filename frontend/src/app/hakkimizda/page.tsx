import { Shield, Star, Users, Clock, Award, Heart, CheckCircle } from "lucide-react"

const stats = [
    { label: "Mutlu Müşteri", value: "500+", icon: Users, color: "bg-blue-50 text-blue-600 border-blue-200" },
    { label: "Günlük Hizmet", value: "7/24", icon: Clock, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { label: "Güvenilir Hizmet", value: "✓", icon: Shield, color: "bg-violet-50 text-violet-600 border-violet-200" },
    { label: "Tam Kasko", value: "✓", icon: Award, color: "bg-amber-50 text-amber-600 border-amber-200" },
]

const values = [
    { icon: Shield, title: "Güvenilirlik", description: "Tüm araçlarımız düzenli bakımdan geçirilmekte ve sigortalı olarak teslim edilmektedir.", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Heart, title: "Müşteri Memnuniyeti", description: "Müşterilerimizin memnuniyeti bizim için her şeyden önce gelir. 7/24 destek sunuyoruz.", color: "text-rose-600", bg: "bg-rose-50" },
    { icon: Star, title: "Kalite", description: "Filomuzda yalnızca son model, bakımlı ve konforlu araçlar yer almaktadır.", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Award, title: "Deneyim", description: "Sektördeki köklü deneyimimizle Elazığ'ın güvenilir araç kiralama firmalarından biriyiz.", color: "text-violet-600", bg: "bg-violet-50" },
]

const whyList = [
    "Rekabetçi ve şeffaf fiyatlandırma",
    "Geniş ve modern araç filosu",
    "7/24 müşteri desteği",
    "Hızlı ve kolay kiralama süreci",
    "Tam kasko sigorta güvencesi",
    "Deneyimli ve güler yüzlü ekip",
]

export default function HakkimizdaPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-6 relative overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 pb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            Pusula Oto Kiralama
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Hakkımızda</h1>
                        <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
                            Pusula Oto Kiralama olarak Elazığ'da güvenilir,
                            konforlu ve uygun fiyatlı araç kiralama hizmeti sunuyoruz.
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 block">
                        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#ffffff" />
                    </svg>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div
                                key={stat.label}
                                className={`text-center p-6 rounded-2xl border ${stat.color} hover:shadow-lg transition-all`}
                            >
                                <stat.icon className="h-7 w-7 mx-auto mb-3" />
                                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                                <div className="text-slate-500 font-medium text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-800 mb-6">Hikayemiz</h2>
                            <div className="space-y-4 text-slate-500 leading-relaxed">
                                <p>Pusula Oto Kiralama, Elazığ'da güvenilir araç kiralama hizmeti sunmak amacıyla kuruldu. Müşterilerimize en iyi hizmeti sunma hedefiyle çıktığımız bu yolculukta, kaliteli filomuz ve güler yüzlü ekibimizle Elazığ'ın tercih edilen araç kiralama firmalarından biri haline geldik.</p>
                                <p>Şehir içi ulaşımdan uzun yol seyahatlerine, iş toplantılarından aile tatillerine kadar her ihtiyaca uygun araç seçeneklerimizle yanınızdayız.</p>
                                <p>Tüm araçlarımız düzenli bakım ve kontrolden geçirilmekte, tam kasko sigortası ile teslim edilmektedir.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Neden Bizi Seçmelisiniz?</h3>
                            <ul className="space-y-4">
                                {whyList.map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">Değerlerimiz</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Her kararımızda ve her hizmetimizde bu değerleri rehber ediniyoruz.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <div
                                key={v.title}
                                className="p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 ${v.bg} rounded-xl mb-4`}>
                                    <v.icon className={`h-6 w-6 ${v.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{v.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
