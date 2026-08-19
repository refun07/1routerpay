/**
 * Brand configuration handed down from Laravel (`config/marketing.php`).
 *
 * The product name is a working name — read it from here, never hard-code it,
 * so the whole site can be renamed from one config file.
 */

export type HeroMetric = { value: string; label: string };

export type Brand = {
    productName: string;
    tagline: string;
    supportEmail: string;
    salesEmail: string;
    apiBaseUrl: string;
    links: { docs: string | null; status: string; sales: string };
    /** Column title → { label: href }. Unpublished entries are already removed. */
    footerLinks: Record<string, Record<string, string>>;
    social: Partial<Record<'github' | 'linkedin' | 'x', string>>;
    heroMetrics: HeroMetric[];
    /** How to render a provider with no approved logo yet. */
    providerMarkFallback: 'monogram' | 'none';
};

const fallback: Brand = {
    productName: '1PayRouter',
    tagline: 'The unified payment layer for Bangladesh',
    supportEmail: 'support@example.com',
    salesEmail: 'sales@example.com',
    apiBaseUrl: 'https://api.example.com',
    links: { docs: null, status: '/status', sales: '/contact-sales' },
    footerLinks: {},
    social: {},
    heroMetrics: [],
    providerMarkFallback: 'monogram',
};

declare global {
    interface Window {
        __PAYROUTER__?: Partial<Brand>;
    }
}

export const brand: Brand = {
    ...fallback,
    ...(typeof window !== 'undefined' ? window.__PAYROUTER__ ?? {} : {}),
};

/**
 * Where "Read the Docs" should go.
 *
 * Until a documentation site exists, the honest destination is the developer
 * reference on this site — and the label says so, rather than promising docs.
 */
export const docs = {
    /** An external DOCS_URL wins; otherwise the built-in quickstart. */
    href: brand.links.docs ?? '/docs',
    label: 'Read the Docs',
    external: Boolean(brand.links.docs),
};
