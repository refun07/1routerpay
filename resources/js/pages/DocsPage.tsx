import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { CodeBlock } from '@/components/developer/CodeBlock';
import { brand } from '@/lib/brand';
import { cn } from '@/lib/cn';
import { track } from '@/lib/analytics';
import { CREATE_PAYMENT_SNIPPETS, PAYMENT_RESPONSE, WEBHOOK_EVENT } from '@/lib/snippets';
import { usePageMeta } from '@/app/usePageMeta';

const SECTIONS = [
    { id: 'get-a-key', label: 'Get an API key' },
    { id: 'first-payment', label: 'Create a payment' },
    { id: 'handle-response', label: 'Handle the response' },
    { id: 'verify-webhook', label: 'Verify the webhook' },
    { id: 'go-live', label: 'Go live checklist' },
];

const VERIFY_WEBHOOK = `// Verify before you trust. Compare in constant time.
const signature = request.headers['x-payrouter-signature'];
const timestamp = request.headers['x-payrouter-timestamp'];

const expected = crypto
  .createHmac('sha256', process.env.PAYROUTER_WEBHOOK_SECRET)
  .update(\`\${timestamp}.\${rawBody}\`)
  .digest('hex');

const valid =
  crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) &&
  Math.abs(Date.now() / 1000 - Number(timestamp)) < 300;

if (!valid) {
  return response.status(400).send('invalid signature');
}

// Safe to act on now.
const event = JSON.parse(rawBody);`;

const GO_LIVE = [
    'Swap pr_test_ for pr_live_ — and load it from the environment, never from source control.',
    'Point your webhook endpoint at production and confirm you receive a signed test event.',
    'Verify signatures and reject anything that fails. An unverified callback must never mark a payment successful.',
    'Handle duplicate events. The same event can arrive twice; process it once.',
    'Send an idempotency key on every create so a retried request cannot double-charge.',
    'Decide what your checkout shows for a pending payment — it is not a failure.',
    'Confirm settlement expectations with each provider before your first real payout.',
];

/** Tracks which section is in view so the sidebar reflects your position. */
function useActiveSection(ids: string[]) {
    const [active, setActive] = useState(ids[0]);

    useEffect(() => {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

                if (visible) setActive(visible.target.id);
            },
            { rootMargin: '-20% 0px -70% 0px' },
        );

        ids.forEach((id) => {
            const node = document.getElementById(id);
            if (node) observer.observe(node);
        });

        return () => observer.disconnect();
    }, [ids]);

    return active;
}

function Step({
    id,
    number,
    title,
    children,
}: {
    id: string;
    number: number;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-24 border-t border-border-subtle pt-10 first:border-t-0 first:pt-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                Step {number}
            </p>
            <h2 className="mt-2 text-[26px] font-medium tracking-[-0.02em]">{title}</h2>
            <div className="mt-5 space-y-5">{children}</div>
        </section>
    );
}

export function DocsPage() {
    usePageMeta(
        `Quickstart — ${brand.productName} Docs`,
        'Go from an API key to your first routed payment, then verify the webhook and go live.',
    );

    const active = useActiveSection(SECTIONS.map((section) => section.id));
    const [language, setLanguage] = useState(CREATE_PAYMENT_SNIPPETS[0].id);

    return (
        <PageContainer wide className="py-12 sm:py-16">
            <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
                <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                        Quickstart
                    </p>
                    <ul className="space-y-1 border-l border-border-subtle">
                        {SECTIONS.map((section) => (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    aria-current={active === section.id ? 'true' : undefined}
                                    className={cn(
                                        '-ml-px block border-l py-1.5 pl-4 text-[13.5px] transition-colors duration-200',
                                        active === section.id
                                            ? 'border-brand text-text-primary'
                                            : 'border-transparent text-text-muted hover:border-border-strong hover:text-text-secondary',
                                    )}
                                >
                                    {section.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="min-w-0">
                    <header className="mb-12">
                        <Badge tone="brand" mono>
                            Quickstart
                        </Badge>
                        <h1 className="mt-4 text-balance text-[38px] font-medium leading-[1.1] tracking-[-0.028em] sm:text-[46px]">
                            Your first routed payment
                        </h1>
                        <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
                            Five steps, about fifteen minutes. You will create a payment, read the normalized
                            response, verify a signed webhook, and know exactly what to check before going live.
                        </p>
                    </header>

                    <div className="space-y-10">
                        <Step id="get-a-key" number={1} title="Get an API key">
                            <p className="max-w-[68ch] text-[15px] leading-relaxed text-text-secondary">
                                Keys carry their environment in the prefix, so a test key can never reach
                                production by accident.
                            </p>

                            <Card className="p-5">
                                <dl className="space-y-3 font-mono text-[13px]">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <dt className="w-24 text-text-muted">sandbox</dt>
                                        <dd className="text-text-secondary">pr_test_xxxxxxxxxxxxxxxxx</dd>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <dt className="w-24 text-text-muted">production</dt>
                                        <dd className="text-text-secondary">pr_live_xxxxxxxxxxxxxxxxx</dd>
                                    </div>
                                </dl>
                            </Card>

                            <div className="flex items-start gap-3 rounded-[12px] border border-warning/30 bg-warning/[0.06] px-4 py-3.5">
                                <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
                                <p className="text-[13.5px] leading-relaxed text-text-secondary">
                                    The secret is shown once, at creation. We store only a hash, so we cannot show
                                    it again — rotate the key if you lose it. Never put it in frontend code, a
                                    mobile app, or local storage.
                                </p>
                            </div>

                            <ButtonLink to="/register" onClick={() => track('signup_started', { surface: 'docs' })}>
                                Create an account
                            </ButtonLink>
                        </Step>

                        <Step id="first-payment" number={2} title="Create a payment">
                            <p className="max-w-[68ch] text-[15px] leading-relaxed text-text-secondary">
                                One request shape, whichever provider ends up handling it. Set{' '}
                                <code className="font-mono text-[13.5px] text-text-primary">routing</code> to{' '}
                                <code className="font-mono text-[13.5px] text-text-primary">smart</code> and the
                                engine picks a healthy route using your rules.
                            </p>

                            <Card className="overflow-hidden">
                                <div className="border-b border-border-subtle bg-surface-raised/40 px-3 py-2">
                                    <Tabs
                                        label="Quickstart language"
                                        items={CREATE_PAYMENT_SNIPPETS.map((snippet) => ({
                                            id: snippet.id,
                                            label: snippet.label,
                                            panel: null,
                                        }))}
                                        activeId={language}
                                        onChange={(id) => {
                                            setLanguage(id);
                                            track('code_language_changed', { language: id, surface: 'docs' });
                                        }}
                                    />
                                </div>

                                {CREATE_PAYMENT_SNIPPETS.filter((snippet) => snippet.id === language).map(
                                    (snippet) => (
                                        <CodeBlock
                                            key={snippet.id}
                                            code={snippet.code}
                                            language={snippet.language}
                                            label={`${snippet.label} quickstart example`}
                                        />
                                    ),
                                )}
                            </Card>

                            <p className="max-w-[68ch] text-[14px] leading-relaxed text-text-muted">
                                Send an idempotency key with every create. If the request times out and you retry
                                it, the key is what stops a second charge.
                            </p>
                        </Step>

                        <Step id="handle-response" number={3} title="Handle the response">
                            <p className="max-w-[68ch] text-[15px] leading-relaxed text-text-secondary">
                                Redirect the customer to{' '}
                                <code className="font-mono text-[13.5px] text-text-primary">checkout_url</code>. The
                                payment starts as{' '}
                                <code className="font-mono text-[13.5px] text-text-primary">pending</code> — that is
                                normal, not a failure.
                            </p>

                            <Card className="overflow-hidden">
                                <CodeBlock code={PAYMENT_RESPONSE} language="json" label="Payment response" />
                            </Card>

                            <div className="flex items-start gap-3 rounded-[12px] border border-danger/30 bg-danger/[0.06] px-4 py-3.5">
                                <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" />
                                <p className="text-[13.5px] leading-relaxed text-text-secondary">
                                    Do not mark the order paid when the customer returns to your success URL. A
                                    browser redirect is not proof of payment — anyone can visit that URL. Wait for
                                    the webhook.
                                </p>
                            </div>
                        </Step>

                        <Step id="verify-webhook" number={4} title="Verify the webhook">
                            <p className="max-w-[68ch] text-[15px] leading-relaxed text-text-secondary">
                                Every provider callback is verified by us, then re-emitted to you in one schema and
                                signed with your endpoint secret. Verify it before you act on it.
                            </p>

                            <Card className="overflow-hidden">
                                <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                                        payment.succeeded
                                    </p>
                                </div>
                                <CodeBlock code={WEBHOOK_EVENT} language="json" label="Webhook payload" />
                            </Card>

                            <Card className="overflow-hidden">
                                <CodeBlock
                                    code={VERIFY_WEBHOOK}
                                    language="javascript"
                                    label="Signature verification example"
                                />
                            </Card>

                            <p className="max-w-[68ch] text-[14px] leading-relaxed text-text-muted">
                                Respond 2xx once you have stored the event. Retries are expected, so make handling
                                idempotent — key on{' '}
                                <code className="font-mono text-[13.5px] text-text-secondary">id</code> and ignore
                                events you have already processed.
                            </p>
                        </Step>

                        <Step id="go-live" number={5} title="Go live checklist">
                            <ul className="space-y-3">
                                {GO_LIVE.map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand" />
                                        <span className="text-[14.5px] leading-relaxed text-text-secondary">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
                                <p className="text-[14px] text-text-secondary">
                                    Want the full object model and every endpoint?
                                </p>
                                <ButtonLink to="/developers" variant="secondary" size="sm">
                                    API reference
                                </ButtonLink>
                            </Card>
                        </Step>
                    </div>

                    <p className="mt-12 border-t border-border-subtle pt-6 text-[13.5px] leading-relaxed text-text-muted">
                        Stuck on something this page does not cover?{' '}
                        <Link to="/contact-sales" className="text-text-secondary hover:text-brand">
                            Talk to us
                        </Link>{' '}
                        or email{' '}
                        <a href={`mailto:${brand.supportEmail}`} className="text-text-secondary hover:text-brand">
                            {brand.supportEmail}
                        </a>
                        .
                    </p>
                </div>
            </div>
        </PageContainer>
    );
}
