import { apiFetch } from './api';

export interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    listing_type: string;
    created_at: string;
    owner_id: number;
}

export const listingService = {
    getAll: (sort?: string) => {
        const query = sort ? `?sort_by=${sort}` : '';
        return apiFetch<Listing[]>(`/listings/${query}`);
    },
    getById: (id: number) => apiFetch<Listing>(`/listings/${id}`),
    create: (data: any) =>
        apiFetch<Listing>('/listings/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
