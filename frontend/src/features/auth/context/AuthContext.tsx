'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * #MEDIATOR / #SINGLETON
 * Acts as a central mediator for authentication state across the application.
 * Ensures a single source of truth for user session data.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken, removeToken] = useLocalStorage<string | null>('token', null);
    const [user, setUser, removeUser] = useLocalStorage<User | null>('user', null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Once the hook has initialized from localStorage, we are no longer loading
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        router.push('/');
    };

    const logout = () => {
        removeToken();
        removeUser();
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            isAuthenticated: !!token, 
            isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
