'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
    id: string;
    message: string;
    timestamp: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (message: string) => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // In a real app, we might use WebSockets or Polling here.
    // For this demo, we'll just provide a way to add them manually or via a mock.

    const addNotification = (message: string) => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
