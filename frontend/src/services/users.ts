import { apiFetch } from './api';
import { User, AuthResponse, Listing } from '@/types';

export type { User, AuthResponse, Listing };

export const userService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const formData = new URLSearchParams();
        formData.append('username', email); // OAuth2 expects 'username' field
        formData.append('password', password);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Login failed' }));
            throw new Error(error.detail || 'Login failed');
        }

        return response.json();
    },

    register: (userData: Record<string, string>): Promise<User> => {
        return apiFetch<User>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    getProfile: (id: number) => {
        return apiFetch<User>(`/users/${id}`);
    },

    getUserListings: (userId: number) => {
        return apiFetch<Listing[]>(`/listings/?owner_id=${userId}`);
    },

    updateProfile: (id: number, data: { phone?: string; telegram?: string }) => {
        return apiFetch<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};
