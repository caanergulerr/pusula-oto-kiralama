
const API_URL = '/api';

export interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    dailyPrice: number;
    imageUrl?: string;
    description?: string;
    fuelType?: string;
    gearType?: string;
    isAvailable?: boolean;
    features?: string;
    specs?: string;
    kmLimit?: number;
    plateNumber?: string;
    totalStock?: number;
    availableStock?: number;
}

export const carService = {
    async getCars(): Promise<Car[]> {
        const res = await fetch(`${API_URL}/cars`);
        if (!res.ok) throw new Error('Failed to fetch cars');
        return res.json();
    },

    async getCar(id: string): Promise<Car> {
        const res = await fetch(`${API_URL}/cars/${id}`);
        if (!res.ok) throw new Error('Failed to fetch car');
        return res.json();
    },

    async createCar(data: any) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create car');
        return res.json();
    },

    async updateCar(id: string, data: any) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/cars/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update car');
        return res.json();
    },

    async deleteCar(id: string) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/cars/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Failed to delete car');
        return res.json();
    }
};
