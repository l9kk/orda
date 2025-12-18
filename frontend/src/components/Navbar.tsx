'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useNotifications } from '@/features/notifications/context/NotificationContext';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { notifications, clearNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Orda
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="text-gray-900 hover:text-blue-600 text-sm font-medium"
              >
                Listings
              </Link>
              {isAuthenticated && (
                <Link
                  href="/create"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
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
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium relative p-2"
                  >
                    🔔
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Notifications</span>
                        <button 
                          onClick={clearNotifications}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            No new alerts
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                              <p className="text-sm text-gray-800">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(n.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/alerts"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Alerts
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
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
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
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
