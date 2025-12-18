import { apiFetch } from './api';

export interface Subscription {
    id: number;
    user_id: number;
    keyword: string;
}

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
