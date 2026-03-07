import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    iconColor?: string
    iconBgColor?: string
}

export function StatCard({ title, value, icon: Icon, trend, iconColor = "text-blue-600", iconBgColor = "bg-blue-100" }: StatCardProps) {
    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
                <div className={`p-4 rounded-2xl ${iconBgColor}`}>
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                </div>
            </div>
        </Card>
    )
}
