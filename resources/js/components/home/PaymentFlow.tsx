import { Banknote, Building2, Route, Smartphone, Store } from 'lucide-react';
import { Section } from '@/components/layout/Section';

/**
 * The product explained in plain language, before any of the technical
 * sections. If a visitor reads only this, they should still understand what the
 * platform does and where it sits.
 */
const STEPS = [
    {
        icon: Smartphone,
        title: 'Your customer taps pay',
        copy: 'They pick a wallet, a card, or their bank — whatever they already use.',
    },
    {
        icon: Store,
        title: 'Your checkout makes one call',
        copy: 'The same request every time, whichever provider ends up handling it.',
    },
    {
        icon: Route,
        title: 'We pick a route that works',
        copy: 'Healthy providers first, following the rules you set.',
    },
    {
        icon: Building2,
        title: 'The provider takes the payment',
        copy: 'We confirm the result with them directly — never from the browser.',
    },
    {
        icon: Banknote,
        title: 'Money settles to you',
        copy: 'Under your agreement with that provider, with every fee accounted for.',
    },
];

export function PaymentFlow() {
    return (
        <Section id="how-money-moves" aria-labelledby="how-money-moves-heading" tone="raised" bordered>
            <div className="max-w-2xl">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
                    In plain language
                </p>
                <h2
                    id="how-money-moves-heading"
                    className="text-balance text-[30px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[38px] lg:text-[42px]"
                >
                    How the money actually moves
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
                    You keep your provider relationships. We sit in the middle and handle the messy part —
                    choosing a route, speaking each provider's language, and telling you what really happened.
                </p>
            </div>

            <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
                {/* Connector rests behind the icons on wide screens only. */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent lg:block"
                />

                {STEPS.map(({ icon: Icon, title, copy }, index) => (
                    <li key={title} className="relative">
                        <div className="flex size-12 items-center justify-center rounded-full border border-border-subtle bg-surface-raised">
                            <Icon aria-hidden="true" className="size-5 text-brand" />
                        </div>

                        <p className="mt-5 font-mono text-[11px] text-text-muted">
                            {String(index + 1).padStart(2, '0')}
                        </p>
                        <h3 className="mt-1.5 text-[16px] font-medium leading-snug">{title}</h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{copy}</p>
                    </li>
                ))}
            </ol>

            <p className="mt-14 max-w-3xl border-l-2 border-brand/40 pl-5 text-[15px] leading-relaxed text-text-secondary sm:text-[16px]">
                And if a provider is having a bad day, we route around it for the next payment — but we will
                never quietly re-charge a customer who may already have paid. That call is always made from
                what the provider confirms, not from what the browser says.
            </p>
        </Section>
    );
}
