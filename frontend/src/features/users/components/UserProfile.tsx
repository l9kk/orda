'use client';

import { useEffect, useState } from 'react';
import { User, userService } from '@/services/users';
import { Listing } from '@/services/listings';
import ListingCard from '@/features/listings/components/ListingCard';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function UserProfile() {
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      setError('Please login to view your profile');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, userListings] = await Promise.all([
          userService.getProfile(currentUser.id),
          userService.getUserListings(currentUser.id),
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
  }, [currentUser, authLoading]);

  if (loading || authLoading) {
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
