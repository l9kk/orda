import { apiFetch } from './api';

export interface Subscription {
  id: number;
  user_id: number;
  keyword: string;
}

export const notificationService = {
  getSubscriptions: (userId: number) =>
    apiFetch<Subscription[]>(`/subscriptions/?user_id=${userId}`),
  
  addSubscription: (userId: number, keyword: string) =>
    apiFetch<Subscription>('/subscriptions/', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, keyword }),
    }),
  
  deleteSubscription: (id: number) =>
    apiFetch<void>(`/subscriptions/${id}`, {
      method: 'DELETE',
    }),
};
