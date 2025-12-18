'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/services/users';

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
    const [authState, setAuthState] = useState<{
        user: User | null;
        token: string | null;
        isLoading: boolean;
    }>({
        user: null,
        token: null,
        isLoading: true,
    });
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthState({
                token: storedToken,
                user: JSON.parse(storedUser),
                isLoading: false,
            });
        } else {
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        setAuthState({
            token: newToken,
            user: newUser,
            isLoading: false,
        });
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        router.push('/');
    };

    const logout = () => {
        setAuthState({
            token: null,
            user: null,
            isLoading: false,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ 
            user: authState.user, 
            token: authState.token, 
            login, 
            logout, 
            isAuthenticated: !!authState.token, 
            isLoading: authState.isLoading 
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
