'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useNotifications } from '@/features/notifications/context/NotificationContext';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { notifications, unreadCount, clearNotifications, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Orda
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary text-sm font-medium"
              >
                Listings
              </Link>
              {isAuthenticated && (
                <Link
                  href="/create"
                  className="text-muted-foreground hover:text-muted-foreground text-sm font-medium"
                >
                  Create Listing
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-muted-foreground hover:text-muted-foreground text-sm font-medium relative p-2"
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-background rounded-md shadow-lg py-1 z-50 border border-border">
                      <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                        <span className="font-bold text-foreground">Notifications</span>
                        <button 
                          onClick={clearNotifications}
                          className="text-xs text-primary hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                            No new alerts
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`px-4 py-3 hover:bg-muted/50 border-b border-muted/50 last:border-0 cursor-pointer ${!n.is_read ? 'bg-accent/10' : ''}`}
                              onClick={() => markAsRead(n.id)}
                            >
                              <p className={`text-sm ${!n.is_read ? 'text-primary font-medium' : 'text-foreground'}`}>
                                {n.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(n.created_at).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-border text-center">
                        <Link 
                          href="/alerts" 
                          className="text-xs text-primary hover:underline"
                          onClick={() => setShowNotifications(false)}
                        >
                          View all alerts
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/alerts"
                  className="text-muted-foreground hover:text-muted-foreground text-sm font-medium"
                >
                  Alerts
                </Link>
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-muted-foreground text-sm font-medium"
                >
                  Profile ({user?.email})
                </Link>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-muted-foreground text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
