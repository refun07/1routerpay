import { ShieldCheck } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { RoutingRules } from './RoutingRules';
import { cn } from '@/lib/cn';

const EVENTS: { time: string; label: string; emphasis?: boolean }[] = [
    { time: '10:42:02', label: 'Payment request created' },
    { time: '10:42:02', label: 'Provider health checked' },
    { time: '10:42:03', label: 'Route selected' },
    { time: '10:42:03', label: 'Checkout session created' },
    { time: '10:43:21', label: 'Provider callback received' },
    { time: '10:43:21', label: 'Signature verified', emphasis: true },
    { time: '10:43:22', label: 'Payment marked successful', emphasis: true },
];

export function ReliabilityTimeline() {
    return (
        <Section id="reliability" aria-labelledby="reliability-heading" bordered>
            <SectionHeading
                id="reliability-heading"
                eyebrow="When things go wrong"
                title="A provider going down should not become your outage"
                description="Payments fail in confusing ways — timeouts, silent retries, callbacks that never arrive. Every one of them gets normalized into a state you can act on, and a log you can read afterwards."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
                <Card className="overflow-hidden">
                    <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                            Payment event log
                        </p>
                    </div>

                    <ol className="p-5">
                        {EVENTS.map((event, index) => (
                            <li key={`${event.time}-${event.label}`} className="relative flex gap-4 pb-5 last:pb-0">
                                {index < EVENTS.length - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-[3px] top-3 h-full w-px bg-border-subtle"
                                    />
                                )}

                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'relative mt-1.5 size-[7px] shrink-0 rounded-full',
                                        event.emphasis ? 'bg-brand' : 'bg-border-strong',
                                    )}
                                />

                                <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                                    <time className="font-mono text-[12px] text-text-muted">{event.time}</time>
                                    <span
                                        className={cn(
                                            'text-[14px]',
                                            event.emphasis ? 'text-text-primary' : 'text-text-secondary',
                                        )}
                                    >
                                        {event.label}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <div className="flex items-start gap-3 border-t border-border-subtle bg-surface-raised/30 px-5 py-4">
                        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
                        <p className="text-[13px] leading-relaxed text-text-secondary">
                            Transaction state is never changed to success from an unauthenticated or unverified
                            callback. A browser redirect is not proof of payment.
                        </p>
                    </div>
                </Card>

                <div className="space-y-5">
                    <RoutingRules />

                    <Card className="p-5">
                        <h3 className="text-[15px] font-medium">Fallback is scoped deliberately</h3>
                        <ul className="mt-3 space-y-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                            <li className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-success" />
                                Safe before initiation — pick a different provider or regenerate the checkout session.
                            </li>
                            <li className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-warning" />
                                Ambiguous state — hold as <code className="font-mono text-[12.5px]">unknown</code> and
                                query the provider for the real outcome.
                            </li>
                            <li className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-danger" />
                                Already authorized or charged — never re-attempted. A customer is not charged twice.
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </Section>
    );
}
