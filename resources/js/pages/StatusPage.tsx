import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusDot } from '@/components/ui/StatusDot';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/AsyncState';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { brand } from '@/lib/brand';
import { statusTone } from '@/lib/status';
import { formatTime } from '@/lib/format';
import { usePageMeta } from '@/app/usePageMeta';
import { STATUS_LABELS } from '@/types/status';

export function StatusPage() {
    usePageMeta(
        `System Status — ${brand.productName}`,
        'Current operational status for API, checkout, dashboard, webhooks, and provider routing.',
    );

    const { data, loading, error, reload } = useApi(() => api.status(), []);

    return (
        <>
            <PageHeader
                eyebrow="Status"
                title="System status"
                description="Component health is reported by the platform itself. Nothing on this page is a static claim."
            />

            <PageContainer wide className="py-10 sm:py-14">
                {loading ? (
                    <>
                        <Skeleton className="h-[92px]" />
                        <Skeleton className="mt-5 h-[320px]" />
                    </>
                ) : error || !data ? (
                    <ErrorState message={error ?? 'Status is unavailable right now.'} onRetry={reload} />
                ) : (
                    <>
                        <Card raised className="flex flex-wrap items-center justify-between gap-4 p-6">
                            <div className="flex items-center gap-3">
                                <StatusDot
                                    tone={statusTone(data.overall)}
                                    pulse={data.overall === 'operational'}
                                    className="size-2.5"
                                />
                                <p className="text-[19px] font-medium">{STATUS_LABELS[data.overall]}</p>
                            </div>
                            <p className="font-mono text-[12px] text-text-muted">
                                Checked {formatTime(data.checked_at)}
                            </p>
                        </Card>

                        <Card className="mt-5 overflow-hidden">
                            <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                                <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                                    Components
                                </h2>
                            </div>

                            <ul className="divide-y divide-border-subtle">
                                {data.components.map((component) => (
                                    <li
                                        key={component.key}
                                        className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-[15px]">{component.name}</p>
                                            {component.description && (
                                                <p className="mt-0.5 text-[13px] text-text-muted">
                                                    {component.description}
                                                </p>
                                            )}
                                        </div>

                                        <span className="inline-flex items-center gap-2 font-mono text-[12.5px] text-text-secondary">
                                            <StatusDot tone={statusTone(component.status)} />
                                            {STATUS_LABELS[component.status]}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <section aria-labelledby="incidents-heading" className="mt-12">
                            <h2 id="incidents-heading" className="text-[19px] font-medium">
                                Incident history
                            </h2>

                            {data.incidents.length === 0 ? (
                                <EmptyState
                                    className="mt-5"
                                    title="No incidents recorded"
                                    description="Incidents appear here as soon as one is opened."
                                />
                            ) : (
                                <ol className="mt-5 space-y-4">
                                    {data.incidents.map((incident) => (
                                        <li key={`${incident.title}-${incident.started_at}`}>
                                            <Card className="p-5">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-[15px] font-medium">{incident.title}</h3>
                                                    <Badge
                                                        tone={incident.state === 'resolved' ? 'success' : 'warning'}
                                                        mono
                                                    >
                                                        {incident.state}
                                                    </Badge>
                                                </div>

                                                <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-text-secondary">
                                                    {incident.summary}
                                                </p>

                                                <p className="mt-3 font-mono text-[12px] text-text-muted">
                                                    {formatTime(incident.started_at)}
                                                    {incident.resolved_at
                                                        ? ` → ${formatTime(incident.resolved_at)}`
                                                        : ' → ongoing'}
                                                </p>
                                            </Card>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </section>
                    </>
                )}
            </PageContainer>
        </>
    );
}
