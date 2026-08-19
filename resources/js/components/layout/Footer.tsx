import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { brand } from '@/lib/brand';
import { STATUS_LABELS } from '@/types/status';
import { StatusDot } from '@/components/ui/StatusDot';
import { statusTone } from '@/lib/status';
import { Logo } from './Logo';
import { PageContainer } from './PageContainer';

/**
 * Columns come from `config/marketing.php`, with unpublished entries already
 * filtered out server-side. A column with nothing published does not render —
 * the site never links to a page that does not exist.
 */
const COLUMNS = Object.entries(brand.footerLinks).map(([title, links]) => ({
    title,
    links: Object.entries(links).map(([label, to]) => ({ label, to })),
}));

const LINK_CLASS = 'text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary';

/** Configured links may be absolute URLs, so external targets bypass the router. */
function FooterLink({ to, children }: { to: string; children: string }) {
    if (/^(https?:|mailto:)/.test(to)) {
        return (
            <a href={to} rel="noopener noreferrer" target="_blank" className={LINK_CLASS}>
                {children}
            </a>
        );
    }

    return (
        <Link to={to} className={LINK_CLASS}>
            {children}
        </Link>
    );
}

/** Live platform state, read from the backend — never a hard-coded constant. */
function StatusLink() {
    const { data, loading, error } = useApi(() => api.status(), []);

    if (loading || error || !data) {
        return (
            <Link to="/status" className="text-sm text-text-muted transition-colors hover:text-text-primary">
                System status
            </Link>
        );
    }

    return (
        <Link
            to="/status"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
            <StatusDot tone={statusTone(data.overall)} />
            {STATUS_LABELS[data.overall]}
        </Link>
    );
}

export function Footer() {
    const social = Object.entries(brand.social);

    return (
        <footer className="border-t border-border-subtle bg-surface/40">
            <PageContainer wide>
                {/* Column count follows the config; the override applies at lg only. */}
                <div
                    className="grid gap-10 py-14 sm:grid-cols-2 lg:gap-8 lg:[grid-template-columns:1.4fr_repeat(var(--footer-cols),1fr)]"
                    style={{ '--footer-cols': COLUMNS.length } as React.CSSProperties}
                >
                    <div className="max-w-[260px]">
                        <Logo />
                        <p className="mt-3 text-sm leading-relaxed text-text-muted">{brand.tagline}</p>
                    </div>

                    {COLUMNS.map((column) => (
                        <div key={column.title}>
                            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
                                {column.title}
                            </h2>
                            <ul className="space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <FooterLink to={link.to}>{link.label}</FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 border-t border-border-subtle py-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-text-muted">
                        © {new Date().getFullYear()} {brand.productName}. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <StatusLink />
                        {/* Social links render only when a real account is configured. */}
                        {social.map(([key, href]) => (
                            <a
                                key={key}
                                href={href}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="text-sm capitalize text-text-muted transition-colors hover:text-text-primary"
                            >
                                {key}
                            </a>
                        ))}
                    </div>
                </div>
            </PageContainer>
        </footer>
    );
}
