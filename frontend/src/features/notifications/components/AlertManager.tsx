'use client';

import { useEffect, useState } from 'react';
import { Subscription, notificationService } from '@/services/notifications';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AlertManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = 1; // Simulated user ID

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getSubscriptions(userId);
      setSubscriptions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    try {
      await notificationService.addSubscription(userId, keyword.trim());
      setKeyword('');
      fetchSubscriptions();
    } catch (err: any) {
      setError(err.message || 'Failed to add subscription');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteSubscription(id);
      fetchSubscriptions();
    } catch (err: any) {
      setError(err.message || 'Failed to delete subscription');
    }
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
              className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            <Button type="submit">Add Keyword</Button>
          </form>
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
                  <span className="text-lg font-medium text-gray-900">"{sub.keyword}"</span>
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
            checks all active subscriptions. If a match is found, it "notifies" the student.
            <br /><br />
            Check the backend terminal logs to see the Observer pattern in action when you create a listing that matches your keywords!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
