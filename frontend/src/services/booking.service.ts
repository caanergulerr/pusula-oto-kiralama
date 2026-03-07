
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pusula-oto-kiralama-production.up.railway.app';

export const bookingService = {
    async getMyBookings() {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const res = await fetch(`${API_URL}/bookings/my-bookings`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch bookings');
        }

        return res.json();
    },

    async getBookings() {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/bookings`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) throw new Error('Failed to fetch all bookings');
        return res.json();
    },

    async updateStatus(id: string, status: string) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/bookings/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    }
};
