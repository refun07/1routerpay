import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { ProviderMark } from '@/components/providers/ProviderMark';
import { cn } from '@/lib/cn';
import { METHOD_LABELS, type MetricFigures, type RankedProviderByMethod } from '@/types/rankings';

type Measure = 'availability' | 'success_rate';

const MEASURES: { id: Measure; label: string; help: string }[] = [
    {
        id: 'success_rate',
        label: 'Success rate',
        help: 'Share of payments routed to this wallet through this operator that reached a confirmed success.',
    },
    {
        id: 'availability',
        label: 'Availability',
        help: 'Share of health probes for this wallet through this operator that came back healthy.',
    },
];

/**
 * Colour is a secondary cue only — every cell states its number, and an
 * unmeasured pairing is an em dash rather than a zero or a blank.
 */
function cellTone(value: number | null): string {
    if (value === null) return 'text-text-muted';
    if (value >= 97) return 'text-success';
    if (value >= 90) return 'text-text-primary';
    if (value >= 80) return 'text-warning';
    return 'text-danger';
}

function Cell({ figures, measure }: { figures: MetricFigures | undefined; measure: Measure }) {
    if (!figures) {
        return (
            <td className="px-4 py-3.5 text-right font-mono text-[13px] text-text-muted">
                <span title="Never measured for this pairing">—</span>
            </td>
        );
    }

    const value = figures[measure];

    return (
        <td className="px-4 py-3.5 text-right">
            <span className={cn('block font-mono text-[13px]', cellTone(value))}>
                {value === null ? '—' : `${value}%`}
            </span>
            {figures.payments_routed > 0 && (
                <span className="mt-0.5 block font-mono text-[10.5px] text-text-muted">
                    {figures.payments_routed.toLocaleString()} routed
                </span>
            )}
        </td>
    );
}

export function MethodMatrix({
    providers,
    methods,
    measure,
    onMeasureChange,
}: {
    providers: RankedProviderByMethod[];
    methods: string[];
    measure: Measure;
    onMeasureChange: (measure: Measure) => void;
}) {
    const active = MEASURES.find((option) => option.id === measure) ?? MEASURES[0];

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div role="radiogroup" aria-label="Measure shown in the matrix" className="flex gap-2">
                    {MEASURES.map((option) => {
                        const selected = option.id === measure;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => onMeasureChange(option.id)}
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
            </div>

            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-text-muted">{active.help}</p>

            <Card className="mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                        <caption className="sr-only">
                            {active.label} for each payment method through each payment system operator
                        </caption>

                        <thead>
                            <tr className="bg-surface-raised/40">
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-text-muted"
                                >
                                    Operator
                                </th>

                                {methods.map((method) => (
                                    <th
                                        key={method}
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-3 text-right font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-text-muted"
                                    >
                                        {METHOD_LABELS[method] ?? method}
                                    </th>
                                ))}

                                <th
                                    scope="col"
                                    className="whitespace-nowrap px-4 py-3 text-right font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-brand"
                                >
                                    All methods
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {providers.map((provider) => (
                                <tr
                                    key={provider.slug}
                                    className="border-t border-border-subtle transition-colors duration-200 hover:bg-surface-raised/40"
                                >
                                    <th scope="row" className="px-4 py-3.5 text-left font-normal">
                                        <div className="flex items-center gap-3">
                                            <ProviderMark
                                                provider={provider}
                                                className="size-8 rounded-lg text-[11px]"
                                            />
                                            <Link
                                                to={`/providers/${provider.slug}`}
                                                className="truncate text-[14px] transition-colors hover:text-brand"
                                            >
                                                {provider.name}
                                            </Link>
                                        </div>
                                    </th>

                                    {methods.map((method) => (
                                        <Cell
                                            key={method}
                                            figures={provider.methods[method]}
                                            measure={measure}
                                        />
                                    ))}

                                    <Cell figures={provider.totals} measure={measure} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="border-t border-border-subtle px-4 py-3 text-[12px] text-text-muted">
                    Read each row as one operator, each column as one wallet. An em dash means that pairing has
                    never been measured — not that it performed badly.
                </p>
            </Card>
        </>
    );
}
