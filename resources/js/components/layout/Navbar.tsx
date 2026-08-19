import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { docs } from '@/lib/brand';
import { cn } from '@/lib/cn';
import { track } from '@/lib/analytics';
import { useAuth } from '@/app/AuthProvider';
import { Logo } from './Logo';
import { PageContainer } from './PageContainer';

/** "Docs" appears only once a documentation site is configured. */
const NAV_ITEMS = [
    { label: 'Providers', to: '/providers' },
    { label: 'Routing', to: '/routing' },
    { label: 'Rankings', to: '/rankings' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Developers', to: '/developers' },
    { label: 'Docs', to: docs.href },
    { label: 'Status', to: '/status' },
];

export function Navbar() {
    const { user, signOut } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const drawerRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close the drawer whenever the route changes.
    useEffect(() => setOpen(false), [location.pathname]);

    // Trap Escape and move focus into the drawer when it opens.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                toggleRef.current?.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        drawerRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [open]);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            'text-sm transition-colors duration-200',
            isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
        );

    return (
        <header
            className={cn(
                'sticky top-0 z-50 border-b transition-colors duration-200',
                scrolled
                    ? 'border-border-subtle bg-background/80 backdrop-blur-md'
                    : 'border-transparent bg-transparent',
            )}
        >
            <PageContainer wide>
                <nav className="flex h-16 items-center justify-between gap-6 lg:h-[68px]" aria-label="Main">
                    <div className="flex items-center gap-8">
                        <Logo />

                        <ul className="hidden items-center gap-6 lg:flex">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.label}>
                                    {item.label === 'Docs' && docs.external ? (
                                        <a
                                            href={item.to}
                                            className="text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary"
                                            onClick={() => track('docs_clicked', { from: 'navbar' })}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <NavLink to={item.to} className={linkClass}>
                                            {item.label}
                                        </NavLink>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="hidden items-center gap-2 lg:flex">
                        {user ? (
                            <>
                                <ButtonLink to="/dashboard" variant="ghost" size="sm">
                                    {user.organization?.name ?? 'Dashboard'}
                                </ButtonLink>
                                <Button variant="secondary" size="sm" onClick={() => void signOut()}>
                                    Sign out
                                </Button>
                            </>
                        ) : (
                            <>
                                <ButtonLink to="/login" variant="ghost" size="sm">
                                    Sign In
                                </ButtonLink>
                                <ButtonLink
                                    to="/register"
                                    size="sm"
                                    onClick={() => track('hero_get_api_key_clicked', { from: 'navbar' })}
                                >
                                    Get API Key
                                </ButtonLink>
                            </>
                        )}
                    </div>

                    <Button
                        ref={toggleRef}
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-navigation"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen((value) => !value)}
                    >
                        {open ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </nav>
            </PageContainer>

            {open && (
                <div
                    id="mobile-navigation"
                    ref={drawerRef}
                    className="border-t border-border-subtle bg-background lg:hidden"
                >
                    <PageContainer>
                        <ul className="flex flex-col py-2">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.to}
                                        className="flex min-h-[44px] items-center text-[15px] text-text-secondary transition-colors duration-200 hover:text-text-primary"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-col gap-2 border-t border-border-subtle py-4">
                            {user ? (
                                <>
                                    <ButtonLink to="/dashboard" variant="secondary" size="lg">
                                        Dashboard
                                    </ButtonLink>
                                    <Button variant="ghost" size="lg" onClick={() => void signOut()}>
                                        Sign out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <ButtonLink to="/login" variant="secondary" size="lg">
                                        Sign In
                                    </ButtonLink>
                                    <ButtonLink to="/register" size="lg">
                                        Get API Key
                                    </ButtonLink>
                                </>
                            )}
                        </div>
                    </PageContainer>
                </div>
            )}
        </header>
    );
}
