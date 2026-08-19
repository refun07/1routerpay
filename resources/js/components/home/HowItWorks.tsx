import { Section, SectionHeading } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';

const STEPS: { title: string; copy: string; detail: React.ReactNode }[] = [
    {
        title: 'Create your account',
        copy: 'Set up your organization and merchant profile.',
        detail: (
            <span className="font-mono text-[11.5px] text-text-muted">
                organization → merchant → team roles
            </span>
        ),
    },
    {
        title: 'Connect providers',
        copy: 'Connect approved provider credentials or activate available partner connections.',
        detail: (
            <span className="font-mono text-[11.5px] text-text-muted">
                credentials encrypted at rest
            </span>
        ),
    },
    {
        title: 'Create an API key',
        copy: 'Use separate sandbox and production credentials.',
        detail: (
            <span className="font-mono text-[11.5px] text-text-muted">
                pr_test_… · pr_live_…
            </span>
        ),
    },
    {
        title: 'Route payments',
        copy: 'Send payments through one API and inspect every route from the dashboard.',
        detail: (
            <span className="font-mono text-[11.5px] text-text-muted">
                POST /v1/payments → route → checkout
            </span>
        ),
    },
];

export function HowItWorks() {
    return (
        <Section id="how-it-works" aria-labelledby="how-it-works-heading" tone="raised" bordered>
            <SectionHeading
                id="how-it-works-heading"
                title="Go live without rebuilding your checkout stack"
                description="Four steps from account to routed payment."
            />

            <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map((step, index) => (
                    <li key={step.title}>
                        <Card interactive className="flex h-full flex-col p-5">
                            <span
                                aria-hidden="true"
                                className="font-mono text-[28px] leading-none text-border-strong"
                            >
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <h3 className="mt-5 text-[16px] font-medium">{step.title}</h3>
                            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-text-secondary">
                                {step.copy}
                            </p>

                            <div className="mt-5 rounded-lg border border-border-subtle bg-surface-raised/50 px-3 py-2">
                                {step.detail}
                            </div>
                        </Card>
                    </li>
                ))}
            </ol>
        </Section>
    );
}
