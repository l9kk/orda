'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/services/users';
import { User, Listing } from '@/types';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ phone: '', telegram: '' });

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
        setEditData({ 
          phone: userData.phone || '', 
          telegram: userData.telegram || '' 
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, authLoading]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const updatedUser = await userService.updateProfile(user.id, editData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Account Details</h2>
          <p className="text-sm text-muted-foreground">
            {isAuthenticated 
              ? "Authenticated: Sensitive info visible via Proxy Pattern." 
              : "Unauthenticated: Sensitive info hidden by Proxy Pattern."}
          </p>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Phone</label>
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 text-foreground bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Telegram</label>
                <input
                  type="text"
                  value={editData.telegram}
                  onChange={(e) => setEditData({ ...editData, telegram: e.target.value })}
                  className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 text-foreground bg-background"
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                <p className="mt-1 text-lg text-foreground">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Phone</label>
                <p className="mt-1 text-lg text-foreground">
                  {user?.phone || <span className="text-muted-foreground italic">Not set</span>}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Telegram</label>
                <p className="mt-1 text-lg text-foreground">
                  {user?.telegram || <span className="text-muted-foreground italic">Not set</span>}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground">Proxy Contact Info (How others see you)</label>
                <p className="mt-1 p-2 bg-muted/50 rounded border text-muted-foreground italic">
                  {user?.contact_info}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">My Listings</h2>
        {listings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">You haven&apos;t created any listings yet.</p>
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
