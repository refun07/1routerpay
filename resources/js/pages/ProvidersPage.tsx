import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProviderCard } from '@/components/providers/ProviderCard';
import {
    EMPTY_FILTERS,
    ProviderFilters,
    type ProviderFilterState,
} from '@/components/providers/ProviderFilters';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/AsyncState';
import { useApi } from '@/hooks/useApi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { api } from '@/lib/api';
import { brand } from '@/lib/brand';
import { usePageMeta } from '@/app/usePageMeta';

export function ProvidersPage() {
    usePageMeta(
        `Payment Providers — ${brand.productName}`,
        'Browse the payment providers and methods available through the platform, with integration status for each connection.',
    );

    const [filters, setFilters] = useState<ProviderFilterState>(EMPTY_FILTERS);
    const search = useDebouncedValue(filters.search, 250);

    const query = useMemo(
        () => ({ ...filters, search }),
        [
            filters.type,
            filters.category,
            filters.status,
            filters.connection,
            filters.currency,
            filters.sort,
            search,
        ],
    );

    const { data, loading, error, reload } = useApi(() => api.providers(query), [query]);
    const providers = data ?? [];
    const hasFilters = Object.values(filters).some(Boolean);

    return (
        <>
            <PageHeader
                eyebrow="Directory"
                title="Payment Providers"
                description="Every connection the platform can route to, with its methods, currency, connection model, and current integration status."
            />

            <PageContainer wide className="py-10 sm:py-12">
                <ProviderFilters filters={filters} onChange={setFilters} />

                <div className="mt-6 flex items-center justify-between gap-4">
                    <p aria-live="polite" className="text-[13.5px] text-text-muted">
                        {loading
                            ? 'Loading providers…'
                            : `${providers.length} provider${providers.length === 1 ? '' : 's'}`}
                    </p>

                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                            Clear filters
                        </Button>
                    )}
                </div>

                <div className="mt-5">
                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <Skeleton key={index} className="h-[268px]" />
                            ))}
                        </div>
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : providers.length === 0 ? (
                        <EmptyState
                            title="No providers match these filters"
                            description="Try clearing a filter or searching for a payment method instead."
                            action={
                                hasFilters ? (
                                    <Button variant="secondary" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                                        Clear filters
                                    </Button>
                                ) : undefined
                            }
                        />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {providers.map((provider) => (
                                <ProviderCard key={provider.slug} provider={provider} />
                            ))}
                        </div>
                    )}
                </div>

                <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-text-muted">
                    Integration status reflects what is technically and contractually enabled today. Commercial rates
                    are not shown publicly — they are set out in your agreement.
                </p>
            </PageContainer>
        </>
    );
}
