import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState, Skeleton } from '@/components/ui/AsyncState';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import type { PricingPlan } from '@/types/pricing';

function PlanCard({ plan, featured }: { plan: PricingPlan; featured: boolean }) {
    return (
        <Card
            raised={featured}
            className={cn('flex flex-col p-6', featured && 'border-brand/30')}
        >
            <h3 className="text-[17px] font-medium">{plan.name}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-muted">{plan.audience}</p>

            {plan.lines.length > 0 && (
                <dl className="mt-6 space-y-2.5 border-t border-border-subtle pt-5">
                    {plan.lines.map((line) => (
                        <div key={line.label} className="flex items-baseline justify-between gap-4">
                            <dt className="text-[13.5px] text-text-secondary">{line.label}</dt>
                            {/* Unset values read "Configurable" — never an invented rate. */}
                            <dd
                                className={cn(
                                    'text-right font-mono text-[13px]',
                                    line.value ? 'text-text-primary' : 'text-text-muted',
                                )}
                            >
                                {line.value ?? 'Configurable'}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            {plan.includes.length > 0 && (
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-border-subtle pt-5">
                    {plan.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-text-secondary">
                            <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-brand" />
                            {item}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-7">
                <ButtonLink
                    to={plan.cta.href}
                    variant={featured ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={() =>
                        plan.cta.href === '/contact-sales'
                            ? track('contact_sales_clicked', { plan: plan.key })
                            : track('signup_started', { plan: plan.key })
                    }
                >
                    {plan.cta.label}
                </ButtonLink>
            </div>
        </Card>
    );
}

export function PricingPreview() {
    const { data, loading, error, reload } = useApi(() => api.pricing(), []);

    useEffect(() => {
        if (data) track('pricing_viewed');
    }, [data]);

    // Plans that are not commercially available are not rendered at all.
    const plans = (data?.plans ?? []).filter((plan) => plan.available);

    return (
        <Section id="pricing" aria-labelledby="pricing-heading" tone="glow" bordered>
            <SectionHeading
                id="pricing-heading"
                align="center"
                title="Simple pricing that scales with payment volume"
                description="Your applicable rates are set in your commercial agreement — nothing here is a quote."
            />

            <div className="mt-12">
                {loading ? (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-[430px]" />
                        ))}
                    </div>
                ) : error ? (
                    <ErrorState message={error} onRetry={reload} />
                ) : (
                    <div
                        className={cn(
                            'grid gap-5 md:grid-cols-2',
                            plans.length >= 3 && 'lg:grid-cols-3',
                        )}
                    >
                        {plans.map((plan) => (
                            <PlanCard key={plan.key} plan={plan} featured={plan.key === 'orchestration'} />
                        ))}
                    </div>
                )}

                {data?.note && (
                    <p className="mx-auto mt-8 max-w-2xl text-center text-[13.5px] leading-relaxed text-text-muted">
                        {data.note}
                    </p>
                )}
            </div>
        </Section>
    );
}
