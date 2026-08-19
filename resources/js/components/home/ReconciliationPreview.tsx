import { Section, SectionHeading } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

/**
 * Illustrative reconciliation rows.
 *
 * Fees are shown as em-dashes rather than numbers: commercial rates are
 * data-driven per merchant and are never hard-coded into the marketing site.
 */
const COLUMNS = [
    'Payment ID',
    'Merchant Ref',
    'Provider',
    'Gross',
    'Provider Fee',
    'Platform Fee',
    'Net Expected',
    'Payment',
    'Settlement',
    'Mismatch',
];

const ROWS: { cells: string[]; mismatch: 'none' | 'review' }[] = [
    {
        cells: ['pay_01J…9F', 'ORDER-1048', 'provider_a', '৳2,500', '—', '—', '—', 'Succeeded', 'Settled'],
        mismatch: 'none',
    },
    {
        cells: ['pay_01J…7C', 'ORDER-1047', 'provider_b', '৳1,200', '—', '—', '—', 'Succeeded', 'Expected'],
        mismatch: 'none',
    },
    {
        cells: ['pay_01J…5A', 'ORDER-1046', 'provider_a', '৳4,750', '—', '—', '—', 'Succeeded', 'Not received'],
        mismatch: 'review',
    },
    {
        cells: ['pay_01J…3B', 'ORDER-1045', 'provider_c', '৳900', '—', '—', '—', 'Refunded', 'Adjusted'],
        mismatch: 'none',
    },
];

export function ReconciliationPreview() {
    return (
        <Section id="reconciliation" aria-labelledby="reconciliation-heading" bordered>
            <SectionHeading
                id="reconciliation-heading"
                title="Payments in. Reports matched."
                description="Normalize provider transaction data and give operations teams a single place to compare payments, fees, refunds, and expected settlements."
            />

            <Card className="mt-12 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                        Reconciliation — 17 Aug
                    </p>
                    <Badge>Illustrative data</Badge>
                </div>

                {/* Tables scroll horizontally only where the columns genuinely need it. */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left">
                        <thead>
                            <tr className="border-b border-border-subtle">
                                {COLUMNS.map((column) => (
                                    <th
                                        key={column}
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-text-muted"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {ROWS.map((row) => (
                                <tr key={row.cells[0]} className="transition-colors duration-200 hover:bg-surface-raised/40">
                                    {row.cells.map((cell, index) => (
                                        <td
                                            key={index}
                                            className={`whitespace-nowrap px-4 py-3 font-mono text-[12.5px] ${
                                                index === 0 ? 'text-text-primary' : 'text-text-secondary'
                                            }`}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {row.mismatch === 'review' ? (
                                            <Badge tone="warning" mono>
                                                Review
                                            </Badge>
                                        ) : (
                                            <Badge tone="success" mono>
                                                Matched
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="border-t border-border-subtle px-5 py-3 text-[12px] text-text-muted">
                    Fee columns are populated from your configured commercial rates — never from assumed defaults.
                </p>
            </Card>
        </Section>
    );
}
