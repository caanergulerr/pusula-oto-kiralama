export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

const API_URL = '/api';

export const authService = {
    async register(data: any) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Registration failed');
        }
        return res.json();
    },

    async login(data: any) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
        }
        return res.json();
    },

    saveToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            window.dispatchEvent(new Event('auth-change'));
        }
    },

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.dispatchEvent(new Event('auth-change'));
            // Optional: Clear user data if stored
            window.location.href = '/login';
        }
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    isAdmin() {
        const token = this.getToken();
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role === 'ADMIN';
        } catch (e) {
            return false;
        }
    },

    async getProfile() {
        const token = this.getToken();
        if (!token) throw new Error("No token found");

        const res = await fetch(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            console.error("Profile fetch error:", res.status, res.statusText);
            if (res.status === 401) {
                this.logout();
                window.location.href = '/login';
            }
            throw new Error("Failed to fetch profile");
        }
        return res.json();
    }
};
