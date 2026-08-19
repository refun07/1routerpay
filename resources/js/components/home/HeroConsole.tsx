import { useState } from 'react';
import { CodeBlock } from '@/components/developer/CodeBlock';
import { Tabs } from '@/components/ui/Tabs';
import { CREATE_PAYMENT_SNIPPETS, PAYMENT_RESPONSE } from '@/lib/snippets';
import { track } from '@/lib/analytics';

/**
 * The hero console. A real request shape and a real response shape — no typing
 * animation, no invented latency, no fabricated transaction data.
 */
export function HeroConsole() {
    const [language, setLanguage] = useState(CREATE_PAYMENT_SNIPPETS[0].id);

    const onChange = (id: string) => {
        setLanguage(id);
        track('code_language_changed', { language: id, surface: 'hero' });
    };

    return (
        <div className="overflow-hidden rounded-[16px] border border-border-subtle bg-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between gap-4 border-b border-border-subtle bg-surface-raised/60 px-3 py-2">
                <Tabs
                    label="Code example language"
                    items={CREATE_PAYMENT_SNIPPETS.map((snippet) => ({
                        id: snippet.id,
                        label: snippet.label,
                        panel: null,
                    }))}
                    activeId={language}
                    onChange={onChange}
                    className="contents"
                />

                <span className="hidden shrink-0 items-center gap-2 font-mono text-[11px] text-text-muted sm:inline-flex">
                    POST /v1/payments
                </span>
            </div>

            {CREATE_PAYMENT_SNIPPETS.filter((snippet) => snippet.id === language).map((snippet) => (
                <CodeBlock
                    key={snippet.id}
                    code={snippet.code}
                    language={snippet.language}
                    label={`${snippet.label} example`}
                />
            ))}

            <div className="border-t border-border-subtle bg-surface-raised/40">
                <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-muted">
                        Response
                    </span>
                    <span className="rounded border border-border-subtle bg-surface px-1.5 font-mono text-[11px] text-text-secondary">
                        201
                    </span>
                </div>
                <CodeBlock code={PAYMENT_RESPONSE} language="json" label="Example response" maxHeight="230px" />
            </div>
        </div>
    );
}
