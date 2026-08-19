import { PageHeader } from '@/components/layout/PageHeader';
import { PricingPreview } from '@/components/home/PricingPreview';
import { FAQ } from '@/components/home/FAQ';
import { FinalCTA } from '@/components/home/FinalCTA';
import { brand } from '@/lib/brand';
import { usePageMeta } from '@/app/usePageMeta';

export function PricingPage() {
    usePageMeta(
        `Pricing — ${brand.productName}`,
        'Pricing for payment orchestration: bring your own provider accounts, or talk to sales about enterprise routing, SLA, and volume pricing.',
    );

    return (
        <>
            <PageHeader
                eyebrow="Pricing"
                title="Simple pricing that scales with payment volume"
                description="Platform pricing is configured per agreement. Provider fees, taxes, and settlement terms are set by the providers you connect."
            />
            <PricingPreview />
            <FAQ />
            <FinalCTA />
        </>
    );
}
