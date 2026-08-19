import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * `brand` is read from the server-injected payload at module load, so each case
 * sets the payload first and then imports the component fresh.
 */
async function renderWith(payload: Record<string, unknown>) {
    vi.resetModules();
    window.__PAYROUTER__ = payload as never;

    const { Footer } = await import('@/components/layout/Footer');

    return render(
        <MemoryRouter>
            <Footer />
        </MemoryRouter>,
    );
}

beforeEach(() => {
    // The footer reads platform status; keep it failing so it renders its fallback.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
});

afterEach(() => {
    delete window.__PAYROUTER__;
    vi.unstubAllGlobals();
});

describe('Footer links', () => {
    it('renders only the links the server published', async () => {
        await renderWith({
            productName: 'PayRouter',
            footerLinks: {
                Product: { Providers: '/providers', Pricing: '/pricing' },
                Legal: { Privacy: 'https://example.com/privacy' },
            },
        });

        expect(screen.getByRole('link', { name: 'Providers' })).toHaveAttribute('href', '/providers');
        expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();

        // Nothing invents a Terms page just because the column exists.
        expect(screen.queryByRole('link', { name: 'Terms' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Careers' })).not.toBeInTheDocument();
    });

    it('opens absolute URLs outside the client router', async () => {
        await renderWith({
            productName: 'PayRouter',
            footerLinks: { Legal: { Privacy: 'https://example.com/privacy' } },
        });

        const privacy = screen.getByRole('link', { name: 'Privacy' });

        expect(privacy).toHaveAttribute('href', 'https://example.com/privacy');
        expect(privacy).toHaveAttribute('target', '_blank');
        expect(privacy).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('drops a column entirely when nothing in it is published', async () => {
        await renderWith({ productName: 'PayRouter', footerLinks: { Product: { Pricing: '/pricing' } } });

        expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Legal' })).not.toBeInTheDocument();
    });
});

describe('Navbar docs link', () => {
    async function renderNavbar(payload: Record<string, unknown>) {
        vi.resetModules();
        window.__PAYROUTER__ = payload as never;

        const { Navbar } = await import('@/components/layout/Navbar');
        const { AuthProvider } = await import('@/app/AuthProvider');

        return render(
            <MemoryRouter>
                <AuthProvider>
                    <Navbar />
                </AuthProvider>
            </MemoryRouter>,
        );
    }

    it('points at the built-in quickstart when no external docs are configured', async () => {
        await renderNavbar({ productName: '1PayRouter', links: { docs: null } });

        expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    });

    it('defers to an external documentation site when one is configured', async () => {
        await renderNavbar({ productName: '1PayRouter', links: { docs: 'https://docs.example.com' } });

        expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
            'href',
            'https://docs.example.com',
        );
    });
});
