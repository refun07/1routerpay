import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '@/app/App';
import { AuthProvider } from '@/app/AuthProvider';
import type { Provider } from '@/types/provider';

const PROVIDERS: Provider[] = [
    {
        slug: 'provider-alpha',
        name: 'Provider Alpha',
        legal_name: 'Provider Alpha Limited',
        short_description: 'Wallet payments.',
        description: null,
        category: 'mfs',
        provider_type: 'mfs',
        logo_path: null,
        use_cases: ['Low-value, high-frequency payments'],
        website: null,
        methods: ['mfs'],
        methods_confirmed: true,
        is_partner: false,
        currencies: ['BDT'],
        connection_type: 'merchant_credentials',
        integration_status: 'merchant_connection_required',
        settlement_ownership: 'Merchant agreement.',
        health: 'unknown',
    },
    {
        slug: 'provider-beta',
        name: 'Provider Beta',
        legal_name: null,
        short_description: 'Card acceptance.',
        description: null,
        category: 'card',
        provider_type: 'pso',
        logo_path: null,
        use_cases: ['Higher-value transactions'],
        website: null,
        methods: ['card'],
        methods_confirmed: false,
        is_partner: true,
        currencies: ['BDT'],
        connection_type: 'partner',
        integration_status: 'private_beta',
        settlement_ownership: 'Acquirer agreement.',
        health: 'operational',
    },
];

const PRICING = {
    plans: [
        {
            key: 'orchestration',
            name: 'Orchestration',
            audience: 'For merchants using their own provider accounts',
            available: true,
            lines: [{ label: 'Monthly platform fee', value: null }],
            includes: ['One API'],
            cta: { label: 'Start Building', href: '/register' },
        },
        {
            key: 'payg',
            name: 'Pay as You Go',
            audience: 'Approved processing arrangement',
            available: false,
            lines: [],
            includes: [],
            cta: { label: 'Apply for Access', href: '/contact-sales' },
        },
    ],
    note: 'No hidden rates.',
};

/** Records every request so tests can assert on query parameters. */
let requests: string[] = [];
let contactResponse: { status: number; body: unknown } = { status: 201, body: { data: { message: 'Thanks.' } } };

function mockFetch() {
    return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        requests.push(url);

        const json = (body: unknown, status = 200) =>
            ({ ok: status < 400, status, json: async () => body }) as Response;

        if (url.includes('/providers?') || url.endsWith('/providers')) {
            const search = new URL(url, 'http://localhost').searchParams.get('search') ?? '';
            const filtered = PROVIDERS.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()),
            );
            return json({ data: filtered });
        }

        if (url.includes('/auth/me')) return json({ data: null });
        if (url.includes('/pricing')) return json({ data: PRICING });
        if (url.includes('/platform-status')) {
            return json({
                data: { overall: 'operational', components: [], incidents: [], checked_at: '2026-08-17T04:30:00Z' },
            });
        }
        if (url.includes('/faqs')) return json({ data: [{ question: 'What is it?', answer: 'Orchestration.' }] });
        if (url.includes('/contact-sales')) {
            void init;
            return json(contactResponse.body, contactResponse.status);
        }

        return json({ data: [] });
    });
}

function renderApp(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </MemoryRouter>,
    );
}

beforeEach(() => {
    requests = [];
    contactResponse = { status: 201, body: { data: { message: 'Thanks.' } } };
    vi.stubGlobal('fetch', mockFetch());
});

afterEach(() => vi.unstubAllGlobals());

describe('homepage', () => {
    it('renders the value proposition and both primary CTAs', async () => {
        renderApp('/');

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The unified layer');
        expect(screen.getAllByRole('link', { name: 'Get API Key' }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: 'Explore Providers' }).length).toBeGreaterThan(0);
    });

    it('routes the hero CTA to account creation', async () => {
        renderApp('/');

        await userEvent.click(screen.getAllByRole('link', { name: 'Get API Key' })[0]);

        expect(await screen.findByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
    });

    it('puts a skip link ahead of the navigation', async () => {
        renderApp('/');

        await userEvent.tab();

        expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus();
        expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
    });
});

describe('provider directory', () => {
    it('lists providers and narrows them by search', async () => {
        renderApp('/providers');

        expect(await screen.findByRole('link', { name: 'Provider Alpha' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Provider Beta' })).toBeInTheDocument();

        await userEvent.type(screen.getByLabelText('Search providers'), 'Beta');

        await waitFor(() =>
            expect(screen.queryByRole('link', { name: 'Provider Alpha' })).not.toBeInTheDocument(),
        );
        expect(screen.getByRole('link', { name: 'Provider Beta' })).toBeInTheDocument();
        expect(requests.some((url) => url.includes('search=Beta'))).toBe(true);
    });

    it('sends the selected filter to the API', async () => {
        renderApp('/providers');
        await screen.findByRole('link', { name: 'Provider Alpha' });

        await userEvent.selectOptions(screen.getByLabelText('Payment method'), 'card');

        await waitFor(() => expect(requests.some((url) => url.includes('category=card'))).toBe(true));
    });

    it('offers a way out when a search matches nothing', async () => {
        renderApp('/providers');
        await screen.findByRole('link', { name: 'Provider Alpha' });

        await userEvent.type(screen.getByLabelText('Search providers'), 'zzzz');

        expect(await screen.findByText('No providers match these filters')).toBeInTheDocument();
    });
});

describe('pricing', () => {
    it('renders available plans and hides unavailable ones', async () => {
        renderApp('/pricing');

        expect(await screen.findByRole('heading', { name: 'Orchestration' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Pay as You Go' })).not.toBeInTheDocument();
    });

    it('shows unset amounts as configurable rather than inventing a rate', async () => {
        renderApp('/pricing');

        await screen.findByRole('heading', { name: 'Orchestration' });
        expect(screen.getByText('Configurable')).toBeInTheDocument();
    });
});

describe('contact sales', () => {
    it('surfaces server-side validation errors on the right fields', async () => {
        contactResponse = {
            status: 422,
            body: {
                message: 'Invalid.',
                errors: { work_email: ['The work email field must be a valid email address.'] },
            },
        };

        renderApp('/contact-sales');

        await userEvent.type(await screen.findByLabelText('Your name'), 'Ayesha');
        await userEvent.type(screen.getByLabelText('Work email'), 'not-an-email');
        await userEvent.type(screen.getByLabelText('Company'), 'Example');
        await userEvent.click(screen.getByLabelText(/may store these details/));
        await userEvent.click(screen.getByRole('button', { name: 'Send message' }));

        const message = await screen.findByText('The work email field must be a valid email address.');
        expect(message).toBeInTheDocument();
        expect(screen.getByLabelText('Work email')).toHaveAttribute('aria-invalid', 'true');
    });

    it('confirms a successful submission', async () => {
        renderApp('/contact-sales');

        await userEvent.type(await screen.findByLabelText('Your name'), 'Ayesha');
        await userEvent.type(screen.getByLabelText('Work email'), 'ayesha@example.com');
        await userEvent.type(screen.getByLabelText('Company'), 'Example');
        await userEvent.click(screen.getByLabelText(/may store these details/));
        await userEvent.click(screen.getByRole('button', { name: 'Send message' }));

        expect(await screen.findByText('Message sent')).toBeInTheDocument();
    });
});

describe('unknown routes', () => {
    it('render the in-app 404 instead of a blank page', async () => {
        renderApp('/not-a-real-page');

        expect(await screen.findByRole('heading', { name: 'This route does not exist' })).toBeInTheDocument();
    });
});
