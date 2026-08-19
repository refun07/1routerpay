import { Section, SectionHeading } from '@/components/layout/Section';
import { Accordion } from '@/components/ui/Accordion';
import { ErrorState, Skeleton } from '@/components/ui/AsyncState';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { brand } from '@/lib/brand';

export function FAQ() {
    const { data, loading, error, reload } = useApi(() => api.faqs(), []);

    return (
        <Section id="faq" aria-labelledby="faq-heading" tone="raised" bordered>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
                <SectionHeading
                    id="faq-heading"
                    title="Questions, answered plainly"
                    description={`What ${brand.productName} does, what it does not do, and where responsibility sits.`}
                    className="lg:sticky lg:top-28 lg:self-start"
                />

                <div>
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton key={index} className="h-[68px]" />
                            ))}
                        </div>
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : (
                        <Accordion
                            items={(data ?? []).map((faq) => ({
                                title: faq.question,
                                content: faq.answer,
                            }))}
                        />
                    )}
                </div>
            </div>
        </Section>
    );
}
