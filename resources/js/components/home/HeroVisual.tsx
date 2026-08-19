import { Check, Smartphone, Wallet } from 'lucide-react';
import { StatusDot } from '@/components/ui/StatusDot';
import { ProviderMark } from '@/components/providers/ProviderMark';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';

/**
 * The product, explained as a picture.
 *
 * Built from real text nodes rather than one flat SVG so it scales with the
 * user's font size, reads correctly to a screen reader, and stays legible on a
 * phone. Only the connector lines are decorative.
 *
 * Everything shown is illustrative of the *interface*, not a live transaction —
 * the caption says so, and no figure here is presented as measured.
 */

const CHECKS = [
    'Success rate',
    'Gateway availability',
    'Merchant pricing',
    'Payment method',
    'Settlement requirements',
    'Transaction amount',
    'Routing rules',
];

/*
 | Real routes, shown as an interface illustration.
 |
 | Every named provider is shown healthy and eligible. Labelling a real company
 | "degraded" in a marketing graphic would be a false statement about their
 | service, so the outcome column only distinguishes which route won.
 */
const ROUTES = [
    { slug: 'sslcommerz', name: 'SSLCOMMERZ', state: 'Chosen', chosen: true },
    { slug: 'shurjopay', name: 'shurjoPay', state: 'Standby', chosen: false },
    { slug: 'eps', name: 'EPS', state: 'Standby', chosen: false },
] as const;

/** Vertical connector with a travelling pulse. Purely decorative. */
function Connector({ label }: { label: string }) {
    return (
        <div aria-hidden="true" className="relative flex h-10 items-center justify-center">
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border-strong" />
            <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-brand [animation:heroPulse_2.8s_ease-in-out_infinite] motion-reduce:hidden" />
            <span className="relative rounded-full border border-border-subtle bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted">
                {label}
            </span>
        </div>
    );
}

export function HeroVisual() {
    // Pulled from the directory so an installed logo shows up here automatically.
    const { data } = useApi(() => api.providers(), []);

    const logoFor = (slug: string) =>
        data?.find((provider) => provider.slug === slug)?.logo_path ?? null;

    return (
        <figure className="overflow-hidden rounded-[16px] border border-border-subtle bg-surface p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:p-6">
            {/* Step 1 — the payment coming in */}
            <div className="rounded-[12px] border border-border-subtle bg-surface-raised p-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-[12px] text-text-muted">
                        <Smartphone aria-hidden="true" className="size-3.5" />
                        Your customer pays
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">ORDER-1048</span>
                </div>

                <p className="mt-3 text-[30px] font-medium leading-none tracking-[-0.02em] sm:text-[34px]">
                    ৳5,000
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface px-2 py-0.5 font-mono text-[11px] text-text-secondary">
                        <Wallet aria-hidden="true" className="size-3" />
                        Mobile wallet
                    </span>
                    <span className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 font-mono text-[11px] text-text-secondary">
                        BDT
                    </span>
                </div>
            </div>

            <Connector label="one API call" />

            {/* Step 2 — the decision */}
            <div className="rounded-[12px] border border-brand/25 bg-brand/[0.05] p-4">
                <p className="text-[13px] font-medium">We choose the route</p>

                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {CHECKS.map((check) => (
                        <li
                            key={check}
                            className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/60 px-2 py-1.5 text-[11.5px] leading-tight text-text-secondary"
                        >
                            <Check aria-hidden="true" className="size-3 shrink-0 text-brand" />
                            {check}
                        </li>
                    ))}
                </ul>
            </div>

            <Connector label="best route wins" />

            {/* Step 3 — where it went */}
            <ul className="space-y-2">
                {ROUTES.map((route) => (
                    <li
                        key={route.slug}
                        className={cn(
                            'flex items-center justify-between gap-3 rounded-[10px] border px-3.5 py-2.5',
                            route.chosen
                                ? 'border-brand/40 bg-brand/[0.07]'
                                : 'border-border-subtle bg-surface-raised/50',
                        )}
                    >
                        <span className="flex min-w-0 items-center gap-2.5 text-[13px]">
                            <StatusDot tone="success" />
                            <ProviderMark
                                provider={{ slug: route.slug, name: route.name, logo_path: logoFor(route.slug) }}
                                className="size-6 rounded-md text-[9px]"
                            />
                            <span className="truncate">{route.name}</span>
                        </span>
                        <span
                            className={cn(
                                'font-mono text-[11px]',
                                route.chosen ? 'text-brand' : 'text-text-muted',
                            )}
                        >
                            {route.state}
                        </span>
                    </li>
                ))}
            </ul>

            <Connector label="confirmed with the provider" />

            {/* Step 4 — the outcome */}
            <div className="flex items-center justify-between gap-3 rounded-[12px] border border-success/25 bg-success/[0.06] px-4 py-3.5">
                <span className="flex items-center gap-2.5 text-[13.5px] font-medium">
                    <Check aria-hidden="true" className="size-4 text-success" />
                    Paid
                </span>
                <span className="text-right text-[12px] text-text-secondary">
                    Settles to your account
                </span>
            </div>

            <figcaption className="mt-5 text-[12px] leading-relaxed text-text-muted">
                An illustration of the routing interface, not a live transaction.
            </figcaption>
        </figure>
    );
}
