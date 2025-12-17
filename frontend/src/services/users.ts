import { apiFetch } from './api';
import { Listing } from './listings';

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  telegram?: string;
}

export const userService = {
  getProfile: (id: number, isAuthenticated: boolean = false) => {
    const headers: Record<string, string> = {};
    if (isAuthenticated) {
      headers['X-Authenticated'] = 'true';
    }
    return apiFetch<User>(`/users/${id}`, { headers });
  },
  getUserListings: (userId: number) => {
    // Assuming the backend supports filtering by owner_id
    // If not, we'll fetch all and filter on frontend
    return apiFetch<Listing[]>(`/listings/?owner_id=${userId}`);
  },
};
