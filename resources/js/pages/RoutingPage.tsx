import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { RoutingVisualizer } from '@/components/home/RoutingVisualizer';
import { RoutingRules } from '@/components/home/RoutingRules';
import { ReliabilityTimeline } from '@/components/home/ReliabilityTimeline';
import { FinalCTA } from '@/components/home/FinalCTA';
import { Card } from '@/components/ui/Card';
import { brand } from '@/lib/brand';
import { usePageMeta } from '@/app/usePageMeta';

const SIGNALS: { title: string; copy: string }[] = [
    {
        title: 'Provider availability',
        copy: 'Observed health per connection, not a static assumption about uptime.',
    },
    {
        title: 'Method support',
        copy: 'Only providers that can actually serve the requested method are eligible.',
    },
    {
        title: 'Merchant priority',
        copy: 'Your explicit provider order, honoured unless a provider is unavailable.',
    },
    {
        title: 'Commercial rules',
        copy: 'Your configured rates and thresholds — never a rate we assumed for you.',
    },
    {
        title: 'Transaction context',
        copy: 'Amount, currency, and reference data can steer the decision.',
    },
    {
        title: 'Risk policy',
        copy: 'Limits and controls applied before a provider is contacted.',
    },
];

export function RoutingPage() {
    usePageMeta(
        `Payment Routing — ${brand.productName}`,
        'Define how payment providers are selected using availability, method support, merchant priority, commercial rules, and transaction context.',
    );

    return (
        <>
            <PageHeader
                eyebrow="Routing"
                title="Route payments with context"
                description="Use provider availability, payment method support, merchant priorities, commercial rules, and transaction context to determine the preferred route."
            />

            <RoutingVisualizer />

            <PageContainer wide className="pb-4">
                <div id="rules" className="grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-start">
                    <RoutingRules />

                    <div className="grid gap-4 sm:grid-cols-2">
                        {SIGNALS.map((signal) => (
                            <Card key={signal.title} interactive className="p-5">
                                <h2 className="text-[15px] font-medium">{signal.title}</h2>
                                <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">
                                    {signal.copy}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </PageContainer>

            <ReliabilityTimeline />
            <FinalCTA />
        </>
    );
}
