import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { track } from '@/lib/analytics';
import {
    CATEGORY_LABELS,
    CONNECTION_LABELS,
    PROVIDER_TYPE_LABELS,
    type Provider,
} from '@/types/provider';
import { IntegrationStatusBadge, ProviderHealthLabel } from './ProviderStatus';
import { ProviderMark } from './ProviderMark';

export function ProviderCard({ provider }: { provider: Provider }) {
    return (
        <Card interactive className="group relative flex flex-col p-5">
            <div className="flex items-start gap-3.5">
                <ProviderMark provider={provider} />

                <div className="min-w-0 flex-1">
                    {/* Names wrap rather than truncate — a clipped legal name is
                        useless for identifying which entity you are contracting with.
                        The type moved into the detail list below so it can never be
                        orphaned onto a line of its own beside a long name. */}
                    <h3 className="text-balance text-[15px] font-medium leading-snug">
                        <Link
                            to={`/providers/${provider.slug}`}
                            onClick={() => track('provider_viewed', { provider: provider.slug })}
                            className="after:absolute after:inset-0 after:content-['']"
                        >
                            {provider.name}
                        </Link>
                    </h3>

                    {/* Show the registered entity when it differs from the brand. */}
                    {provider.legal_name && provider.legal_name !== provider.name && (
                        <p className="mt-0.5 text-[12px] leading-snug text-text-muted">{provider.legal_name}</p>
                    )}

                    <p className="mt-1.5 line-clamp-3 text-[13.5px] leading-relaxed text-text-muted">
                        {provider.short_description}
                    </p>
                </div>
            </div>

            {/* What merchants actually use this connection for. */}
            {provider.use_cases.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                    {provider.use_cases.slice(0, 2).map((useCase) => (
                        <li key={useCase} className="flex gap-2 text-[12.5px] leading-relaxed text-text-secondary">
                            <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 rounded-full bg-brand/70" />
                            {useCase}
                        </li>
                    ))}
                </ul>
            )}

            <dl className="mt-5 space-y-2 border-t border-border-subtle pt-4 text-[12.5px]">
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-muted">Type</dt>
                    <dd className="truncate font-mono text-text-secondary">
                        {PROVIDER_TYPE_LABELS[provider.provider_type]}
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-muted">Methods</dt>
                    <dd className="truncate font-mono text-text-secondary">
                        {provider.methods_confirmed ? CATEGORY_LABELS[provider.category] : 'To be confirmed'}
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-muted">Currency</dt>
                    <dd className="font-mono text-text-secondary">{provider.currencies.join(', ')}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-muted">Connection</dt>
                    <dd className="truncate font-mono text-text-secondary">
                        {CONNECTION_LABELS[provider.connection_type]}
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-muted">Health</dt>
                    <dd>
                        <ProviderHealthLabel health={provider.health} />
                    </dd>
                </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-1.5">
                {provider.is_partner && <Badge tone="brand">Partner</Badge>}
                <IntegrationStatusBadge status={provider.integration_status} />
            </div>
        </Card>
    );
}
