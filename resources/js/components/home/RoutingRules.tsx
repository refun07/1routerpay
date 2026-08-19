import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

type Clause = {
    keyword: string;
    tone: 'brand' | 'muted' | 'danger';
    chips: string[];
};

const CLAUSES: Clause[] = [
    { keyword: 'IF', tone: 'muted', chips: ['payment_method', '=', '"mfs"'] },
    { keyword: 'AND', tone: 'muted', chips: ['amount', '>=', '1000 BDT'] },
    { keyword: 'THEN', tone: 'brand', chips: ['prefer', 'Provider A'] },
    { keyword: 'FALLBACK', tone: 'brand', chips: ['Provider B'] },
    { keyword: 'EXCLUDE', tone: 'danger', chips: ['health', '=', 'degraded'] },
];

const KEYWORD_TONES = {
    brand: 'text-brand',
    muted: 'text-text-muted',
    danger: 'text-danger',
} as const;

/**
 * A rules engine, shown as one. Chips read like the dropdowns the dashboard
 * builder will use, so the public page and the product agree with each other.
 */
export function RoutingRules({ className }: { className?: string }) {
    return (
        <Card className={cn('overflow-hidden', className)}>
            <div className="flex items-center justify-between gap-4 border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                    Routing rule
                </p>
                <span className="font-mono text-[11px] text-text-muted">priority 1</span>
            </div>

            <div className="space-y-3 p-5">
                {CLAUSES.map((clause) => (
                    <div key={clause.keyword} className="flex flex-wrap items-center gap-2">
                        <span
                            className={cn(
                                'w-[88px] shrink-0 font-mono text-[11px] uppercase tracking-[0.1em]',
                                KEYWORD_TONES[clause.tone],
                            )}
                        >
                            {clause.keyword}
                        </span>

                        {clause.chips.map((chip, index) => (
                            <span
                                key={`${clause.keyword}-${index}`}
                                className={cn(
                                    'rounded-md border border-border-subtle bg-surface-raised px-2 py-1 font-mono text-[12px]',
                                    /^[=><]/.test(chip) ? 'text-text-muted' : 'text-text-secondary',
                                )}
                            >
                                {chip}
                            </span>
                        ))}
                    </div>
                ))}
            </div>

            <p className="border-t border-border-subtle px-5 py-3 text-[12px] text-text-muted">
                Rules are evaluated in order before a payment is initiated with any provider.
            </p>
        </Card>
    );
}
