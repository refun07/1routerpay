import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState, Skeleton } from '@/components/ui/AsyncState';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { brand } from '@/lib/brand';
import { usePageMeta } from '@/app/usePageMeta';
import { CATEGORY_LABELS, CONNECTION_LABELS, PROVIDER_TYPE_LABELS } from '@/types/provider';
import { IntegrationStatusBadge, ProviderHealthLabel } from '@/components/providers/ProviderStatus';
import { ProviderMark } from '@/components/providers/ProviderMark';

export function ProviderDetailPage() {
    const { slug = '' } = useParams();
    const { data: provider, loading, error, reload } = useApi(() => api.provider(slug), [slug]);

    usePageMeta(
        provider ? `${provider.name} — ${brand.productName}` : `Provider — ${brand.productName}`,
        provider?.short_description,
    );

    if (loading) {
        return (
            <PageContainer wide className="py-16">
                <Skeleton className="h-[180px]" />
                <Skeleton className="mt-5 h-[320px]" />
            </PageContainer>
        );
    }

    if (error || !provider) {
        return (
            <PageContainer wide className="py-16">
                <ErrorState message={error ?? 'Provider not found.'} onRetry={reload} />
                <p className="mt-6 text-center">
                    <Link to="/providers" className="text-sm text-text-secondary hover:text-brand">
                        Back to all providers
                    </Link>
                </p>
            </PageContainer>
        );
    }

    const facts: [string, React.ReactNode][] = [
        ['Provider type', PROVIDER_TYPE_LABELS[provider.provider_type]],
        ['Registered name', provider.legal_name ?? '—'],
        [
            'Category',
            provider.methods_confirmed ? CATEGORY_LABELS[provider.category] : 'To be confirmed',
        ],
        [
            'Methods',
            provider.methods_confirmed && provider.methods.length > 0
                ? provider.methods.join(', ')
                : 'Confirmed during integration scoping',
        ],
        ['Currencies', provider.currencies.join(', ')],
        ['Connection', CONNECTION_LABELS[provider.connection_type]],
        ['Integration status', <IntegrationStatusBadge status={provider.integration_status} />],
        ['Health', <ProviderHealthLabel health={provider.health} />],
    ];

    return (
        <>
            <PageHeader
                eyebrow={PROVIDER_TYPE_LABELS[provider.provider_type]}
                title={provider.name}
                mark={<ProviderMark provider={provider} className="size-12" />}
                description={provider.short_description}
                actions={
                    <ButtonLink
                        to="/providers"
                        variant="ghost"
                        size="sm"
                        icon={<ArrowLeft aria-hidden="true" className="size-4" />}
                        iconPosition="left"
                    >
                        All providers
                    </ButtonLink>
                }
            />

            <PageContainer wide className="py-10 sm:py-14">
                <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                    <Card className="p-6">
                        <h2 className="text-[17px] font-medium">About this connection</h2>
                        <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-text-secondary">
                            {provider.description ?? provider.short_description}
                        </p>

                        <h3 className="mt-8 text-[15px] font-medium">Settlement</h3>
                        <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed text-text-secondary">
                            {provider.settlement_ownership}
                        </p>

                        {provider.use_cases.length > 0 && (
                            <>
                                <h3 className="mt-8 text-[15px] font-medium">What merchants use it for</h3>
                                <ul className="mt-3 space-y-2.5">
                                    {provider.use_cases.map((useCase) => (
                                        <li
                                            key={useCase}
                                            className="flex gap-2.5 text-[14px] leading-relaxed text-text-secondary"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="mt-2 size-1 shrink-0 rounded-full bg-brand"
                                            />
                                            {useCase}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <p className="mt-8 text-[13px] leading-relaxed text-text-muted">
                            Commercial rates for this provider are not published. They are governed by your agreement
                            with the provider or with us, depending on the connection model.
                        </p>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                                Connection facts
                            </p>
                        </div>

                        <dl className="divide-y divide-border-subtle">
                            {facts.map(([term, value]) => (
                                <div key={term} className="flex items-center justify-between gap-4 px-5 py-3.5">
                                    <dt className="text-[13.5px] text-text-muted">{term}</dt>
                                    <dd className="text-right font-mono text-[12.5px] text-text-secondary">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="border-t border-border-subtle p-5">
                            {provider.is_partner && (
                                <Badge tone="brand" className="mr-1.5">
                                    Partner
                                </Badge>
                            )}
                            <Badge tone="neutral">Requires an eligible merchant agreement</Badge>
                            <p className="mt-3 text-[12px] leading-relaxed text-text-muted">
                                Provider type describes how the company presents itself. Confirm current
                                licensing and regulatory status with Bangladesh Bank and the provider.
                            </p>
                            <ButtonLink to="/contact-sales" className="mt-4 w-full">
                                Ask about this connection
                            </ButtonLink>
                        </div>
                    </Card>
                </div>
            </PageContainer>
        </>
    );
}
