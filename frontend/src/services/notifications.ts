import { apiFetch } from './api';
import { Subscription } from '@/types';

export type { Subscription };

export const notificationService = {
    getSubscriptions: () =>
        apiFetch<Subscription[]>('/subscriptions/'),

    addSubscription: (keyword: string) =>
        apiFetch<Subscription>('/subscriptions/', {
            method: 'POST',
            body: JSON.stringify({ keyword }),
        }),

    deleteSubscription: (id: number) =>
        apiFetch<void>(`/subscriptions/${id}`, {
            method: 'DELETE',
        }),
};
