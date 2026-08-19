import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Navbar } from '@/components/layout/Navbar';
import { AuthProvider } from '@/app/AuthProvider';

beforeEach(() => {
    // The navbar asks who is signed in; these cases are all signed out.
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ data: null }) }),
    );
});

function renderNavbar() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <Navbar />
            </AuthProvider>
        </MemoryRouter>,
    );
}

describe('Navbar mobile drawer', () => {
    it('is closed initially and announced as collapsed', () => {
        renderNavbar();

        expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
        expect(document.getElementById('mobile-navigation')).toBeNull();
    });

    it('opens on click and links the toggle to the drawer', async () => {
        renderNavbar();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

        const toggle = screen.getByRole('button', { name: 'Close menu' });
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(toggle.getAttribute('aria-controls')).toBe('mobile-navigation');
        expect(document.getElementById('mobile-navigation')).toBeInTheDocument();
    });

    it('closes on Escape and returns focus to the toggle', async () => {
        renderNavbar();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        await userEvent.keyboard('{Escape}');

        const toggle = screen.getByRole('button', { name: 'Open menu' });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(toggle).toHaveFocus();
    });
});
