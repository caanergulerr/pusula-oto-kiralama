import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, Calendar } from "lucide-react"

interface ProfileInfoProps {
    user: any;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
    if (!user) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium leading-none">Ad Soyad</p>
                        <p className="text-sm text-muted-foreground">{user.fullName}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium leading-none">E-posta</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                {user.phone && (
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium leading-none">Telefon</p>
                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                    </div>
                )}
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium leading-none">Kayıt Tarihi</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
