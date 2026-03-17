import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
            <LoginForm />
        </div>
    )
}
