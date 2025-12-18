import { apiFetch } from './api';
import { Listing } from '@/types';

export type { Listing };

export const listingService = {
    getAll: (sort?: string) => {
        const query = sort ? `?sort_by=${sort}` : '';
        return apiFetch<Listing[]>(`/listings/${query}`);
    },
    getById: (id: number) => apiFetch<Listing>(`/listings/${id}`),
    create: (data: Partial<Listing>) =>
        apiFetch<Listing>('/listings/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
