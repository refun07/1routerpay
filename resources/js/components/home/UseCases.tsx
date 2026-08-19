import { Building2, GraduationCap, Layers, ShoppingCart, Ticket, Repeat } from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';

const CASES = [
    {
        icon: ShoppingCart,
        title: 'Ecommerce',
        copy: 'Improve payment resilience and simplify provider operations.',
    },
    {
        icon: Layers,
        title: 'Marketplaces',
        copy: 'Centralize transaction visibility across complex payment flows.',
    },
    {
        icon: Repeat,
        title: 'SaaS',
        copy: 'Keep recurring and one-time payment integrations modular.',
    },
    {
        icon: GraduationCap,
        title: 'Education',
        copy: 'Handle high-volume fee collection with stronger transaction visibility.',
    },
    {
        icon: Ticket,
        title: 'Ticketing',
        copy: 'Prepare for payment spikes and monitor provider health in real time.',
    },
    {
        icon: Building2,
        title: 'Enterprise',
        copy: 'Create custom routing rules, permissions, reporting, and controls.',
    },
];

export function UseCases() {
    return (
        <Section id="use-cases" aria-labelledby="use-cases-heading" tone="raised" bordered>
            <SectionHeading
                id="use-cases-heading"
                eyebrow="Who it's for"
                title="Built for teams who feel every failed payment"
                description="The same routing layer, doing a slightly different job depending on what you sell."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CASES.map(({ icon: Icon, title, copy }) => (
                    <Card key={title} interactive className="p-5">
                        <Icon aria-hidden="true" className="size-[18px] text-brand" />
                        <h3 className="mt-4 text-[16px] font-medium">{title}</h3>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">{copy}</p>
                    </Card>
                ))}
            </div>
        </Section>
    );
}
