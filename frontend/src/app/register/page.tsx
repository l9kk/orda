'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/users';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await userService.register(formData);
            router.push('/login?registered=true');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
                            required
                            minLength={6}
                            maxLength={16}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isLoading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
