import { useState } from 'react';
import { Section, SectionHeading } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { CodeBlock } from '@/components/developer/CodeBlock';
import { ApiMethodBadge } from '@/components/developer/ApiMethodBadge';
import { API_ENDPOINTS, CREATE_PAYMENT_SNIPPETS, WEBHOOK_EVENT } from '@/lib/snippets';
import { track } from '@/lib/analytics';

const WEBHOOK_GUARANTEES = [
    'HMAC signature over the raw body',
    'Timestamp and event ID for replay protection',
    'Per-endpoint signing secret',
    'Retries with delivery logs',
    'Idempotent event processing',
];

export function DeveloperSection() {
    // PHP first here — the Laravel audience is the primary reader of this section.
    const ordered = [...CREATE_PAYMENT_SNIPPETS].sort(
        (a, b) => ['php', 'javascript', 'curl'].indexOf(a.id) - ['php', 'javascript', 'curl'].indexOf(b.id),
    );
    const [language, setLanguage] = useState(ordered[0].id);

    const onChange = (id: string) => {
        setLanguage(id);
        track('code_language_changed', { language: id, surface: 'developer' });
    };

    return (
        <Section id="developers" aria-labelledby="developers-heading" tone="raised" bordered>
            <SectionHeading
                id="developers-heading"
                title="A payment API developers can reason about"
                description="Consistent request objects, predictable states, signed webhooks, idempotency, and clear provider visibility — so your application code does not depend on every provider's individual response format."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
                <Card className="overflow-hidden">
                    <div className="border-b border-border-subtle bg-surface-raised/40 px-3 py-2">
                        <Tabs
                            label="Server example language"
                            items={ordered.map((snippet) => ({
                                id: snippet.id,
                                label: snippet.label,
                                panel: null,
                            }))}
                            activeId={language}
                            onChange={onChange}
                        />
                    </div>

                    {ordered
                        .filter((snippet) => snippet.id === language)
                        .map((snippet) => (
                            <CodeBlock
                                key={snippet.id}
                                code={snippet.code}
                                language={snippet.language}
                                label={`${snippet.label} example`}
                                maxHeight="340px"
                            />
                        ))}
                </Card>

                <Card className="overflow-hidden">
                    <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                            API surface
                        </h3>
                    </div>

                    <ul className="divide-y divide-border-subtle">
                        {API_ENDPOINTS.map((endpoint) => (
                            <li
                                key={`${endpoint.method}-${endpoint.path}`}
                                className="flex items-center gap-3 px-5 py-2.5"
                            >
                                <ApiMethodBadge method={endpoint.method} />
                                <code className="truncate font-mono text-[12.5px] text-text-secondary">
                                    {endpoint.path}
                                </code>
                                <span className="ml-auto hidden truncate text-[12px] text-text-muted xl:block">
                                    {endpoint.description}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <div id="webhooks" className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
                <Card className="p-6">
                    <h3 className="text-[19px] font-medium tracking-[-0.01em]">One webhook format</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-text-secondary">
                        Upstream provider callbacks are verified server-to-server, then normalized into a single
                        event schema your application handles once.
                    </p>

                    <ul className="mt-5 space-y-2.5 text-[13.5px] text-text-secondary">
                        {WEBHOOK_GUARANTEES.map((item) => (
                            <li key={item} className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card className="overflow-hidden">
                    <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                            payment.succeeded
                        </p>
                    </div>
                    <CodeBlock code={WEBHOOK_EVENT} language="json" label="Webhook event example" />
                </Card>
            </div>
        </Section>
    );
}
