import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Byog() {
    return (
        <Section id="byog" aria-labelledby="byog-heading" bordered>
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                <div className="max-w-xl">
                    <Badge tone="brand" mono>
                        BYOG
                    </Badge>

                    <h2
                        id="byog-heading"
                        className="mt-5 text-balance text-[30px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[38px]"
                    >
                        Already have payment provider accounts? Connect them.
                    </h2>

                    <p className="mt-4 text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
                        Keep your existing commercial relationships while using the platform as the orchestration,
                        observability, and reconciliation layer.
                    </p>

                    <p className="mt-4 text-[14px] leading-relaxed text-text-muted">
                        Not every provider permits third-party orchestration or credential sharing. Connections are
                        enabled only where they are contractually permitted.
                    </p>

                    <div className="mt-8">
                        <ButtonLink
                            to="/providers"
                            variant="secondary"
                            icon={<ArrowRight aria-hidden="true" className="size-4" />}
                        >
                            Check provider eligibility
                        </ButtonLink>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                            Connection ownership
                        </p>
                    </div>

                    <dl className="divide-y divide-border-subtle">
                        {[
                            ['Provider agreement', 'Stays with the merchant'],
                            ['Provider credentials', 'Merchant-owned, encrypted at rest'],
                            ['Settlement', 'Per the merchant’s provider agreement'],
                            ['Routing & observability', 'Handled by the platform'],
                            ['Reconciliation', 'Normalized across every connection'],
                        ].map(([term, value]) => (
                            <div key={term} className="flex items-center justify-between gap-4 px-5 py-3.5">
                                <dt className="text-[13.5px] text-text-muted">{term}</dt>
                                <dd className="text-right font-mono text-[12.5px] text-text-secondary">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </Card>
            </div>
        </Section>
    );
}
