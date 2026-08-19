import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Input';
import { LogoMark } from '@/components/layout/Logo';
import { brand } from '@/lib/brand';
import { usePageMeta } from '@/app/usePageMeta';
import { useAuth } from '@/app/AuthProvider';
import { auth } from '@/lib/auth-api';
import { ApiError } from '@/lib/api';

/** Sign-in UI. The session itself is issued by the dashboard phase. */
export function LoginPage() {
    usePageMeta(`Sign in — ${brand.productName}`, `Sign in to your ${brand.productName} account.`);

    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const form = new FormData(event.currentTarget);

        try {
            const profile = await auth.login({
                email: form.get('email'),
                password: form.get('password'),
            });

            setUser(profile);
            navigate('/dashboard');
        } catch (cause) {
            setError(
                cause instanceof ApiError
                    ? (Object.values(cause.errors)[0]?.[0] ?? cause.message)
                    : 'Could not sign in.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageContainer className="flex min-h-[calc(100vh-68px)] items-center justify-center py-16">
            <div className="w-full max-w-[420px]">
                <div className="mb-8 text-center">
                    <LogoMark className="mx-auto size-7" />
                    <h1 className="mt-5 text-[26px] font-medium tracking-[-0.02em]">Sign in</h1>
                    <p className="mt-2 text-[14px] text-text-secondary">
                        Access your merchant dashboard and API keys.
                    </p>
                </div>

                <Card className="p-6">
                    <form className="space-y-5" onSubmit={onSubmit} noValidate>
                        {error && (
                            <p role="alert" className="rounded-[10px] border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] text-danger">
                                {error}
                            </p>
                        )}

                        <Field label="Work email" htmlFor="email">
                            <Input id="email" name="email" type="email" autoComplete="email" required />
                        </Field>

                        <Field label="Password" htmlFor="password">
                            <Input id="password" name="password" type="password" autoComplete="current-password" required />
                        </Field>

                        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                            {submitting ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </form>

                </Card>

                <p className="mt-6 text-center text-[14px] text-text-secondary">
                    Need an account?{' '}
                    <Link to="/register" className="text-text-primary hover:text-brand">
                        Create one
                    </Link>
                </p>
            </div>
        </PageContainer>
    );
}
