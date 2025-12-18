'use client';

import { useEffect, useState } from 'react';
import { notificationService } from '@/services/notifications';
import { Subscription } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/features/notifications/context/NotificationContext';

export default function AlertManager() {
  /**
   * #OBSERVER
   * Frontend interface for managing keyword subscriptions.
   * Users "attach" themselves to keywords to receive notifications.
   */
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchSubscriptions();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const subData = await notificationService.getSubscriptions();
      setSubscriptions(subData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    try {
      await notificationService.addSubscription(keyword.trim());
      setKeyword('');
      fetchSubscriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add subscription');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteSubscription(id);
      fetchSubscriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscription');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
        <p className="text-gray-500">Get notified when items matching your keywords are posted.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Add New Alert</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-4">
            <input
              type="text"
              placeholder="e.g. iPhone, Calculus, Dorm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-grow border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 text-gray-900 bg-white"
              required
            />
            <Button type="submit">Add Keyword</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notifications yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <li key={notif.id} className={`py-4 flex justify-between items-center ${notif.is_read ? 'opacity-50' : ''}`}>
                  <div>
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-400">{new Date(notif.created_at).toLocaleString()}</p>
                  </div>
                  {!notif.is_read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Active Subscriptions</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : subscriptions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active alerts. Add a keyword above!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {subscriptions.map((sub) => (
                <li key={sub.id} className="py-4 flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">&quot;{sub.keyword}&quot;</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(sub.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <h2 className="text-xl font-semibold text-blue-900">How it works (Observer Pattern)</h2>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 text-sm">
            When you add a keyword, you are registered as an <strong>Observer</strong> in the backend. 
            Whenever a new listing is created, the <strong>NotificationService</strong> (Subject) 
            checks all active subscriptions. If a match is found, it &quot;notifies&quot; the student.
            <br /><br />
            Check the backend terminal logs to see the Observer pattern in action when you create a listing that matches your keywords!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
