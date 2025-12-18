const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * #FACADE
 * Provides a simplified interface to the complex fetch API.
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token === '"null"' || token === 'null' || token === '"undefined"' || token === 'undefined') {
        token = null;
    } else if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || response.statusText);
    }

    return response.json();
}
