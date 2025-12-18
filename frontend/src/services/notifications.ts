import { apiFetch } from './api';
import { Subscription, Notification } from '@/types';

export type { Subscription, Notification };

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

    getNotifications: () =>
        apiFetch<Notification[]>('/subscriptions/notifications'),

    markAsRead: (id: number) =>
        apiFetch<void>(`/subscriptions/notifications/${id}/read`, {
            method: 'POST',
        }),

    markAllAsRead: () =>
        apiFetch<void>('/subscriptions/notifications/read-all', {
            method: 'POST',
        }),
};
