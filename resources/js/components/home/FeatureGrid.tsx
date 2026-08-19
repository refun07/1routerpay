import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { Section, SectionHeading } from '@/components/layout/Section';

function CardShell({
    title,
    copy,
    visual,
    cta,
}: {
    title: string;
    copy: string;
    visual: React.ReactNode;
    cta?: { label: string; to: string };
}) {
    return (
        <Card interactive className="flex flex-col overflow-hidden">
            <div className="border-b border-border-subtle bg-surface-raised/40 p-5">{visual}</div>

            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[19px] font-medium tracking-[-0.01em]">{title}</h3>
                <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-text-secondary">{copy}</p>

                {cta && (
                    <Link
                        to={cta.to}
                        className="group mt-5 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors duration-200 hover:text-brand"
                    >
                        {cta.label}
                        <ArrowRight
                            aria-hidden="true"
                            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                    </Link>
                )}
            </div>
        </Card>
    );
}

/** Card 1 — a request in, one normalized shape out, whichever provider ran it. */
function UnifiedApiVisual() {
    return (
        <div className="space-y-2.5 font-mono text-[11.5px]">
            <div className="flex items-center gap-2 text-text-muted">
                <span className="rounded border border-border-subtle bg-surface px-1.5 py-0.5 text-brand">POST</span>
                <span className="text-text-secondary">/v1/payments</span>
            </div>
            <div className="ml-3 border-l border-border-subtle pl-4 text-text-muted">
                <p>amount: 2500 · BDT</p>
                <p>payment_method: "mfs"</p>
                <p>routing: "smart"</p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
                {['provider_a', 'provider_b', 'provider_c'].map((provider) => (
                    <span
                        key={provider}
                        className="rounded border border-border-subtle bg-surface px-1.5 py-0.5 text-text-muted"
                    >
                        {provider}
                    </span>
                ))}
            </div>
        </div>
    );
}

/** Card 2 — health, and only health. No invented success percentages. */
function ResilienceVisual() {
    const rows: { label: string; state: string; tone: 'success' | 'warning' }[] = [
        { label: 'Primary provider', state: 'Healthy', tone: 'success' },
        { label: 'Backup provider', state: 'Healthy', tone: 'success' },
        { label: 'Provider C', state: 'Degraded', tone: 'warning' },
    ];

    return (
        <ul className="space-y-2.5 text-[12.5px]">
            {rows.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-4">
                    <span className="text-text-secondary">{row.label}</span>
                    <span className="inline-flex items-center gap-2 font-mono text-text-muted">
                        <StatusDot tone={row.tone} />
                        {row.state}
                    </span>
                </li>
            ))}
        </ul>
    );
}

/** Card 3 — the decision column carries the meaning; metrics stay unset. */
function RoutingScoreVisual() {
    const rows = [
        { provider: 'Provider A', health: 'Healthy', decision: 'Recommended', accent: true },
        { provider: 'Provider B', health: 'Healthy', decision: 'Available', accent: false },
        { provider: 'Provider C', health: 'Degraded', decision: 'Avoid', accent: false },
    ];

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[300px] font-mono text-[11.5px]">
                <thead>
                    <tr className="text-left text-text-muted">
                        <th scope="col" className="pb-2 font-normal">Provider</th>
                        <th scope="col" className="pb-2 font-normal">Health</th>
                        <th scope="col" className="pb-2 text-right font-normal">Decision</th>
                    </tr>
                </thead>
                <tbody className="text-text-secondary">
                    {rows.map((row) => (
                        <tr key={row.provider} className="border-t border-border-subtle">
                            <td className="py-1.5">{row.provider}</td>
                            <td className="py-1.5 text-text-muted">{row.health}</td>
                            <td className={`py-1.5 text-right ${row.accent ? 'text-brand' : 'text-text-muted'}`}>
                                {row.decision}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/** Card 4 — shape of the operations table, with clearly illustrative rows. */
function OperationsVisual() {
    const rows = [
        { id: 'pay_01J…9F', ref: 'ORDER-1048', state: 'Succeeded', tone: 'text-success' },
        { id: 'pay_01J…7C', ref: 'ORDER-1047', state: 'Pending', tone: 'text-warning' },
        { id: 'pay_01J…5A', ref: 'ORDER-1046', state: 'Refunded', tone: 'text-text-muted' },
    ];

    return (
        <ul className="space-y-2 font-mono text-[11.5px]">
            {rows.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 text-text-muted">
                    <span className="truncate">{row.id}</span>
                    <span className="hidden truncate text-text-secondary sm:inline">{row.ref}</span>
                    <span className={row.tone}>{row.state}</span>
                </li>
            ))}
        </ul>
    );
}

export function FeatureGrid() {
    return (
        <Section id="platform" aria-labelledby="platform-heading" bordered>
            <SectionHeading
                id="platform-heading"
                eyebrow="What you get"
                title="Integrate once. Swap providers whenever you need to."
                description="Your application talks to one API and stops caring which provider is behind it — which is what makes changing providers a config decision instead of a project."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2">
                <CardShell
                    title="One API for payments"
                    copy="Integrate once and normalize payment requests, responses, callbacks, and transaction states across supported providers."
                    visual={<UnifiedApiVisual />}
                    cta={{ label: 'View API', to: '/developers' }}
                />
                <CardShell
                    title="Built for payment resilience"
                    copy="Track provider health and use configurable routing and fallback policies to reduce dependency on a single integration."
                    visual={<ResilienceVisual />}
                    cta={{ label: 'See routing', to: '/routing' }}
                />
                <CardShell
                    title="Route with context"
                    copy="Choose providers using merchant-defined priorities such as availability, payment method, commercial rate, transaction value, and historical performance."
                    visual={<RoutingScoreVisual />}
                    cta={{ label: 'Routing rules', to: '/routing#rules' }}
                />
                <CardShell
                    title="One view of every transaction"
                    copy="Search payments, inspect provider responses, review settlements, identify reconciliation mismatches, and export normalized reports."
                    visual={<OperationsVisual />}
                />
            </div>
        </Section>
    );
}
