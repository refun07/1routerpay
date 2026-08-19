import { Link } from 'react-router-dom';
import { ArrowRight, CircleSlash, Ruler, ScrollText, Timer } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { brand } from '@/lib/brand';
import { usePageMeta } from '@/app/usePageMeta';

/**
 * Methodology, published before the numbers exist.
 *
 * A leaderboard without a stated method is just a claim. This page is the
 * contract for what every figure on /rankings means.
 */
const METRICS = [
    {
        icon: Timer,
        name: 'Availability',
        formula: 'healthy probes ÷ total probes',
        definition:
            'A scheduled probe asks the provider whether it can accept a payment right now. Availability is the share of probes that came back healthy in the window.',
        notes: [
            'Probes run on a fixed schedule, so a quiet provider is measured as often as a busy one.',
            'A probe that times out counts as unhealthy.',
            'Availability is measured per connection, not per company — two merchants can see different numbers.',
        ],
    },
    {
        icon: Ruler,
        name: 'Success rate',
        formula: 'succeeded ÷ routed',
        definition:
            'Of the payments actually routed to this provider, the share that reached a confirmed successful state.',
        notes: [
            'Only confirmed outcomes count. A success is recorded from a verified server-to-server callback or a direct status query — never from a browser redirect.',
            'Customer-caused failures (cancelled, insufficient funds, wrong PIN) are counted as failures, because they are part of the real-world experience of that route.',
            'Shown blank until real payments have been routed. There is no starting value.',
        ],
    },
    {
        icon: CircleSlash,
        name: 'Unknown rate',
        formula: 'unknown ÷ routed',
        definition:
            'The share of payments that ended in an ambiguous state — the provider neither confirmed nor denied the outcome within the window.',
        notes: [
            'Unknown is deliberately not folded into the failure count. Treating it as failure would hide the exact risk it represents.',
            'A high unknown rate is an operational signal: those payments need reconciliation, and the customer may have been charged.',
            'These are resolved by querying the provider, never by assuming.',
        ],
    },
    {
        icon: Timer,
        name: 'Decision latency',
        formula: 'p50 / p95, milliseconds',
        definition:
            'Time spent inside the routing engine choosing a provider — from receiving the payment request to selecting a route.',
        notes: [
            'This measures our decision only. It excludes the provider’s own processing time and the customer’s time in the checkout flow.',
            'Reported as p50 and p95. Averages hide the tail that actually hurts.',
        ],
    },
];

const EXCLUSIONS = [
    'Commercial rates. Fees are contractual, differ per merchant, and are never part of a public ranking.',
    'Sandbox traffic. Test payments never enter the rollups.',
    'Payments that never reached a provider, such as those rejected by your own routing rules.',
    'Any period where our own monitoring was down — an outage on our side is not a provider’s failure.',
    'Estimated or interpolated values. A day we did not measure stays empty.',
];

export function BenchmarksPage() {
    usePageMeta(
        `Routing Benchmarks — ${brand.productName}`,
        'How provider availability, success, and routing latency are measured, and what is deliberately excluded.',
    );

    return (
        <>
            <PageHeader
                eyebrow="Benchmarks"
                title="How we measure a route"
                description="Published before the numbers, so you can judge the method rather than trust the leaderboard. If a figure cannot be measured honestly, it is left blank."
                actions={
                    <Link
                        to="/rankings"
                        className="group inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand"
                    >
                        See the rankings
                        <ArrowRight
                            aria-hidden="true"
                            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                    </Link>
                }
            />

            <PageContainer wide className="py-10 sm:py-14">
                <div className="grid gap-5 lg:grid-cols-2">
                    {METRICS.map(({ icon: Icon, name, formula, definition, notes }) => (
                        <Card key={name} className="flex flex-col p-6">
                            <div className="flex items-center gap-3">
                                <Icon aria-hidden="true" className="size-[18px] text-brand" />
                                <h2 className="text-[17px] font-medium">{name}</h2>
                            </div>

                            <code className="mt-3 inline-block w-fit rounded-md border border-border-subtle bg-surface-raised px-2 py-1 font-mono text-[12px] text-text-secondary">
                                {formula}
                            </code>

                            <p className="mt-4 text-[14.5px] leading-relaxed text-text-secondary">{definition}</p>

                            <ul className="mt-4 space-y-2.5 border-t border-border-subtle pt-4">
                                {notes.map((note) => (
                                    <li
                                        key={note}
                                        className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-muted"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-2 size-1 shrink-0 rounded-full bg-border-strong"
                                        />
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>

                <section aria-labelledby="exclusions-heading" className="mt-14">
                    <div className="flex items-center gap-3">
                        <CircleSlash aria-hidden="true" className="size-[18px] text-danger" />
                        <h2 id="exclusions-heading" className="text-[22px] font-medium tracking-[-0.01em]">
                            What we deliberately leave out
                        </h2>
                    </div>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {EXCLUSIONS.map((exclusion) => (
                            <li
                                key={exclusion}
                                className="rounded-[12px] border border-border-subtle bg-surface px-5 py-4 text-[14px] leading-relaxed text-text-secondary"
                            >
                                {exclusion}
                            </li>
                        ))}
                    </ul>
                </section>

                <section aria-labelledby="reading-heading" className="mt-14">
                    <div className="flex items-center gap-3">
                        <ScrollText aria-hidden="true" className="size-[18px] text-brand" />
                        <h2 id="reading-heading" className="text-[22px] font-medium tracking-[-0.01em]">
                            Reading the numbers fairly
                        </h2>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-3">
                        <Card className="p-5">
                            <h3 className="text-[15px] font-medium">These are your numbers</h3>
                            <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                                Measurements come from your own connections and your own traffic mix. Another
                                merchant on the same provider will see different figures, and both can be correct.
                            </p>
                        </Card>

                        <Card className="p-5">
                            <h3 className="text-[15px] font-medium">Volume changes confidence</h3>
                            <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                                A 100% success rate over eleven payments is not a track record. Always read the
                                routed column next to the rate.
                            </p>
                        </Card>

                        <Card className="p-5">
                            <h3 className="text-[15px] font-medium">A low rank is not a verdict</h3>
                            <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                                Providers get routed different payments. A route handling only high-value cards will
                                not look like one handling small wallet top-ups.
                            </p>
                        </Card>
                    </div>
                </section>

                <p className="mt-14 max-w-3xl border-l-2 border-brand/40 pl-5 text-[14px] leading-relaxed text-text-secondary">
                    If you find a figure on this platform you cannot reproduce from this methodology, treat it as a
                    bug and tell us at{' '}
                    <a href={`mailto:${brand.supportEmail}`} className="text-text-primary hover:text-brand">
                        {brand.supportEmail}
                    </a>
                    .
                </p>
            </PageContainer>
        </>
    );
}
