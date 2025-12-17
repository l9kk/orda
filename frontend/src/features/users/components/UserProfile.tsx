'use client';

import { useEffect, useState } from 'react';
import { User, userService } from '@/services/users';
import { Listing } from '@/services/listings';
import ListingCard from '@/features/listings/components/ListingCard';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const userId = 1; // Simulated user ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, userListings] = await Promise.all([
          userService.getProfile(userId, isAuthenticated),
          userService.getUserListings(userId),
        ]);
        setUser(userData);
        setListings(userListings);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Simulate Auth:</span>
          <button
            onClick={() => setIsAuthenticated(!isAuthenticated)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isAuthenticated ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isAuthenticated ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>
          <p className="text-sm text-gray-500">
            {isAuthenticated 
              ? "Authenticated: Sensitive info visible via Proxy Pattern." 
              : "Unauthenticated: Sensitive info hidden by Proxy Pattern."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Username</label>
              <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone</label>
              <p className="mt-1 text-lg text-gray-900">
                {user?.phone || <span className="text-gray-400 italic">Hidden</span>}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Telegram</label>
              <p className="mt-1 text-lg text-gray-900">
                {user?.telegram || <span className="text-gray-400 italic">Hidden</span>}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Listings</h2>
        {listings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">You haven't created any listings yet.</p>
              <Button className="mt-4" onClick={() => window.location.href = '/create'}>
                Create Your First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
