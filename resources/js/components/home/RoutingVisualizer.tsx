import { useState } from 'react';
import { Check } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

type Mode = 'smart' | 'lowest_cost' | 'highest_availability' | 'merchant_priority' | 'manual';

type Decision = 'recommended' | 'standby' | 'excluded';

const MODES: { id: Mode; label: string; explanation: string }[] = [
    {
        id: 'smart',
        label: 'Smart',
        explanation: 'Weighs every signal — availability, method support, merchant priority, and commercial rules.',
    },
    {
        id: 'lowest_cost',
        label: 'Lowest Cost',
        explanation: 'Prefers the cheapest eligible route using your configured commercial rates.',
    },
    {
        id: 'highest_availability',
        label: 'Highest Availability',
        explanation: 'Prefers the healthiest connection, even when it is not the cheapest.',
    },
    {
        id: 'merchant_priority',
        label: 'Merchant Priority',
        explanation: 'Follows your explicit provider order and only deviates when a provider is unavailable.',
    },
    {
        id: 'manual',
        label: 'Manual',
        explanation: 'Your application names the provider on the request; routing does not override it.',
    },
];

const CHECKS: { label: string; detail: string }[] = [
    { label: 'Success rate', detail: 'Measured, per method' },
    { label: 'Gateway availability', detail: 'Provider reporting healthy' },
    { label: 'Merchant pricing', detail: 'Your configured rates' },
    { label: 'Payment method', detail: 'MFS accepted' },
    { label: 'Settlement requirements', detail: 'Matches your terms' },
    { label: 'Transaction amount', detail: '৳5,000 within limits' },
    { label: 'Routing rules', detail: 'Priority 1 matched' },
];

/**
 * Routing outcomes per mode. This is a demo of the *interface*, not of live
 * routing — the real decision is made by the backend routing engine.
 */
const OUTCOMES: Record<Mode, { provider: string; decision: Decision; health: 'operational' | 'degraded' }[]> = {
    smart: [
        { provider: 'Provider A', decision: 'recommended', health: 'operational' },
        { provider: 'Provider B', decision: 'standby', health: 'operational' },
        { provider: 'Provider C', decision: 'excluded', health: 'degraded' },
    ],
    lowest_cost: [
        { provider: 'Provider B', decision: 'recommended', health: 'operational' },
        { provider: 'Provider A', decision: 'standby', health: 'operational' },
        { provider: 'Provider C', decision: 'excluded', health: 'degraded' },
    ],
    highest_availability: [
        { provider: 'Provider A', decision: 'recommended', health: 'operational' },
        { provider: 'Provider B', decision: 'standby', health: 'operational' },
        { provider: 'Provider C', decision: 'excluded', health: 'degraded' },
    ],
    merchant_priority: [
        { provider: 'Provider B', decision: 'recommended', health: 'operational' },
        { provider: 'Provider C', decision: 'excluded', health: 'degraded' },
        { provider: 'Provider A', decision: 'standby', health: 'operational' },
    ],
    manual: [
        { provider: 'Provider A', decision: 'recommended', health: 'operational' },
        { provider: 'Provider B', decision: 'standby', health: 'operational' },
        { provider: 'Provider C', decision: 'standby', health: 'degraded' },
    ],
};

const DECISION_LABELS: Record<Decision, string> = {
    recommended: 'Recommended',
    standby: 'Standby',
    excluded: 'Excluded — degraded',
};

function ModeSelector({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
    return (
        <div role="radiogroup" aria-label="Routing mode" className="flex flex-wrap gap-2">
            {MODES.map((option) => {
                const selected = option.id === mode;

                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(option.id)}
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
    );
}

export function RoutingVisualizer() {
    const [mode, setMode] = useState<Mode>('smart');
    const active = MODES.find((option) => option.id === mode)!;

    const onChange = (next: Mode) => {
        setMode(next);
        track('routing_demo_changed', { mode: next });
    };

    return (
        <Section id="routing" aria-labelledby="routing-heading" tone="glow" bordered>
            <SectionHeading
                id="routing-heading"
                title="Send each payment down the right route"
                description="Define how providers are selected using health, method support, commercial rules, transaction context, and merchant preferences."
            />

            <div className="mt-8">
                <ModeSelector mode={mode} onChange={onChange} />
                <p className="mt-3 max-w-2xl text-sm text-text-muted">{active.explanation}</p>
            </div>

            <Card className="mt-8 overflow-hidden">
                <div className="grid divide-y divide-border-subtle lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                    {/* 1 — the request */}
                    <div className="p-6">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                            Incoming payment
                        </p>
                        <p className="mt-4 text-3xl font-medium tracking-[-0.02em]">৳5,000</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            <Badge mono>MFS</Badge>
                            <Badge mono>BDT</Badge>
                            <Badge mono>ORDER-1048</Badge>
                        </div>
                        <p className="mt-6 text-[13px] leading-relaxed text-text-muted">
                            The payment enters with a method, an amount, and your merchant context. Nothing has been
                            sent to a provider yet.
                        </p>
                    </div>

                    {/* 2 — the evaluation */}
                    <div className="bg-surface-raised/30 p-6">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                            Routing engine
                        </p>
                        <ul className="mt-4 space-y-2.5">
                            {CHECKS.map((check, index) => (
                                <li
                                    key={check.label}
                                    className="flex items-start gap-2.5 text-[13px]"
                                    style={{ transitionDelay: `${index * 40}ms` }}
                                >
                                    <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-brand" />
                                    <span>
                                        <span className="text-text-primary">{check.label}</span>
                                        <span className="ml-1.5 font-mono text-[11.5px] text-text-muted">
                                            {check.detail}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3 — the outcome */}
                    <div className="p-6">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                            Route selection
                        </p>
                        <ul aria-live="polite" className="mt-4 space-y-2">
                            {OUTCOMES[mode].map((outcome) => (
                                <li
                                    key={outcome.provider}
                                    className={cn(
                                        'flex items-center justify-between gap-3 rounded-[10px] border px-3 py-2.5 transition-colors duration-200',
                                        outcome.decision === 'recommended'
                                            ? 'border-brand/35 bg-brand/[0.07]'
                                            : 'border-border-subtle bg-surface',
                                    )}
                                >
                                    <span className="flex items-center gap-2 text-[13px]">
                                        <StatusDot tone={outcome.health === 'operational' ? 'success' : 'warning'} />
                                        {outcome.provider}
                                    </span>
                                    <span
                                        className={cn(
                                            'font-mono text-[11px]',
                                            outcome.decision === 'recommended' ? 'text-brand' : 'text-text-muted',
                                        )}
                                    >
                                        {DECISION_LABELS[outcome.decision]}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <p className="mt-5 text-[12px] leading-relaxed text-text-muted">
                            Illustrative interface. Live routing decisions are made server-side against your own rules
                            and observed provider health.
                        </p>
                    </div>
                </div>
            </Card>
        </Section>
    );
}
