import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Input';
import { LogoMark } from '@/components/layout/Logo';
import { brand } from '@/lib/brand';
import { track } from '@/lib/analytics';
import { usePageMeta } from '@/app/usePageMeta';
import { useAuth } from '@/app/AuthProvider';
import { auth } from '@/lib/auth-api';
import { ApiError } from '@/lib/api';

/**
 * Account creation.
 *
 * Creates the user and their organization in one step, signs them in, and drops
 * them on the dashboard where they can issue their first sandbox key. No
 * disabled fake SSO buttons — only what actually exists.
 */
export function RegisterPage() {
    usePageMeta(
        `Create your account — ${brand.productName}`,
        `Create a ${brand.productName} account and generate sandbox API keys.`,
    );

    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});
        setFormError(null);

        const form = new FormData(event.currentTarget);

        try {
            const profile = await auth.register({
                name: form.get('name'),
                email: form.get('email'),
                password: form.get('password'),
                organization: form.get('organization'),
            });

            track('signup_completed');
            setUser(profile);
            navigate('/dashboard');
        } catch (cause) {
            if (cause instanceof ApiError && cause.status === 422) {
                setErrors(cause.errors);
            } else {
                setFormError('Could not create your account.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const fieldError = (key: string) => errors[key]?.[0];

    return (
        <PageContainer className="flex min-h-[calc(100vh-68px)] items-center justify-center py-16">
            <div className="w-full max-w-[420px]">
                <div className="mb-8 text-center">
                    <LogoMark className="mx-auto size-7" />
                    <h1 className="mt-5 text-[26px] font-medium tracking-[-0.02em]">Create your account</h1>
                    <p className="mt-2 text-[14px] text-text-secondary">
                        Sandbox keys are available as soon as your organization is set up.
                    </p>
                </div>

                <Card className="p-6">
                    <form className="space-y-5" onSubmit={onSubmit} noValidate>
                        {formError && (
                            <p role="alert" className="rounded-[10px] border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] text-danger">
                                {formError}
                            </p>
                        )}

                        <Field label="Your name" htmlFor="name" error={fieldError('name')}>
                            <Input id="name" name="name" autoComplete="name" required />
                        </Field>

                        <Field label="Work email" htmlFor="email" error={fieldError('email')}>
                            <Input id="email" name="email" type="email" autoComplete="email" required />
                        </Field>

                        <Field label="Password" htmlFor="password" hint="At least 12 characters." error={fieldError('password')}>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                minLength={12}
                                required
                            />
                        </Field>

                        <Field label="Organization name" htmlFor="organization" error={fieldError('organization')}>
                            <Input id="organization" name="organization" autoComplete="organization" required />
                        </Field>

                        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                            {submitting ? 'Creating account…' : 'Create account'}
                        </Button>
                    </form>

                </Card>

                <p className="mt-6 text-center text-[14px] text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="text-text-primary hover:text-brand">
                        Sign in
                    </Link>
                </p>
            </div>
        </PageContainer>
    );
}
