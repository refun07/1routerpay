import {
    FileClock,
    FileSignature,
    KeyRound,
    Layers2,
    RefreshCcwDot,
    Users,
} from 'lucide-react';
import { Section, SectionHeading } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';

const CARDS = [
    {
        icon: FileSignature,
        title: 'Signed Webhooks',
        copy: 'Verify every server-to-server event.',
    },
    {
        icon: RefreshCcwDot,
        title: 'Idempotency',
        copy: 'Prevent duplicate request processing.',
    },
    {
        icon: KeyRound,
        title: 'Encrypted Secrets',
        copy: 'Provider credentials encrypted at rest.',
    },
    {
        icon: Users,
        title: 'Role-Based Access',
        copy: 'Separate developer, finance, operations, and admin permissions.',
    },
    {
        icon: FileClock,
        title: 'Audit Logs',
        copy: 'Track sensitive configuration and account changes.',
    },
    {
        icon: Layers2,
        title: 'Environment Separation',
        copy: 'Strict sandbox and production separation.',
    },
];

export function SecuritySection() {
    return (
        <Section id="security" aria-labelledby="security-heading" bordered>
            <SectionHeading
                id="security-heading"
                title="Payment infrastructure is security infrastructure"
                description="Signed callbacks, idempotent APIs, immutable event history, encrypted credentials, audit logs, and strict environment separation."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CARDS.map(({ icon: Icon, title, copy }) => (
                    <Card key={title} interactive className="p-5">
                        <Icon aria-hidden="true" className="size-[18px] text-brand" />
                        <h3 className="mt-4 text-[15px] font-medium">{title}</h3>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">{copy}</p>
                    </Card>
                ))}
            </div>

            <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-text-muted">
                API keys are hashed at rest and shown in plaintext exactly once, at creation. Secrets are never
                returned to the browser or stored in local storage. Keys support labels, scopes, rotation, and
                revocation.
            </p>
        </Section>
    );
}
