import { Hero } from '@/components/home/Hero';
import { MetricsStrip } from '@/components/home/MetricsStrip';
import { PaymentFlow } from '@/components/home/PaymentFlow';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { ProviderShowcase } from '@/components/home/ProviderShowcase';
import { RoutingVisualizer } from '@/components/home/RoutingVisualizer';
import { ReliabilityTimeline } from '@/components/home/ReliabilityTimeline';
import { DeveloperSection } from '@/components/home/DeveloperSection';
import { ReconciliationPreview } from '@/components/home/ReconciliationPreview';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Byog } from '@/components/home/Byog';
import { UseCases } from '@/components/home/UseCases';
import { PricingPreview } from '@/components/home/PricingPreview';
import { SecuritySection } from '@/components/home/SecuritySection';
import { FAQ } from '@/components/home/FAQ';
import { FinalCTA } from '@/components/home/FinalCTA';

export function HomePage() {
    return (
        <>
            <Hero />
            <MetricsStrip />
            {/* Plain-language explainer before any of the technical sections. */}
            <PaymentFlow />
            <FeatureGrid />
            <ProviderShowcase />
            <RoutingVisualizer />
            <ReliabilityTimeline />
            <DeveloperSection />
            <ReconciliationPreview />
            <HowItWorks />
            <Byog />
            <UseCases />
            <PricingPreview />
            <SecuritySection />
            <FAQ />
            <FinalCTA />
        </>
    );
}
