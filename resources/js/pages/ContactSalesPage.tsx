import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input, Textarea } from '@/components/ui/Input';
import { api, ApiError } from '@/lib/api';
import { brand } from '@/lib/brand';
import { track } from '@/lib/analytics';
import { usePageMeta } from '@/app/usePageMeta';

type Errors = Record<string, string[]>;

export function ContactSalesPage() {
    usePageMeta(
        `Talk to Sales — ${brand.productName}`,
        'Contact the team about enterprise routing, provider strategy, and volume pricing.',
    );

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [done, setDone] = useState<string | null>(null);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});
        setFormError(null);

        const form = new FormData(event.currentTarget);

        try {
            const result = await api.contactSales({
                name: form.get('name'),
                work_email: form.get('work_email'),
                company: form.get('company'),
                monthly_volume: form.get('monthly_volume'),
                message: form.get('message'),
                consent: form.get('consent') === 'on',
                website: form.get('website'),
            });

            track('contact_sales_clicked', { outcome: 'submitted' });
            setDone(result.message);
        } catch (error) {
            if (error instanceof ApiError && error.status === 422) {
                setErrors(error.errors);
            } else {
                setFormError(error instanceof Error ? error.message : 'Something went wrong.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const fieldError = (key: string) => errors[key]?.[0];

    return (
        <>
            <PageHeader
                eyebrow="Enterprise"
                title="Talk to sales"
                description="Tell us about your payment stack — providers, volumes, and what you need routing to do."
            />

            <PageContainer className="py-10 sm:py-14">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                    <Card className="p-6 sm:p-8">
                        {done ? (
                            <div role="status" className="flex flex-col items-center gap-3 py-10 text-center">
                                <CheckCircle2 aria-hidden="true" className="size-6 text-success" />
                                <p className="text-[16px] font-medium">Message sent</p>
                                <p className="max-w-[40ch] text-[14px] text-text-secondary">{done}</p>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} noValidate className="space-y-5">
                                {formError && (
                                    <p role="alert" className="rounded-[10px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                                        {formError}
                                    </p>
                                )}

                                <Field label="Your name" htmlFor="name" error={fieldError('name')}>
                                    <Input
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        required
                                        aria-invalid={Boolean(fieldError('name'))}
                                        aria-describedby={fieldError('name') ? 'name-error' : undefined}
                                    />
                                </Field>

                                <Field label="Work email" htmlFor="work_email" error={fieldError('work_email')}>
                                    <Input
                                        id="work_email"
                                        name="work_email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        aria-invalid={Boolean(fieldError('work_email'))}
                                        aria-describedby={fieldError('work_email') ? 'work_email-error' : undefined}
                                    />
                                </Field>

                                <Field label="Company" htmlFor="company" error={fieldError('company')}>
                                    <Input
                                        id="company"
                                        name="company"
                                        autoComplete="organization"
                                        required
                                        aria-invalid={Boolean(fieldError('company'))}
                                    />
                                </Field>

                                <Field
                                    label="Monthly payment volume"
                                    htmlFor="monthly_volume"
                                    hint="Optional — a rough range is fine."
                                    error={fieldError('monthly_volume')}
                                >
                                    <Input id="monthly_volume" name="monthly_volume" />
                                </Field>

                                <Field label="What are you building?" htmlFor="message" error={fieldError('message')}>
                                    <Textarea id="message" name="message" />
                                </Field>

                                {/* Honeypot — hidden from users, ignored by them, filled by bots. */}
                                <div aria-hidden="true" className="hidden">
                                    <label htmlFor="website">Website</label>
                                    <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                                </div>

                                <div className="flex items-start gap-3">
                                    <input
                                        id="consent"
                                        name="consent"
                                        type="checkbox"
                                        required
                                        className="mt-1 size-4 shrink-0 rounded border-border-strong bg-surface-raised accent-brand"
                                        aria-invalid={Boolean(fieldError('consent'))}
                                    />
                                    <label htmlFor="consent" className="text-[13.5px] leading-relaxed text-text-secondary">
                                        I agree that {brand.productName} may store these details and contact me about
                                        this enquiry.
                                        {fieldError('consent') && (
                                            <span className="mt-1 block text-danger">{fieldError('consent')}</span>
                                        )}
                                    </label>
                                </div>

                                <Button type="submit" size="lg" disabled={submitting} className="w-full">
                                    {submitting ? 'Sending…' : 'Send message'}
                                </Button>
                            </form>
                        )}
                    </Card>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-[17px] font-medium">What happens next</h2>
                            <ol className="mt-4 space-y-3 text-[14px] leading-relaxed text-text-secondary">
                                <li>1. We read your message and check which provider connections apply to you.</li>
                                <li>2. We walk through routing, reconciliation, and what your team needs to build.</li>
                                <li>3. You get written pricing and terms — nothing quoted from this page.</li>
                            </ol>
                        </div>

                        <div className="border-t border-border-subtle pt-6">
                            <h2 className="text-[15px] font-medium">Prefer email?</h2>
                            <p className="mt-2 text-[14px] text-text-secondary">
                                <a href={`mailto:${brand.salesEmail}`} className="hover:text-brand">
                                    {brand.salesEmail}
                                </a>
                            </p>
                            <p className="mt-4 text-[13px] leading-relaxed text-text-muted">
                                For technical questions, reach{' '}
                                <a href={`mailto:${brand.supportEmail}`} className="hover:text-brand">
                                    {brand.supportEmail}
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </>
    );
}
