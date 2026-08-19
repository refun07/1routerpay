/**
 * Thin fetch layer for the public API.
 *
 * No API secret is ever read, stored, or sent from the browser — these are
 * unauthenticated marketing endpoints only.
 */

export class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly errors: Record<string, string[]> = {},
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

type Envelope<T> = { data: T };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api/public${path}`, {
        headers: {
            Accept: 'application/json',
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
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

    return (payload as Envelope<T>).data;
}

/**
 * Short-lived in-flight/result cache.
 *
 * Platform status is rendered in two places on every page (hero badge, footer).
 * Without this they would issue two identical requests per navigation.
 */
const cache = new Map<string, { at: number; value: Promise<unknown> }>();
const CACHE_TTL = 30_000;

function cached<T>(key: string, factory: () => Promise<T>): Promise<T> {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_TTL) {
        return hit.value as Promise<T>;
    }

    const value = factory().catch((error) => {
        // Never cache a failure — the next caller should retry.
        cache.delete(key);
        throw error;
    });

    cache.set(key, { at: Date.now(), value });
    return value;
}

export const api = {
    providers: (params: Record<string, string> = {}) => {
        const query = new URLSearchParams(
            Object.entries(params).filter(([, value]) => value !== ''),
        ).toString();

        const path = `/providers${query ? `?${query}` : ''}`;

        // The unfiltered list is requested by several components on one page.
        return query === ''
            ? cached(path, () => request<import('@/types/provider').Provider[]>(path))
            : request<import('@/types/provider').Provider[]>(path);
    },

    provider: (slug: string) => request<import('@/types/provider').Provider>(`/providers/${slug}`),

    pricing: () => request<import('@/types/pricing').PricingResponse>('/pricing'),

    status: () =>
        cached('status', () => request<import('@/types/status').PlatformStatus>('/platform-status')),

    rankings: (windowDays: number, view: import('@/types/rankings').RankingsView = 'overall') =>
        request<import('@/types/rankings').Rankings>(`/rankings?window=${windowDays}&view=${view}`),

    faqs: () => cached('faqs', () => request<import('@/types/faq').Faq[]>('/faqs')),

    contactSales: (body: Record<string, unknown>) =>
        request<{ message: string }>('/contact-sales', {
            method: 'POST',
            body: JSON.stringify(body),
        }),
};
