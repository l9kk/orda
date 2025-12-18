import { apiFetch } from './api';

export interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    location?: string;
    course_code?: string;
    isbn?: string;
    item_type?: string;
    origin?: string;
    destination?: string;
    contact_info?: string;
    owner_id: number;
}

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
