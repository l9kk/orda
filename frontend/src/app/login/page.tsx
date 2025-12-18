'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { userService } from '@/services/users';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await userService.login(email, password);
            login(response.access_token, response.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid email or password';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-card p-8 rounded-lg shadow-md border border-border">
                <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Login to Orda</h1>
                
                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 text-foreground bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 text-foreground bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                            required
                            minLength={6}
                            maxLength={16}
                        />
                    </div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        Login
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
