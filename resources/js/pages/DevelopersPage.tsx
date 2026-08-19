import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { DeveloperSection } from '@/components/home/DeveloperSection';
import { SecuritySection } from '@/components/home/SecuritySection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { brand, docs } from '@/lib/brand';
import { usePageMeta } from '@/app/usePageMeta';

const STATES = [
    'created',
    'routing',
    'provider_session_created',
    'pending',
    'requires_action',
    'processing',
    'succeeded',
    'failed',
    'cancelled',
    'expired',
    'refunded',
    'partially_refunded',
    'unknown',
];

export function DevelopersPage() {
    usePageMeta(
        `Developers — ${brand.productName}`,
        'A consistent payment object across providers: predictable states, signed webhooks, idempotency keys, and clear routing visibility.',
    );

    return (
        <>
            <PageHeader
                eyebrow="Developers"
                title="Build once. Keep providers replaceable."
                description="Use a consistent payment object across providers so your application code does not depend on every provider's individual response format."
                actions={
                    <div className="flex gap-2">
                        <ButtonLink to={docs.href} variant="secondary" size="sm">
                            {docs.label}
                        </ButtonLink>
                        <ButtonLink to="/register" size="sm">
                            Get API Key
                        </ButtonLink>
                    </div>
                }
            />

            <DeveloperSection />

            <PageContainer wide className="pb-16">
                <div id="quickstart" className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
                    <Card className="overflow-hidden">
                        <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                                Payment states
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-2 p-5">
                            {STATES.map((state) => (
                                <span
                                    key={state}
                                    className={`rounded-md border px-2 py-1 font-mono text-[12px] ${
                                        state === 'unknown'
                                            ? 'border-warning/30 bg-warning/10 text-warning'
                                            : 'border-border-subtle bg-surface-raised text-text-secondary'
                                    }`}
                                >
                                    {state}
                                </span>
                            ))}
                        </div>
                        <p className="border-t border-border-subtle px-5 py-4 text-[13px] leading-relaxed text-text-muted">
                            <code className="font-mono">unknown</code> is a real state, not an error. It covers
                            ambiguous provider or network outcomes and is resolved by querying the provider — never
                            by assuming failure while the customer may already have been charged.
                        </p>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-[17px] font-medium">API keys</h2>
                        <ul className="mt-4 space-y-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                            <li className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                                Environment is visible in the prefix: <code className="font-mono">pr_test_</code> and{' '}
                                <code className="font-mono">pr_live_</code>.
                            </li>
                            <li className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                                The secret is shown once at creation; only a hash is stored.
                            </li>
                            <li className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                                Keys carry a label, creation date, last-used timestamp, and optional scopes and IP
                                restrictions.
                            </li>
                            <li className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                                Rotate or revoke at any time. Provider credentials are never used as platform keys.
                            </li>
                        </ul>
                    </Card>
                </div>
            </PageContainer>

            <SecuritySection />
            <FinalCTA />
        </>
    );
}
