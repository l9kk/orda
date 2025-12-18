'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

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
