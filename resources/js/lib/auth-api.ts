import { ApiError } from './api';

/**
 * Authenticated requests.
 *
 * The session is a same-origin cookie, so nothing here reads or stores a token
 * — there is no credential in JavaScript to steal. Laravel's CSRF cookie is
 * echoed back as a header on every write.
 */

function csrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const method = (init.method ?? 'GET').toUpperCase();

    const response = await fetch(path, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...(method !== 'GET' ? { 'X-XSRF-TOKEN': csrfToken() } : {}),
            ...init.headers,
        },
        ...init,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(
            payload?.message ?? 'Something went wrong. Please try again.',
            response.status,
            payload?.errors ?? {},
        );
    }

    return (payload as { data: T }).data;
}

export type Profile = {
    name: string;
    email: string;
    organization: { name: string; slug: string } | null;
};

export type ApiKeySummary = {
    id: number;
    label: string;
    environment: 'test' | 'live';
    prefix: string;
    created_at: string | null;
    last_used_at: string | null;
    revoked_at: string | null;
};

export const auth = {
    me: () => request<Profile | null>('/api/auth/me'),

    register: (body: Record<string, unknown>) =>
        request<Profile>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),

    login: (body: Record<string, unknown>) =>
        request<Profile>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

    logout: () => request<null>('/api/auth/logout', { method: 'POST' }),
};

export const apiKeys = {
    list: () => request<ApiKeySummary[]>('/api/dashboard/api-keys'),

    /** The only response that ever contains the plaintext secret. */
    create: (body: { label: string; environment: 'test' | 'live' }) =>
        request<ApiKeySummary & { plaintext: string }>('/api/dashboard/api-keys', {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    revoke: (id: number) =>
        request<ApiKeySummary>(`/api/dashboard/api-keys/${id}`, { method: 'DELETE' }),
};
