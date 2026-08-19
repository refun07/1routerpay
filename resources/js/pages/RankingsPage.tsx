import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/AsyncState';
import { ProviderMark } from '@/components/providers/ProviderMark';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { brand } from '@/lib/brand';
import { cn } from '@/lib/cn';
import { usePageMeta } from '@/app/usePageMeta';
import { MethodMatrix } from '@/components/rankings/MethodMatrix';
import { PROVIDER_TYPE_SHORT } from '@/types/provider';
import type {
    RankedProvider,
    RankedProviderByMethod,
    RankingsView,
} from '@/types/rankings';

const WINDOWS = [
    { days: 7, label: '7 days' },
    { days: 30, label: '30 days' },
    { days: 90, label: '90 days' },
];

const VIEWS: { id: RankingsView; label: string }[] = [
    { id: 'overall', label: 'Overall' },
    { id: 'by_method', label: 'By wallet' },
];

/** Unmeasured values render as an em dash — never as zero, never as an estimate. */
function Metric({ value, suffix = '' }: { value: number | null; suffix?: string }) {
    if (value === null) {
        return <span className="text-text-muted">—</span>;
    }

    return (
        <span className="text-text-primary">
            {value}
            {suffix}
        </span>
    );
}

function Bar({ value }: { value: number | null }) {
    if (value === null) return null;

    return (
        <span aria-hidden="true" className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-surface-soft">
            <span className="block h-full rounded-full bg-brand/70" style={{ width: `${Math.min(value, 100)}%` }} />
        </span>
    );
}

function RankingRow({ provider, rank }: { provider: RankedProvider; rank: number }) {
    return (
        <tr className="border-t border-border-subtle transition-colors duration-200 hover:bg-surface-raised/40">
            <td className="px-4 py-3.5">
                <span className="font-mono text-[12px] text-text-muted">
                    {String(rank).padStart(2, '0')}
                </span>
            </td>

            <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <ProviderMark provider={provider} className="size-8 rounded-lg text-[11px]" />
                    <div className="min-w-0">
                        <Link
                            to={`/providers/${provider.slug}`}
                            className="block truncate text-[14px] transition-colors hover:text-brand"
                        >
                            {provider.name}
                        </Link>
                        <span className="font-mono text-[11px] text-text-muted">
                            {PROVIDER_TYPE_SHORT[provider.provider_type]}
                        </span>
                    </div>
                </div>
            </td>

            <td className="px-4 py-3.5 text-right font-mono text-[13px]">
                <Metric value={provider.availability} suffix="%" />
                <Bar value={provider.availability} />
            </td>

            <td className="px-4 py-3.5 text-right font-mono text-[13px]">
                <Metric value={provider.success_rate} suffix="%" />
            </td>

            <td className="hidden px-4 py-3.5 text-right font-mono text-[13px] sm:table-cell">
                <Metric value={provider.unknown_rate} suffix="%" />
            </td>

            <td className="hidden px-4 py-3.5 text-right font-mono text-[13px] md:table-cell">
                <Metric value={provider.decision_latency_p50} suffix="ms" />
            </td>

            <td className="px-4 py-3.5 text-right font-mono text-[13px] text-text-secondary">
                {provider.payments_routed.toLocaleString()}
            </td>
        </tr>
    );
}

export function RankingsPage() {
    usePageMeta(
        `Provider Rankings — ${brand.productName}`,
        'Measured availability, routing latency, and volume for every connected payment provider.',
    );

    const [windowDays, setWindowDays] = useState(30);
    const [view, setView] = useState<RankingsView>('overall');
    const [measure, setMeasure] = useState<'availability' | 'success_rate'>('success_rate');

    const { data, loading, error, reload } = useApi(
        () => api.rankings(windowDays, view),
        [windowDays, view],
    );

    return (
        <>
            <PageHeader
                eyebrow="Rankings"
                title="Which routes actually perform"
                description="Every figure here is measured from real traffic and real health probes on your own connections. Nothing is estimated, and a metric we have not observed is left blank rather than filled in."
            />

            <PageContainer wide className="py-10 sm:py-12">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div role="radiogroup" aria-label="Measurement window" className="flex gap-2">
                        {WINDOWS.map((option) => {
                            const selected = option.days === windowDays;

                            return (
                                <button
                                    key={option.days}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => setWindowDays(option.days)}
                                    className={cn(
                                        'rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors duration-200',
                                        selected
                                            ? 'border-brand/40 bg-brand/10 text-brand'
                                            : 'border-border-subtle bg-surface text-text-muted hover:border-border-strong hover:text-text-secondary',
                                    )}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>

                    <div role="radiogroup" aria-label="Ranking view" className="flex gap-2">
                        {VIEWS.map((option) => {
                            const selected = option.id === view;

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => setView(option.id)}
                                    className={cn(
                                        'rounded-lg border px-3 py-1.5 text-xs transition-colors duration-200',
                                        selected
                                            ? 'border-border-strong bg-surface-raised text-text-primary'
                                            : 'border-border-subtle bg-surface text-text-muted hover:border-border-strong hover:text-text-secondary',
                                    )}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>

                    <Link
                        to="/benchmarks"
                        className="group inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand"
                    >
                        How these are measured
                        <ArrowRight
                            aria-hidden="true"
                            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>

                {/* Demo mode is stated loudly and permanently, never as a dismissible toast. */}
                {data?.mode === 'demo' && (
                    <div
                        role="note"
                        className="mt-6 flex items-start gap-3 rounded-[12px] border border-warning/30 bg-warning/[0.07] px-4 py-3.5"
                    >
                        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
                        <p className="text-[13.5px] leading-relaxed text-text-secondary">
                            <span className="font-medium text-warning">Demo data.</span> {data.note}
                        </p>
                    </div>
                )}

                <div className="mt-6">
                    {loading ? (
                        <Skeleton className="h-[420px]" />
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : data?.mode === 'empty' ? (
                        <EmptyState
                            title="Nothing measured yet"
                            description={data.note ?? undefined}
                            action={
                                <Link
                                    to="/benchmarks"
                                    className="text-sm text-text-secondary underline-offset-4 hover:text-brand hover:underline"
                                >
                                    Read the measurement methodology
                                </Link>
                            }
                        />
                    ) : data?.view === 'by_method' ? (
                        <MethodMatrix
                            providers={data.providers as RankedProviderByMethod[]}
                            methods={data.methods}
                            measure={measure}
                            onMeasureChange={setMeasure}
                        />
                    ) : (
                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left">
                                    <caption className="sr-only">
                                        Payment providers ranked by measured availability over the last{' '}
                                        {data?.window_days} days
                                    </caption>
                                    <thead>
                                        <tr className="bg-surface-raised/40">
                                            {[
                                                { label: '#', align: 'left', show: '' },
                                                { label: 'Provider', align: 'left', show: '' },
                                                { label: 'Availability', align: 'right', show: '' },
                                                { label: 'Success', align: 'right', show: '' },
                                                { label: 'Unknown', align: 'right', show: 'hidden sm:table-cell' },
                                                { label: 'Decision p50', align: 'right', show: 'hidden md:table-cell' },
                                                { label: 'Routed', align: 'right', show: '' },
                                            ].map((column) => (
                                                <th
                                                    key={column.label}
                                                    scope="col"
                                                    className={cn(
                                                        'whitespace-nowrap px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-text-muted',
                                                        column.align === 'right' && 'text-right',
                                                        column.show,
                                                    )}
                                                >
                                                    {column.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {((data?.providers ?? []) as RankedProvider[]).map(
                                            (provider, index) => (
                                                <RankingRow
                                                    key={provider.slug}
                                                    provider={provider}
                                                    rank={index + 1}
                                                />
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-4 py-3">
                                <p className="text-[12px] text-text-muted">
                                    Ranked by measured availability, then by volume routed.
                                </p>
                                <Badge mono>
                                    {data?.measured_from ? `since ${data.measured_from}` : 'no measurement window'}
                                </Badge>
                            </div>
                        </Card>
                    )}
                </div>

                <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-text-muted">
                    A provider ranking low here is not a judgement of that provider — it reflects what your
                    connections did, on your traffic, in this window. Commercial rates are never part of the
                    ranking and are never shown publicly.
                </p>
            </PageContainer>
        </>
    );
}
