import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { StatusDot } from '@/components/ui/StatusDot';
import { PageContainer } from '@/components/layout/PageContainer';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { docs } from '@/lib/brand';
import { track } from '@/lib/analytics';
import { statusTone } from '@/lib/status';
import { STATUS_LABELS } from '@/types/status';
import { HeroConsole } from './HeroConsole';
import { HeroVisual } from './HeroVisual';

/**
 * The live badge reflects the status endpoint. If status cannot be read, the
 * badge is omitted entirely rather than claiming everything is fine.
 */
function LiveStatusBadge() {
    const { data, loading, error } = useApi(() => api.status(), []);

    if (loading || error || !data) return null;

    return (
        <Link
            to="/status"
            className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/70 px-3 py-1 text-xs text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary"
        >
            <StatusDot tone={statusTone(data.overall)} pulse={data.overall === 'operational'} />
            {STATUS_LABELS[data.overall]}
        </Link>
    );
}

export function Hero() {
    // Graphic first — most visitors are not reading cURL. Developers are one click away.
    const [showCode, setShowCode] = useState(false);

    return (
        <section className="relative isolate overflow-hidden pt-14 sm:pt-20 lg:pt-24">
            {/* Hero-only background grid, very low opacity. */}
            <div aria-hidden="true" className="bg-hero-grid pointer-events-none absolute inset-0 -z-10" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[-18rem] -z-10 h-[36rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand/[0.055] blur-[110px]"
            />

            <PageContainer wide>
                <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
                    {/* min-w-0: the console's long code lines must not widen the grid column. */}
                    <div className="min-w-0 max-w-xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted sm:text-xs">
                                Payment orchestration for Bangladesh
                            </p>
                            <LiveStatusBadge />
                        </div>

                        <h1 className="mt-6 text-balance text-[42px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[54px] lg:text-[68px]">
                            The unified layer
                            <br />
                            <span className="text-text-secondary">for every payment</span>
                        </h1>

                        <p className="mt-6 max-w-[54ch] text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
                            Connect every payment provider you use through one API — then route, monitor,
                            and reconcile them from one place. Keep your provider contracts. Lose the
                            per-provider plumbing.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <ButtonLink
                                to="/register"
                                size="lg"
                                onClick={() => track('hero_get_api_key_clicked')}
                            >
                                Get API Key
                            </ButtonLink>
                            <ButtonLink
                                to="/providers"
                                size="lg"
                                variant="secondary"
                                onClick={() => track('hero_explore_providers_clicked')}
                            >
                                Explore Providers
                            </ButtonLink>
                        </div>

                        <p className="mt-6">
                            {/* ButtonLink keeps internal targets on the client router. */}
                            <ButtonLink
                                to={docs.href}
                                variant="link"
                                onClick={() => track('docs_clicked', { from: 'hero' })}
                                className="group gap-1.5 text-sm text-text-secondary hover:text-brand"
                                icon={
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                    />
                                }
                            >
                                {docs.label}
                            </ButtonLink>
                        </p>
                    </div>

                    <div className="min-w-0 lg:pl-4">
                        {showCode ? <HeroConsole /> : <HeroVisual />}

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowCode((value) => !value)}
                                aria-pressed={showCode}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-3 py-1.5 font-mono text-[11px] text-text-muted transition-colors duration-200 hover:border-border-strong hover:text-text-secondary"
                            >
                                {showCode ? 'Show how it works' : 'Show the code'}
                            </button>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </section>
    );
}
