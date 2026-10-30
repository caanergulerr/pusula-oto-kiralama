const API_URL = '/api';

export interface CreateBookingPaymentParams {
    carId: string;
    startDate: string;
    endDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    identityNumber: string;
    insuranceType?: 'STANDART' | 'MINI' | 'FULL';
    address?: string;
    userId?: string;
}

export interface PaytrTokenResponse {
    status: 'success' | 'failed';
    token: string;
    iframeUrl: string;
    merchantOid: string;
    bookingId: string;
    totalPrice: number;
    days: number;
    insurancePrice: number;
    dailyPrice: number;
    reason?: string;
}

export interface PaymentStatusResponse {
    merchantOid: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
    amount: number;
    currency: string;
    createdAt: string;
    booking?: {
        id: string;
        startDate: string;
        endDate: string;
        totalPrice: number;
        status: string;
        customerName: string;
        customerPhone: string;
        customerEmail: string;
        identityNumber: string;
        insuranceType: string;
        days: number;
        car?: {
            id: string;
            brand: string;
            model: string;
            year: number;
            imageUrl?: string;
            dailyPrice: number;
        };
    };
}

export const paymentService = {
    async createPaytrToken(data: CreateBookingPaymentParams): Promise<PaytrTokenResponse> {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/payments/paytr/create-token`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.message || 'Ödeme başlatılamadı');
        }

        return json;
    },

    async getPaymentStatus(merchantOid: string): Promise<PaymentStatusResponse> {
        const res = await fetch(`${API_URL}/payments/status/${merchantOid}`);
        if (!res.ok) {
            throw new Error('Rezervasyon detayları alınamadı');
        }
        return res.json();
    },

    async simulateSuccess(merchantOid: string): Promise<string> {
        const res = await fetch(`${API_URL}/payments/paytr/simulate-success/${merchantOid}`, {
            method: 'POST',
        });
        if (!res.ok) {
            throw new Error('Simülasyon işlemi başarısız');
        }
        return res.text();
    },
};

