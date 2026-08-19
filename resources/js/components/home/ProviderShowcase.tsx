import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section, SectionHeading } from '@/components/layout/Section';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/AsyncState';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';

export function ProviderShowcase() {
    const { data, loading, error, reload } = useApi(() => api.providers(), []);
    const providers = (data ?? []).slice(0, 8);

    return (
        <Section id="providers" aria-labelledby="providers-heading" tone="raised" bordered>
            <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading
                    id="providers-heading"
                    eyebrow="Providers"
                    title="The providers your customers already use"
                    description="Wallets, cards, banks, and gateways — connected with your own credentials, behind one interface."
                />

                <Link
                    to="/providers"
                    className="group inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors duration-200 hover:text-brand"
                >
                    View all providers
                    <ArrowRight
                        aria-hidden="true"
                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                </Link>
            </div>

            <div className="mt-10">
                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-[268px]" />
                        ))}
                    </div>
                ) : error ? (
                    <ErrorState message={error} onRetry={reload} />
                ) : providers.length === 0 ? (
                    <EmptyState
                        title="No providers published yet"
                        description="Provider connections appear here once they are enabled."
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {providers.map((provider) => (
                            <ProviderCard key={provider.slug} provider={provider} />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}
